// Publication-time code only. The app imports the generated JSON, never this module.
import { createHash } from "node:crypto";
import { z } from "zod";
import { capabilities } from "./career-capabilities.mjs";

const identifier = z.string().regex(/^[a-z][a-z0-9-]*$/);
const knownTopics = new Set(capabilities.map(item => item.id));
const manifestSchema = z.object({
  version: z.literal(1),
  reviewedAt: z.iso.date(),
  items: z.array(z.object({
    id: identifier,
    title: z.string().trim().min(1).max(120),
    project: identifier,
    source: z.discriminatedUnion("kind", [
      z.object({ kind: z.literal("role"), id: identifier, bullet: identifier }).strict(),
      z.object({ kind: z.literal("research") }).strict(),
    ]),
    capabilities: z.array(identifier.refine(id => knownTopics.has(id), "Unknown capability")).min(1),
    details: z.array(identifier),
    discussion: z.string().trim().min(1).max(240),
  }).strict()).min(1),
}).strict();

function approvedText(value, reference) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`Missing approved evidence: ${reference}`);
  return value;
}

function approvedLink(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) throw new Error("Invalid public research source");
  return url.href;
}

function unique(values, label) {
  if (new Set(values).size !== values.length) throw new Error(`Duplicate ${label}`);
}

export function createEvidenceSnapshot(resume, input) {
  const manifest = manifestSchema.parse(input);
  unique(manifest.items.map(item => item.id), "evidence ID");
  const items = manifest.items.map(item => {
    unique(item.capabilities, `capability in ${item.id}`);
    unique(item.details, `detail in ${item.id}`);
    const { source, details, ...metadata } = item;
    if (source.kind === "research") {
      if (details.length) throw new Error("Research details must use approved research fields");
      return {
        ...metadata, kind: "research", company: "Gurukul", role: approvedText(resume.research?.title, "research.title"),
        period: null, context: null, claim: approvedText(resume.research?.description, "research.description"),
        href: approvedLink(resume.research?.thesis), sourceLabel: "Read the thesis",
        sources: [{ label: "Explore the research code", href: approvedLink(resume.research?.code) }],
        details: [], limitation: "Research evidence; this does not establish a commercial deployment.",
        factRef: "research.description",
      };
    }
    const role = resume.roles.find(role => role.id === source.id);
    const fact = key => approvedText(Object.hasOwn(role?.bullets ?? {}, key) ? role.bullets[key] : undefined, `${source.id}.${key}`);
    if (details.includes(source.bullet)) throw new Error(`Repeated primary claim in ${item.id}`);
    const limitation = source.id === "loan-labs" ? "Internal and pilot workflows; no claim of broad customer rollout." :
      source.id === "finally" && (source.bullet === "classify" || details.includes("classify")) ? "Technical leadership of three engineers; this does not establish formal people-management responsibility." :
      source.id === "finally" && (source.bullet === "close" || details.includes("close")) ? "A team outcome, not a claim of sole attribution." : null;
    return {
      ...metadata, kind: "work", company: approvedText(role?.company, `${source.id}.company`),
      role: approvedText(role?.title, `${source.id}.title`), period: approvedText(role?.dates, `${source.id}.dates`),
      context: role.context ?? null, claim: fact(source.bullet),
      href: `/work/${source.id}#${source.bullet}`, sourceLabel: "Read the public work", sources: [],
      details: details.map(key => ({ claim: fact(key), href: `/work/${source.id}#${key}`, factRef: `roles.${source.id}.bullets.${key}` })),
      limitation, factRef: `roles.${source.id}.bullets.${source.bullet}`,
    };
  });
  return {
    version: manifest.version, reviewedAt: manifest.reviewedAt,
    sourceDigest: createHash("sha256").update(JSON.stringify({ resume, manifest })).digest("hex"),
    items,
  };
}
