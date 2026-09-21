import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { Client, isFullPage } from "@notionhq/client";
import { BlogPostNotFoundError, createBlogMarkdown, getBlogDatabaseId, queryBlogPosts, retrieveBlogPage } from "./notion-blog";
import { estimateReadingTime, summarizeBlogPost } from "./blog-model.mjs";

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

const cachedArticle = unstable_cache(async (databaseId: string, pageId: string) => {
  try {
    const notion = notionClient();
    const page = await retrieveBlogPage(notion, pageId, databaseId);
    const converter = createBlogMarkdown(notion);
    const blocks = await converter.pageToMarkdown(page.id);
    const markdown = converter.toMarkdownString(blocks).parent ?? "";
    return { post: summarizeBlogPost(page), markdown, readingTime: estimateReadingTime(markdown) };
  } catch (error) {
    // A removed/private post is a successful cache update, not a transient
    // failure that should keep serving an old article indefinitely.
    if (error instanceof BlogPostNotFoundError || error.code === "object_not_found") return null;
    throw error;
  }
}, ["public-blog-article-v2"], { revalidate: 300, tags: ["notion-blog"] });

export const getBlogIndex = cache(() => cachedIndex(getBlogDatabaseId()));
export const getBlogArticle = cache(async (pageId: string) => {
  const article = await cachedArticle(getBlogDatabaseId(), pageId);
  if (!article) throw new BlogPostNotFoundError();
  return article;
});
