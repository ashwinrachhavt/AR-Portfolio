"use client";
import { useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import Link from "next/link";
import LoadingProgress from "../../components/LoadingProgress";
import useContentLoader from "../../components/useContentLoader";
import { getNotionPageTitle, getNotionPageTags } from "../../../lib/notion";

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
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${colorClass} mr-2 mb-2`}>
      {name}
    </span>
  );
};

const BlogPostClient = ({ pageId, initialContent = null }) => {
  const {
    content,
    isLoading,
    progress,
    status,
    error,
    retryCount,
    maxRetries,
    retry,
    hasContent
  } = useContentLoader(pageId, initialContent);

  // Show loading progress
  if (isLoading) {
    const showRetry = error && retryCount >= maxRetries;
    return (
      <LoadingProgress
        isLoading={true}
        progress={progress}
        status={status}
        showRetry={showRetry}
        onRetry={retry}
      />
    );
  }

  // Handle complete failure after all retries
  if (error && !hasContent) {
    return (
      <div className="min-h-screen bg-[#121212] pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Content Unavailable</h1>
            <p className="text-[#ADB7BE] mb-6">
              We&apos;re experiencing temporary issues loading this blog post. This usually resolves automatically.
            </p>
            <div className="space-x-4">
              <button
                onClick={retry}
                className="inline-flex items-center px-6 py-3 bg-[#9333ea] hover:bg-[#7c2d92] text-white rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
              <Link 
                href="/blog"
                className="inline-flex items-center px-6 py-3 bg-[#1a1a1a] hover:bg-[#33353F] border border-[#33353F] text-white rounded-lg transition-colors"
              >
                ← Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where we have no content at all
  if (!content) {
    return (
      <div className="min-h-screen bg-[#121212] pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Post Not Found</h1>
            <p className="text-[#ADB7BE] mb-8">The requested blog post could not be found.</p>
            <Link 
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-[#9333ea] hover:bg-[#7c2d92] text-white rounded-lg transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { markdown, page, partial } = content;
  const title = page ? getNotionPageTitle(page) : 'Blog Post';
  const tags = page ? getNotionPageTags(page) : [];
  const createdDate = page?.created_time ? new Date(page.created_time).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  // Show partial content with retry option
  const hasValidMarkdown = markdown && markdown.trim() !== '';
  
  return (
    <div className="min-h-screen bg-[#121212] pt-20">
      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <Link href="/blog" className="inline-flex items-center text-[#9333ea] hover:text-[#7c2d92] transition-colors duration-300 mb-8">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 pb-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
          
          {createdDate && (
            <time className="text-[#6B7280] text-lg">
              {createdDate}
            </time>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {tags.map((tag) => (
                <Tag
                  key={tag.id}
                  name={tag.name}
                  color={tag.color}
                />
              ))}
            </div>
          )}

          {/* Partial Content Warning */}
          {partial && (
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg max-w-2xl mx-auto">
              <p className="text-yellow-400 text-sm">
                ⚠️ Some content may be missing due to loading issues.{' '}
                <button 
                  onClick={retry}
                  className="underline hover:no-underline font-medium"
                >
                  Click here to retry
                </button>
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 pb-16">
        {!hasValidMarkdown ? (
          // Show retry interface for missing content
          <div className="text-center py-12">
            <div className="bg-[#1a1a1a] border border-[#33353F] rounded-xl p-8 max-w-2xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Content Loading Issues</h3>
              <p className="text-[#ADB7BE] mb-6 leading-relaxed">
                The content for this blog post is temporarily unavailable. This is usually due to Notion API response times.
              </p>
              <button
                onClick={retry}
                className="inline-flex items-center px-6 py-3 bg-[#9333ea] hover:bg-[#7c2d92] text-white rounded-lg transition-colors mr-4"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reload Content
              </button>
              <p className="text-xs text-[#6B7280] mt-4">
                Content will be retried automatically every few minutes.
              </p>
            </div>
          </div>
        ) : (
          // Show normal content
          <div className="prose prose-lg prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom heading styles
                h1: ({children}) => <h1 className="text-3xl font-bold text-white mb-6 mt-8">{children}</h1>,
                h2: ({children}) => <h2 className="text-2xl font-bold text-white mb-4 mt-6">{children}</h2>,
                h3: ({children}) => <h3 className="text-xl font-bold text-white mb-3 mt-5">{children}</h3>,
                
                // Custom paragraph styles
                p: ({children}) => <p className="text-[#ADB7BE] leading-relaxed mb-4">{children}</p>,
                
                // Custom list styles
                ul: ({children}) => <ul className="text-[#ADB7BE] mb-4 pl-6 space-y-2">{children}</ul>,
                ol: ({children}) => <ol className="text-[#ADB7BE] mb-4 pl-6 space-y-2">{children}</ol>,
                li: ({children}) => <li className="list-disc">{children}</li>,
                
                // Custom link styles
                a: ({href, children}) => (
                  <a 
                    href={href} 
                    className="text-[#9333ea] hover:text-[#7c2d92] underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                
                // Custom code styles
                code: ({children, className}) => {
                  const isInline = !className;
                  if (isInline) {
                    return <code className="bg-[#1a1a1a] text-[#06b6d4] px-2 py-1 rounded text-sm">{children}</code>;
                  }
                  return <code className={className}>{children}</code>;
                },
                
                pre: ({children}) => (
                  <pre className="bg-[#0a0a0a] border border-[#33353F] rounded-lg p-4 overflow-x-auto mb-6">
                    {children}
                  </pre>
                ),
                
                // Custom blockquote styles
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-[#9333ea] pl-4 my-6 italic text-[#ADB7BE]">
                    {children}
                  </blockquote>
                ),

                // Custom image styles
                img: ({src, alt}) => (
                  <img 
                    src={src} 
                    alt={alt} 
                    className="rounded-lg w-full max-w-full h-auto my-6 border border-[#33353F]" 
                  />
                ),
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        )}
      </article>

      {/* Footer Navigation */}
      <div className="max-w-4xl mx-auto px-4 py-8 border-t border-[#33353F]">
        <div className="text-center">
          <Link 
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-[#1a1a1a] hover:bg-[#33353F] border border-[#33353F] text-white rounded-lg transition-colors"
          >
            ← Back to All Posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostClient;
