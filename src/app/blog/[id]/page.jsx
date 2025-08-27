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
const Tag = ({ name, color }) => {
  // Notion color mapping to Tailwind classes
  const colorMap = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    brown: 'bg-amber-600/10 border-amber-600/20 text-amber-400',
    gray: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    pink: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    default: 'bg-[#9333ea]/10 border-[#9333ea]/20 text-[#9333ea]'
  };

  const colorClass = colorMap[color] || colorMap.default;

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
