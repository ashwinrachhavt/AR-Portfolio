import { getBlogIndex } from "../../lib/blog.server";
import { blogSiteUrl, renderBlogFeed } from "../../lib/blog-feed.mjs";

export const dynamic = "force-static";
export const revalidate = 300;

export async function GET() {
  const posts = await getBlogIndex();
  return new Response(renderBlogFeed(posts, blogSiteUrl()), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
