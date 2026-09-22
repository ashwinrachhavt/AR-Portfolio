import test from "node:test";
import assert from "node:assert/strict";
import { renderBlogFeed } from "./blog-feed.mjs";

test("feed treats imported text as text and removes invalid XML characters", () => {
  const feed = renderBlogFeed([{
    id: "public-post", title: 'AI & <systems> "notes"\u0000', date: "2026-09-21",
    description: "A </description><script>bad</script> example", tags: ["R&D"],
  }], "https://example.com");
  assert.ok(feed.includes("AI &amp; &lt;systems&gt; &quot;notes&quot;"));
  assert.ok(feed.includes("&lt;/description&gt;&lt;script&gt;bad&lt;/script&gt;"));
  assert.ok(feed.includes("<category>R&amp;D</category>"));
  assert.ok(!feed.includes("\u0000"));
  assert.ok(feed.includes("Mon, 21 Sep 2026 00:00:00 GMT"));
});

test("feed has stable IDs, absolute links, and newest-first ordering without mutating input", () => {
  const posts = [
    { id: "first", title: "Earlier", date: "2026-09-01", description: "" },
    { id: "second", title: "Later", date: "2026-09-21", description: "" },
  ];
  const feed = renderBlogFeed(posts, "https://example.com");
  assert.ok(feed.indexOf("<title>Later") < feed.indexOf("<title>Earlier"));
  assert.equal(posts[0].id, "first");
  assert.ok(feed.includes('<guid isPermaLink="false">urn:notion:first</guid>'));
  assert.ok(feed.includes("<link>https://example.com/blog/first</link>"));
  assert.ok(feed.includes('href="https://example.com/rss.xml"'));
});

test("empty feeds remain valid and invalid dates are omitted", () => {
  assert.ok(renderBlogFeed([], "https://example.com").includes("</channel>"));
  const feed = renderBlogFeed([{ id: "x", title: "Note", date: "unknown" }], "https://example.com");
  assert.ok(!feed.includes("<pubDate>"));
  assert.ok(!feed.includes("undefined"));
});
