import { z } from "zod";

const metadata = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9-]{0,100}$/),
  title: z.string().trim().min(1).max(180),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value),
  description: z.string().trim().min(1).max(320),
  tags: z.array(z.string().trim().min(1).max(40)).max(10),
  published: z.literal(true),
}).strict();

// A deliberately small YAML subset: scalar values and JSON-style tag arrays.
// No general YAML loader, embedded code, or automatic traversal of a private vault.
export function parsePublication(source) {
  if (Buffer.byteLength(source, "utf8") > 200_000) throw new Error("Article exceeds 200 KB.");
  const match = source.replaceAll("\r\n", "\n").match(/^---\n([\s\S]*?)\n---\n([\s\S]+)$/);
  if (!match) throw new Error("Expected publication frontmatter and Markdown body.");
  const fields = Object.create(null);
  for (const line of match[1].split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const field = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    if (!field || Object.hasOwn(fields, field[1])) throw new Error("Invalid or duplicate publication field.");
    const [, key, value] = field;
    fields[key] = /^[\["{]|^(true|false|null)$/.test(value) ? JSON.parse(value) : value;
  }
  const post = metadata.parse(fields);
  const markdown = match[2].trim();
  if (!markdown) throw new Error("Article body is empty.");
  if (/\[\[|!\[[^\]]*\]\((?!https:\/\/|\/)[^)]+\)|\]\((?:file:|obsidian:)/i.test(markdown)) throw new Error("Publish attachments to public HTTPS or / paths; private vault links are not supported.");
  if (/https?:\/\/[^\s)<>]*(?:X-Amz-(?:Signature|Credential|Expires)|[?&](?:Expires|Signature|AWSAccessKeyId)=)/i.test(markdown)) throw new Error("An attachment URL expires. Move approved assets to a durable public URL before importing.");
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(?:sk-|ghp_|github_pat_)[a-zA-Z0-9_-]{20,}/.test(source)) throw new Error("Possible credential in article; publication stopped.");
  return { post: { id: post.id, title: post.title, date: post.date, description: post.description, tags: post.tags }, markdown };
}

export function serializePublication(post, markdown) {
  const fields = { id: post.id, title: post.title, date: post.date.slice(0, 10), description: post.description, tags: post.tags, published: true };
  const source = `---\n${Object.entries(fields).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join("\n")}\n---\n\n${markdown.trim()}\n`;
  parsePublication(source);
  return source;
}

export function compilePublications(sources) {
  const entries = sources.map(parsePublication);
  if (new Set(entries.map(entry => entry.post.id)).size !== entries.length) throw new Error("Duplicate article ID; no output written.");
  return entries.sort((a, b) => b.post.date.localeCompare(a.post.date) || a.post.id.localeCompare(b.post.id));
}
