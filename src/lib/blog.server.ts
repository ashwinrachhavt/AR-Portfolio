import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { Client, isFullPage } from "@notionhq/client";
import { BlogPostNotFoundError, getBlogDatabaseId, loadBlogArticle, queryBlogPosts } from "./notion-blog";
import { summarizeBlogPost } from "./blog-model.mjs";
import { localArticle, mergeOriginals } from "./local-writing.mjs";

function notionClient() {
  if (!process.env.NOTION_API_KEY) throw new Error("NOTION_API_KEY is not configured");
  return new Client({ auth: process.env.NOTION_API_KEY, timeoutMs: 15000 });
}

// Persist successful data across requests and deployments. Failed background
// refreshes keep the last successful content. React cache deduplicates a render.
const cachedIndex = unstable_cache(async (databaseId: string) => {
  const pages = await queryBlogPosts(notionClient(), databaseId);
  return pages.filter(isFullPage).map(summarizeBlogPost);
}, ["public-blog-index-v2"], { revalidate: 300, tags: ["notion-blog"] });

const cachedArticle = unstable_cache(
  (databaseId: string, pageId: string) => loadBlogArticle(notionClient(), pageId, databaseId),
  ["public-blog-article-v3"], { revalidate: 300, tags: ["notion-blog"] },
);

export const getBlogIndex = cache(async () => {
  try { return mergeOriginals(await cachedIndex(getBlogDatabaseId())); }
  catch { console.warn("Notion index unavailable; serving reviewed local writing."); return mergeOriginals([]); }
});
export const getBlogArticle = cache(async (pageId: string) => {
  const reviewed = localArticle(pageId);
  if (reviewed) return reviewed;
  const article = await cachedArticle(getBlogDatabaseId(), pageId);
  if (!article) throw new BlogPostNotFoundError();
  return article;
});
