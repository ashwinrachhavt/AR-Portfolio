import assert from "node:assert/strict";
import test from "node:test";
import { summarizeBlogPost, filterBlogPosts, formatBlogDate, estimateReadingTime } from "./blog-model.mjs";

test("serializes complete titles and only the public index fields", () => {
  const summary = summarizeBlogPost({
    id: "post", created_time: "2026-08-23T00:01:00.000Z", created_by: { id: "private-user" },
    properties: {
      Name: { type: "title", title: [{ plain_text: "Inside " }, { plain_text: "Buzz" }] },
      Tags: { multi_select: [{ name: "AI", id: "not-needed" }] },
      Description: { rich_text: [{ plain_text: "A signed message." }] },
      Person: { people: [{ id: "private-person" }] },
    },
  });
  assert.deepEqual(summary, { id: "post", title: "Inside Buzz", date: "2026-08-22", tags: ["AI"], description: "A signed message." });
  assert.equal(formatBlogDate(summary.date), "Aug 22, 2026");
});

test("search and topic filtering work together without changing source order", () => {
  const posts = [
    { id: "a", title: "MCP Sessions", description: "Building stateless tools", tags: ["AI", "Engineering"] },
    { id: "b", title: "On writing", description: "An idea", tags: ["Writing"] },
    { id: "c", title: "Tools", description: "A thought", tags: ["AI"] },
  ];
  assert.deepEqual(filterBlogPosts(posts, " MCP   STATELESS ", "AI").map(p => p.id), ["a"]);
  assert.deepEqual(filterBlogPosts(posts, "", "AI").map(p => p.id), ["a", "c"]);
  assert.deepEqual(filterBlogPosts(posts, "MCP", "Writing"), []);
  assert.deepEqual(filterBlogPosts(posts), posts);
});

test("reading estimates reflect the article and ignore image/link URLs", () => {
  assert.equal(estimateReadingTime(""), 0);
  assert.equal(estimateReadingTime("![photo](https://example.com/photo.png)"), 0);
  assert.equal(estimateReadingTime(Array(221).fill("word").join(" ")), 2);
  assert.equal(estimateReadingTime("Read [the note](https://example.com/a-very-long-url)."), 1);
});
