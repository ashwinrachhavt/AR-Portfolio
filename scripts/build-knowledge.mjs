import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { validateKnowledge } from "../src/lib/knowledge-schema.mjs";
import { projects } from "../src/data/projects.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const content = path.join(root, "src/content");
const readJSON = async file => JSON.parse(await readFile(file, "utf8"));
const [resume, publications] = await Promise.all([readJSON(path.join(content, "resume.json")), readJSON(path.join(content, "published-writing.json"))]);
const sourcePath = process.argv[2];
const curated = await readJSON(sourcePath ? path.resolve(sourcePath) : path.join(content, "knowledge/curated.json"));
if (curated.schemaVersion !== 1 || !Array.isArray(curated.records)) throw new Error("Expected a reviewed version 1 knowledge export");
const projectTopics = { lois: ["agents", "infrastructure"], "classify-ai": ["retrieval", "fintech"], "cash-underwriting": ["fintech", "infrastructure"], "bank-connections": ["fintech", "infrastructure"], "unar-labs": ["learning", "infrastructure"], "outreach-template-project": ["infrastructure"], gurukul: ["learning", "retrieval"] };
const base = { status: "public", updatedAt: resume.asOf };
const publicationTopics = await readJSON(path.join(content, "knowledge/publication-topics.json"));
const records = [...curated.records];
const experienceIds = new Set();
for (const project of projects) {
  const topics = projectTopics[project.id];
  if (!topics) throw new Error(`Assign approved topics to ${project.id}`);
  const evidence = project.bullets.map(bullet => {
    const id = `experience-${project.roleId || "gurukul"}-${bullet.key}`;
    if (!experienceIds.has(id)) {
      experienceIds.add(id);
      records.push({ ...base, id, kind: "experience", title: `${project.company} · ${bullet.key.replaceAll("-", " ")}`, summary: bullet.text, body: bullet.text, topics, source: { title: "Approved career facts", url: project.href, locator: bullet.source, revision: resume.asOf }, relations: [{ type: "applied-in", target: `project-${project.id}` }, ...topics.map(t => ({ type: "about", target: `concept-${t}` }))] });
    }
    return { type: "derived-from", target: id };
  });
  records.push({ ...base, id: `project-${project.id}`, kind: "project", title: project.title, summary: project.summary, body: `${project.category} · ${project.status}\n\n${project.focus}\n\n${project.bullets.map(b => b.text).join("\n\n")}`, topics, source: { title: `${project.title} · project evidence`, url: project.href, revision: resume.asOf }, relations: [...evidence, ...topics.map(t => ({ type: "about", target: `concept-${t}` }))] });
}

// Keep every approved career fact discoverable, including work outside the seven panes.
for (const role of resume.roles) {
  for (const [key, body] of Object.entries(role.bullets)) {
    const id = `experience-${role.id}-${key}`;
    if (experienceIds.has(id)) continue;
    const topics = key === "leadership" ? ["product", "agents"] : ["infrastructure", "learning"];
    records.push({ ...base, id, kind: "experience", title: `${role.company} · ${key}`, summary: body, body, topics, source: { title: "Approved career facts", url: `/work/${role.id}`, locator: `src/content/resume.json#roles/${role.id}/bullets/${key}`, revision: resume.asOf }, relations: topics.map(t => ({ type: "about", target: `concept-${t}` })) });
  }
}

function plain(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, " ").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`#]/g, "").replace(/<[^>]+>/g, "").trim();
}
for (const { post, markdown } of publications) {
  const topics = publicationTopics[post.id];
  if (!Array.isArray(topics) || !topics.length) throw new Error(`Review topic assignments for article ${post.id} in src/content/knowledge/publication-topics.json before indexing it.`);
  const id = `publication-${post.id}`;
  const source = { title: post.title, url: `/blog/${post.id}`, revision: createHash("sha256").update(markdown).digest("hex").slice(0, 16) };
  records.push({ status: "public", updatedAt: post.date.slice(0, 10), id, kind: "publication", title: post.title, summary: post.description, body: post.description, topics, source, relations: topics.map(t => ({ type: "about", target: `concept-${t}` })) });
  const sections = markdown.split(/^## /m).slice(1);
  for (const section of sections) {
    const [heading, ...lines] = section.split("\n");
    const body = plain(lines.join("\n"));
    if (body.length < 70 || heading === "Read the source") continue;
    const slug = heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    records.push({ status: "public", updatedAt: post.date.slice(0, 10), id: `${id}-${slug}`, kind: "note", title: heading, summary: body.slice(0, 400), body, topics, source: { ...source, locator: heading }, relations: [{ type: "part-of", target: id }, ...topics.map(t => ({ type: "about", target: `concept-${t}` }))] });
  }
}
const validated = validateKnowledge(records).sort((a, b) => a.id.localeCompare(b.id));
const revision = createHash("sha256").update(JSON.stringify(validated)).digest("hex").slice(0, 16);
const catalog = JSON.stringify({ schemaVersion: 1, revision, records: validated }, null, 2) + "\n";
const directory = path.join(content, "knowledge");
await mkdir(directory, { recursive: true });
// Validate the full graph before replacing either artifact. Publication is explicit.
if (sourcePath) {
  await writeFile(path.join(directory, "curated.json.tmp"), JSON.stringify(curated, null, 2) + "\n");
  await rename(path.join(directory, "curated.json.tmp"), path.join(directory, "curated.json"));
}
await writeFile(path.join(directory, "catalog.json.tmp"), catalog);
await rename(path.join(directory, "catalog.json.tmp"), path.join(directory, "catalog.json"));
console.log(`Knowledge: ${validated.length} public records · revision ${revision}`);
