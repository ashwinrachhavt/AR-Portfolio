import test from "node:test";
import assert from "node:assert/strict";
import { compilePublications, parsePublication, serializePublication } from "./publishing.mjs";
import { localArticle, localWritingIndex, mergeOriginals } from "./local-writing.mjs";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { importPublication } from "./publication-files.mjs";

const post = { id: "an-idea", title: "An idea", date: "2026-09-22", description: "An approved public idea.", tags: ["Product"] };
const source = () => serializePublication(post, "A public article with [a link](https://example.com).");

test("Obsidian-compatible frontmatter roundtrips public content", () => {
  const result = parsePublication(source()); assert.deepEqual(result.post, post); assert.match(result.markdown, /public article/);
  assert.deepEqual(parsePublication(source().replaceAll("\n", "\r\n")), result);
});
test("drafts, unsafe IDs, duplicate metadata, invalid dates and unknown private fields cannot publish", () => {
  for (const edit of [s => s.replace("published: true", "published: false"), s => s.replace('"an-idea"', '"../private"'), s => s.replace('title: "An idea"', 'title: "An idea"\ntitle: "Duplicate"'), s => s.replace("2026-09-22", "2026-02-30"), s => s.replace("published: true", "published: true\nprivateNotes: secrets")]) assert.throws(() => parsePublication(edit(source())));
});
test("missing bodies, duplicate IDs, secret patterns and local attachments stop publication", () => {
  assert.throws(() => compilePublications([source(), source()]));
  for (const body of ["", "![[private-note]]", "[[private-note]]", "![secret](../private/image.png)", "[note](obsidian://open?vault=private)", "![expires](https://bucket.s3.amazonaws.com/img?X-Amz-Expires=3600&X-Amz-Signature=test)", "sk-" + "a".repeat(40)]) assert.throws(() => serializePublication(post, body));
  assert.doesNotThrow(() => serializePublication(post, "![public](/images/Ashwin.png)"));
});

test("duplicate imports with different filenames preserve the original sources and catalog", async () => {
  const directory = await mkdtemp(join(tmpdir(), "portfolio-publication-"));
  const output = join(directory, "catalog.json");
  try {
    await writeFile(join(directory, "friendly-name.md"), source()); await writeFile(output, "previous-output");
    await assert.rejects(importPublication(source(), directory, output), /Duplicate/);
    assert.deepEqual((await readdir(directory)).sort(), ["catalog.json", "friendly-name.md"]);
    assert.equal(await readFile(output, "utf8"), "previous-output");
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test("file import publishes atomically and rolls back its source if output persistence fails", async () => {
  const directory = await mkdtemp(join(tmpdir(), "portfolio-publication-"));
  const output = join(directory, "catalog.json");
  try {
    await writeFile(output, "previous-output");
    await assert.rejects(importPublication(source(), directory, output, async () => { throw new Error("disk unavailable"); }), /disk unavailable/);
    assert.deepEqual(await readdir(directory), ["catalog.json"]);
    assert.equal(await readFile(output, "utf8"), "previous-output");
    assert.equal(await importPublication(source(), directory, output), 1);
    assert.equal(JSON.parse(await readFile(output, "utf8"))[0].post.id, post.id);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
test("reviewed local editions take precedence once, preserving other Notion articles", () => {
  const locals = localWritingIndex(); assert.equal(locals.length, 2);
  const merged = mergeOriginals([{ ...locals[0], title: "Older Notion edition" }, { ...post, id: "remote-only" }]);
  assert.equal(merged.length, 3); assert.equal(merged.filter(item => item.id === locals[0].id).length, 1);
  assert.equal(merged.find(item => item.id === locals[0].id).title, locals[0].title);
  assert.ok(localArticle(locals[0].id).readingTime > 0); assert.equal(localArticle("private-or-unknown"), null);
});
