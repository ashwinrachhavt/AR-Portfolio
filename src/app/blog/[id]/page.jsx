import { getCachedNotionPage, getCachedNotionDatabase, getNotionPageTitle, getNotionPageTags } from "../../../lib/notion";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import Link from "next/link";
import BlogPostClient from './BlogPostClient';

// ISR: Regenerate page every 5 minutes if requested
export const revalidate = 300; // 5 minutes

// Generate static params for top blog posts
export async function generateStaticParams() {
  try {
    console.log('🏗️ Generating static params for blog posts...');
    
    // Only in production to avoid slowing dev builds
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }
    
    const posts = await getCachedNotionDatabase();
    
    // Generate static pages for top 10 posts
    const staticParams = posts
      .slice(0, 10)
      .map((post) => ({
        id: post.id,
      }));
      
    console.log(`📄 Pre-generating ${staticParams.length} blog posts`);
    return staticParams;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Tag component with Notion-style colors
const Tag = ({ name }) => {
  // Notion color mapping to Tailwind classes
  const colorClass = "bg-neutral-500/10 border-neutral-500/20 text-neutral-300";

  return (
    <span className={`px-3 py-1 border text-xs rounded-full font-medium ${colorClass}`}>
      {name}
    </span>
  );
};

export default async function BlogPost({ params }) {
  const { id: pageId } = await params;
  
  try {
    console.log(`🔍 Server: Pre-fetching blog post ${pageId.slice(0, 8)}... for SSR`);
    
    // Try to get initial content for SSR, but don't block if it fails
    let initialContent = null;
    try {
      initialContent = await getCachedNotionPage(pageId);
      if (initialContent && initialContent.markdown && initialContent.markdown.trim() !== '') {
        console.log(`✅ Server: Successfully pre-fetched content for SSR`);
      } else {
        console.log(`⚠️  Server: Pre-fetch returned partial/empty content, will retry on client`);
      }
    } catch (error) {
      console.log(`⚠️  Server: Pre-fetch failed, will load on client: ${error.message}`);
    }

    // Always render client component - it will handle loading states and retries
    return <BlogPostClient pageId={pageId} initialContent={initialContent} />;
    
  } catch (error) {
    console.error('Server error in blog post:', error);
    
    // Even if server fails, render client component to handle the error gracefully
    return <BlogPostClient pageId={pageId} initialContent={null} />;
  }
}
