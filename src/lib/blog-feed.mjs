// Feed links always use the public site, including builds on preview domains.
export function blogSiteUrl() {
  const url = new URL(process.env.SITE_URL || "https://ashwinrachha.vercel.app");
  if (!["https:", "http:"].includes(url.protocol)) {
    throw new Error("SITE_URL must be an HTTP or HTTPS URL");
  }
  return url.origin;
}

function xml(value) {
  return String(value ?? "")
    .replace(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu, "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function renderBlogFeed(posts, siteUrl, feedPath = "/rss.xml") {
  const items = [...posts].sort((a, b) => b.date.localeCompare(a.date)).map(post => {
    const date = new Date(post.date);
    const published = Number.isNaN(date.getTime()) ? "" : `<pubDate>${date.toUTCString()}</pubDate>`;
    const link = new URL(post.href || `/blog/${encodeURIComponent(post.id)}`, siteUrl).href;
    const guid = post.external ? `urn:writing:${post.id}` : `urn:notion:${post.id}`;
    return `<item>
      <title>${xml(post.title)}</title>
      <link>${xml(link)}</link>
      <guid isPermaLink="false">${xml(guid)}</guid>
      <description>${xml(post.description)}</description>
      ${published}
      ${(post.tags ?? []).map(tag => `<category>${xml(tag)}</category>`).join("\n")}
    </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Writing — Ashwin Rachha</title>
    <link>${xml(new URL("/blog", siteUrl).href)}</link>
    <description>Notes on AI, engineering, and the ideas that shape how I build and live.</description>
    <language>en-us</language>
    <atom:link href="${xml(new URL(feedPath, siteUrl).href)}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
}
