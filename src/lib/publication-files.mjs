import { mkdir, readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { compilePublications, parsePublication } from "./publishing.mjs";

export async function publicationSources(directory) {
  await mkdir(directory, { recursive: true });
  const names = (await readdir(directory)).filter(name => name.endsWith(".md")).sort();
  return Promise.all(names.map(name => readFile(resolve(directory, name), "utf8")));
}

export async function writeCatalog(articles, output) {
  const temporary = `${output}.${process.pid}.tmp`;
  try { await writeFile(temporary, JSON.stringify(articles, null, 2) + "\n"); await rename(temporary, output); }
  finally { await unlink(temporary).catch(() => {}); }
}

export async function importPublication(source, directory, output, persist = writeCatalog) {
  const article = parsePublication(source);
  // Validate the entire proposed catalog before changing either source or output.
  const articles = compilePublications([...(await publicationSources(directory)), source]);
  const destination = resolve(directory, `${article.post.id}.md`);
  await writeFile(destination, source, { flag: "wx" });
  try { await persist(articles, output); }
  catch (error) { await unlink(destination); throw error; }
  return articles.length;
}
