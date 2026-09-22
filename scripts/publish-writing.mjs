import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compilePublications, serializePublication } from "../src/lib/publishing.mjs";
import { publicationSources, importPublication, writeCatalog } from "../src/lib/publication-files.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const directory = resolve(root, "src/content/writing");
const output = resolve(root, "src/content/published-writing.json");

async function build() {
  const articles = compilePublications(await publicationSources(directory));
  await writeCatalog(articles, output);
  console.log(`Built ${articles.length} reviewed public articles.`);
}

const [command = "build", argument, ...flags] = process.argv.slice(2);
try {
  if (command === "build") await build();
  else if (command === "import") {
    if (!argument || !flags.includes("--publish")) throw new Error("Use import <one-approved-markdown-file> --publish. This copies public content into the repository.");
    const source = await readFile(resolve(argument), "utf8");
    const count = await importPublication(source, directory, output);
    console.log(`Imported approved Markdown. Catalog contains ${count} articles.`);
  } else if (command === "notion") {
    if (!argument || !/^[a-f0-9-]{32,36}$/i.test(argument) || !flags.includes("--publish")) throw new Error("Use notion <published-blog-page-id> --publish. Only pages already published in the blog database can be imported.");
    const { Client } = await import("@notionhq/client");
    const { loadBlogArticle } = await import("../src/lib/notion-blog.ts");
    if (!process.env.NOTION_API_KEY) throw new Error("NOTION_API_KEY is not configured.");
    const article = await loadBlogArticle(new Client({ auth: process.env.NOTION_API_KEY, timeoutMs: 15000 }), argument);
    if (!article) throw new Error("This page is not a published blog article.");
    const source = serializePublication(article.post, article.markdown);
    const count = await importPublication(source, directory, output);
    console.log(`Imported published Notion article. Catalog contains ${count} articles.`);
  } else throw new Error("Commands: build; import <file> --publish; notion <id> --publish.");
} catch (error) {
  // Never dump an upstream response, request, or environment on publication errors.
  console.error(error?.code === "EEXIST" ? "A reviewed article already owns this ID. Edit that file explicitly; import will not overwrite it." : error instanceof Error && error.name !== "APIResponseError" ? error.message : "Publication failed. Check source access and try again.");
  process.exitCode = 1;
}
