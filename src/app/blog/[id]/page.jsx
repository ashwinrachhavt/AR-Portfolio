import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getBlogArticle, getBlogIndex } from "../../../lib/blog.server";
import { BlogPostNotFoundError } from "../../../lib/notion-blog";
import { formatBlogDate } from "../../../lib/blog-model.mjs";
import styles from "../blog.module.css";
import NewsletterInvite from "../../components/NewsletterInvite";
import { newsletterSubscription } from "../../../lib/writing-sources.mjs";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getBlogIndex();
  return posts.map(post => ({ id: post.id }));
}

async function articleOr404(id) {
  try {
    return await getBlogArticle(id);
  } catch (error) {
    if (error instanceof BlogPostNotFoundError) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { post } = await articleOr404(id);
  return { title: `${post.title} — Ashwin Rachha`, description: post.description || `An essay by Ashwin Rachha: ${post.title}` };
}

const markdownComponents = {
  h1: ({ children }) => <h2>{children}</h2>,
  a: ({ href, children }) => <a href={href} rel="noopener noreferrer">{children}</a>,
  img: ({ src, alt }) => (
    // Notion serves expiring URLs from multiple hosts; preserve them and lazy-load.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt || ""} loading="lazy" decoding="async" />
  ),
  table: ({ children }) => <div className={styles.tableScroll}><table>{children}</table></div>,
};

export default async function BlogPost({ params }) {
  const { id } = await params;
  const { post, markdown, readingTime } = await articleOr404(id);
  return (
    <div className={styles.readingColumn}>
      <Link href="/blog" className={styles.backLink}><span aria-hidden="true">←</span> All writing</Link>
      <article>
        <header className={styles.articleHeader}>
          <div className={styles.articleMeta}>
            <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
            {readingTime > 0 && <><span aria-hidden="true">·</span><span>{readingTime} min read</span></>}
          </div>
          <h1>{post.title}</h1>
          {post.tags.length > 0 && <p className={styles.articleTopics}>{post.tags.join(" / ")}</p>}
        </header>
        {markdown.trim() ? (
          <div className={styles.prose}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{markdown}</ReactMarkdown>
          </div>
        ) : <p className={styles.unpublished}>This piece is still taking shape. Check back soon.</p>}
      </article>
      <div className={styles.articleEnd}>
        <p>Thanks for reading.</p>
        <Link href="/blog">More writing <span aria-hidden="true">↗</span></Link>
      </div>
      <NewsletterInvite newsletter={newsletterSubscription()} />
    </div>
  );
}
