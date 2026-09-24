import { z } from "zod";

export const topicIds = ["agents", "retrieval", "fintech", "infrastructure", "learning", "product"];
export const kinds = ["concept", "note", "project", "experience", "publication", "reference"];
const id = z.string().regex(/^[a-z0-9][a-z0-9-]{0,150}$/);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value);
const url = z.string().max(1500).refine(value => /^\/(?!\/)[^\s\\]*$/.test(value) || (() => { try { const u = new URL(value); return u.protocol === "https:" && !u.username && !u.password; } catch { return false; } })(), "Expected a public HTTPS or site-relative URL");
export const knowledgeRecordSchema = z.object({
  id, kind: z.enum(kinds), title: z.string().trim().min(1).max(220),
  summary: z.string().trim().min(1).max(800), body: z.string().trim().min(1).max(16000),
  topics: z.array(z.enum(topicIds)).min(1).max(6), status: z.literal("public"), updatedAt: date,
  source: z.object({ title: z.string().min(1).max(220), url, locator: z.string().max(300).optional(), revision: z.string().min(1).max(100) }).strict(),
  relations: z.array(z.object({ type: z.enum(["about", "derived-from", "applied-in", "part-of", "references"]), target: id }).strict()).max(30),
}).strict();

export function validateKnowledge(records) {
  const parsed = z.array(knowledgeRecordSchema).max(2000).parse(records);
  const ids = new Set(parsed.map(record => record.id));
  if (ids.size !== parsed.length) throw new Error("Duplicate knowledge ID");
  for (const record of parsed) {
    if (/-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(?:sk-|ghp_|github_pat_)[a-zA-Z0-9_-]{20,}/.test(JSON.stringify(record))) throw new Error(`Possible credential in ${record.id}`);
    for (const relation of record.relations) if (!ids.has(relation.target) || relation.target === record.id) throw new Error(`Invalid relation in ${record.id}: ${relation.target}`);
  }
  return parsed;
}
