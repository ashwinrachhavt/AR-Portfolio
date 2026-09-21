import assert from "node:assert/strict";
import test from "node:test";
import { BlogPostNotFoundError, createBlogMarkdown, queryBlogPosts, retrieveBlogPage } from "./notion-blog.ts";

const databaseId = "87eef395-c152-4300-8325-79780b673e3b";

test("includes a child page's text in the article body", async () => {
  const notion = { blocks: { children: { list: async ({ block_id }) => ({
    has_more: false,
    results: block_id === "post"
      ? [{ id: "chapter", type: "child_page", has_children: true, child_page: { title: "Chapter one" } }]
      : [{ id: "paragraph", type: "paragraph", has_children: false, paragraph: { rich_text: [
        { type: "text", text: { content: "The nested article text." }, plain_text: "The nested article text.", annotations: {} },
      ] } }],
  }) } } };
  const converter = createBlogMarkdown(notion);
  const markdown = converter.toMarkdownString(await converter.pageToMarkdown("post")).parent;
  assert.match(markdown, /Chapter one/);
  assert.match(markdown, /The nested article text\./);
});

test("loads every cursor page while keeping the Blogs filter", async () => {
  const firstPage = Array.from({ length: 100 }, (_, index) => ({ id: `post-${index}` }));
  const calls = [];
  const notion = { databases: { query: async (args) => {
    calls.push(args);
    return args.start_cursor
      ? { results: [{ id: "last-post" }], has_more: false, next_cursor: null }
      : { results: firstPage, has_more: true, next_cursor: "next-page" };
  } } };
  const posts = await queryBlogPosts(notion, databaseId);
  assert.equal(posts.length, 101);
  assert.equal(posts.at(-1).id, "last-post");
  assert.equal(calls[1].start_cursor, "next-page");
  for (const args of calls) {
    assert.equal(args.database_id, databaseId);
    assert.deepEqual(args.filter, { property: "Status", select: { equals: "Blogs" } });
  }
});

test("does not turn a failed later page into a partial blog list", async () => {
  const notion = { databases: { query: async ({ start_cursor }) => {
    if (start_cursor) throw new Error("Notion unavailable");
    return { results: [{ id: "first-post" }], has_more: true, next_cursor: "next-page" };
  } } };
  await assert.rejects(queryBlogPosts(notion, databaseId), /Notion unavailable/);
});

const blogPage = {
  object: "page", id: "post", url: "https://www.notion.so/post", archived: false, in_trash: false,
  parent: { type: "database_id", database_id: databaseId.replaceAll("-", "") },
  properties: { Status: { type: "select", select: { name: "Blogs" } } },
};

test("accepts a blog in the configured database", async () => {
  const notion = { pages: { retrieve: async () => blogPage } };
  assert.equal(await retrieveBlogPage(notion, "post", databaseId), blogPage);
});

test("rejects private, unrelated, archived, trashed, and partial pages", async () => {
  const excluded = [
    { ...blogPage, properties: { Status: { type: "select", select: { name: "Jobs" } } } },
    { ...blogPage, parent: { type: "database_id", database_id: "another-database" } },
    { ...blogPage, parent: { type: "page_id", page_id: "parent" } },
    { ...blogPage, archived: true },
    { ...blogPage, in_trash: true },
    { object: "page", id: "partial-page" },
  ];
  for (const page of excluded) {
    await assert.rejects(retrieveBlogPage({ pages: { retrieve: async () => page } }, "post", databaseId), BlogPostNotFoundError);
  }
});
