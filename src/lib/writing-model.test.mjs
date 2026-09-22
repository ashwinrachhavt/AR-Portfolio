import test from "node:test";
import assert from "node:assert/strict";
import { fetchWritingFeed, MAX_FEED_BYTES, mergeWriting, normalizedArticleUrl, parseWritingFeed } from "./writing-model.mjs";
import { newsletterSubscription, newsletterUrl, writingSources } from "./writing-sources.mjs";
import { renderBlogFeed } from "./blog-feed.mjs";

const source = { id: "medium", name: "Medium", feedUrl: "https://medium.com/feed/@example" };
const fixture = `<?xml version="1.0"?><rss version="2.0"><channel><title>Writing</title>
<item><title>AI &amp; systems</title><link>https://example.com/post?utm_source=rss</link><guid>stable-post</guid><pubDate>Mon, 21 Sep 2026 10:00:00 GMT</pubDate><description><![CDATA[<p>Useful <b>ideas</b> &amp; notes.</p>]]></description><category>AI</category></item>
<item><title>Unsafe link</title><link>javascript:alert(1)</link><pubDate>Mon, 21 Sep 2026 10:00:00 GMT</pubDate></item>
<item><title>Bad date</title><link>https://example.com/bad-date</link><pubDate>not a date</pubDate></item>
</channel></rss>`;

test("RSS entries become safe text excerpts and absolute source links", async () => {
  const posts = await parseWritingFeed(fixture, source);
  assert.equal(posts.length, 1);
  assert.equal(posts[0].title, "AI & systems");
  assert.equal(posts[0].description, "Useful ideas & notes.");
  assert.equal(posts[0].href, "https://example.com/post");
  assert.equal(posts[0].id, "medium:stable-post");
  assert.equal(posts[0].external, true);
});

test("Atom feeds and invalid XML are handled", async () => {
  const atom = `<feed xmlns="http://www.w3.org/2005/Atom"><title>Notes</title><entry><id>atom-one</id><title>Note</title><link href="https://example.com/note"/><updated>2026-09-20T12:00:00Z</updated><summary>Summary</summary></entry></feed>`;
  const posts = await parseWritingFeed(atom, source);
  assert.equal(posts[0].href, "https://example.com/note");
  await assert.rejects(parseWritingFeed("not XML", source));
  await assert.rejects(parseWritingFeed('<!DOCTYPE rss [<!ENTITY test "data">]><rss/>', source));
});

test("fetch fails for upstream errors and enforces the streamed byte limit", async () => {
  await assert.rejects(fetchWritingFeed(source, async () => new Response("Unavailable", { status: 503 })));
  await assert.rejects(fetchWritingFeed(source, async () => new Response("x".repeat(MAX_FEED_BYTES + 1))), /too large/);
  const posts = await fetchWritingFeed(source, async () => new Response(fixture));
  assert.equal(posts.length, 1);
});

test("source configuration is optional and never invents newsletter destinations", () => {
  assert.equal(newsletterUrl({}), null);
  assert.equal(writingSources({}).length, 1);
  const env = { SUBSTACK_PUBLICATION_URL: "https://writer.substack.com/", HASHNODE_PUBLICATION_URL: "https://writer.hashnode.dev" };
  assert.deepEqual(writingSources(env).map(s => s.feedUrl), [source.feedUrl.replace("@example", "@ashwin_rachha"), "https://writer.substack.com/feed", "https://writer.hashnode.dev/rss.xml"]);
  assert.equal(newsletterUrl(env), "https://writer.substack.com");
  assert.throws(() => newsletterUrl({ SUBSTACK_PUBLICATION_URL: "https://substack.com/@profile" }));
  assert.throws(() => newsletterUrl({ SUBSTACK_PUBLICATION_URL: "http://localhost:3000" }));
});

test("newsletter links to the verified profile unless an actual publication is configured", () => {
  assert.deepEqual(newsletterSubscription({}), { url: "https://substack.com/@ashwinrachha", embedUrl: null });
  assert.deepEqual(newsletterSubscription({ SUBSTACK_PUBLICATION_URL: "https://writer.substack.com" }), {
    url: "https://writer.substack.com/subscribe", embedUrl: "https://writer.substack.com/embed",
  });
  assert.throws(() => newsletterSubscription({ SUBSTACK_PROFILE_URL: "https://substack.com/https://substack.com/@ashwinrachha" }));
  assert.throws(() => newsletterSubscription({ SUBSTACK_PROFILE_URL: "https://substack.com.evil.example/@ashwinrachha" }));
});

test("deduplication uses URL or source ID, never just similar titles", async () => {
  const [post] = await parseWritingFeed(fixture, source);
  const originals = [{ id: "notion-one", title: post.title, date: "2026-09-22", tags: [] }];
  const different = { ...post, id: "medium:other", href: "https://example.com/different" };
  const merged = mergeWriting(originals, [post, { ...post, href: `${post.href}?utm_campaign=test` }, different]);
  assert.equal(merged.length, 3);
  assert.equal(merged[0].external, false);
  assert.equal(merged[0].href, "/blog/notion-one");
  assert.equal(originals[0].source, undefined);
  assert.equal(normalizedArticleUrl("data:text/html,bad"), null);
});

test("combined RSS retains original destinations and stable external IDs", async () => {
  const posts = await parseWritingFeed(fixture, source);
  const xml = renderBlogFeed(posts, "https://portfolio.example", "/feed.xml");
  assert.ok(xml.includes("<link>https://example.com/post</link>"));
  assert.ok(xml.includes("urn:writing:medium:stable-post"));
  assert.ok(xml.includes('href="https://portfolio.example/feed.xml"'));
  assert.ok(!xml.includes("/blog/medium"));
});
