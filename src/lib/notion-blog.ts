import { collectPaginatedAPI, isFullPage } from "@notionhq/client";
import type { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

export function createBlogMarkdown(notion: Client) {
  return new NotionToMarkdown({
    notionClient: notion,
    config: { parseChildPages: true, separateChildPage: false },
  });
}

export class BlogPostNotFoundError extends Error {
  constructor() {
    super("Blog post not found");
    this.name = "BlogPostNotFoundError";
  }
}

export function getBlogDatabaseId(): string {
  const databaseId = process.env.NOTION_DATABASE_ID?.trim();
  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID is not configured");
  }
  return databaseId;
}

export async function queryBlogPosts(notion: Client, databaseId = getBlogDatabaseId()) {
  return collectPaginatedAPI(notion.databases.query, {
    database_id: databaseId,
    filter: { property: "Status", select: { equals: "Blogs" } },
    sorts: [{ timestamp: "created_time", direction: "descending" }],
    page_size: 100,
  });
}

// Check membership before reading blocks: this integration also sees private pages.
export async function retrieveBlogPage(notion: Client, pageId: string, databaseId = getBlogDatabaseId()) {
  const page = await notion.pages.retrieve({ page_id: pageId });
  const normalizeId = (id: string) => id.replaceAll("-", "").toLowerCase();
  if (
    !isFullPage(page) || page.archived || page.in_trash ||
    page.parent.type !== "database_id" ||
    normalizeId(page.parent.database_id) !== normalizeId(databaseId) ||
    page.properties.Status?.type !== "select" ||
    page.properties.Status.select?.name !== "Blogs"
  ) {
    throw new BlogPostNotFoundError();
  }
  return page;
}
