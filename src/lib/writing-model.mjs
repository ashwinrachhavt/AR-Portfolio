import Parser from "rss-parser";

export const MAX_FEED_BYTES = 2 * 1024 * 1024;

export function normalizedArticleUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith("utm_") || ["source", "ref", "fbclid", "gclid"].includes(key)) url.searchParams.delete(key);
    }
    return url.href;
  } catch {
    return null;
  }
}

const plainText = value => String(value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export async function parseWritingFeed(xml, source) {
  if (Buffer.byteLength(xml, "utf8") > MAX_FEED_BYTES || /<!DOCTYPE|<!ENTITY/i.test(xml)) {
    throw new Error("Unsupported feed document");
  }
  const feed = await new Parser().parseString(xml);
  return feed.items.slice(0, 100).flatMap(item => {
    const href = normalizedArticleUrl(item.link);
    const date = new Date(item.isoDate || item.pubDate);
    const title = plainText(item.title).slice(0, 300);
    if (!href || !title || Number.isNaN(date.getTime())) return [];
    return [{
      id: `${source.id}:${item.guid || href}`,
      title,
      date: date.toISOString(),
      description: plainText(item.contentSnippet || item["content:encodedSnippet"] || item.summary).slice(0, 280),
      tags: (item.categories ?? []).filter(tag => typeof tag === "string").slice(0, 10).map(plainText),
      source: source.id,
      sourceName: source.name,
      href,
      external: true,
    }];
  });
}

export function mergeWriting(originals, external) {
  const posts = originals.map(post => ({ ...post, source: "portfolio", sourceName: "Portfolio", href: `/blog/${post.id}`, external: false }));
  const seen = new Set();
  const seenIds = new Set();
  for (const post of external) {
    const key = normalizedArticleUrl(post.href);
    if (!key || seen.has(key) || seenIds.has(post.id)) continue;
    seen.add(key);
    seenIds.add(post.id);
    posts.push(post);
  }
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function fetchWritingFeed(source, fetcher = fetch) {
  const response = await fetcher(source.feedUrl, {
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
    headers: { Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" },
  });
  if (!response.ok || !response.body) throw new Error("Feed request failed");
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_FEED_BYTES) throw new Error("Feed is too large");
      chunks.push(Buffer.from(value));
    }
  } finally {
    await reader.cancel();
    reader.releaseLock();
  }
  return parseWritingFeed(Buffer.concat(chunks).toString("utf8"), source);
}
