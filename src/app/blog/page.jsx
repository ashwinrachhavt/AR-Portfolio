"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCachedNotionDatabase, getNotionPageTitle, getNotionPageDate, getNotionPageDescription, getNotionPageTags, warmCache, getCacheStats, clearNotionCache } from "../../lib/notion";
import Link from "next/link";



// Tag component with Notion-style colors for blog list
const Tag = ({ name }) => {
  const colorClass = "bg-neutral-500/10 border-neutral-500/20 text-neutral-300";

  return (
    <span className={`px-3 py-1 border text-xs rounded-full font-medium ${colorClass}`}>
      {name}
    </span>
  );
};

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch all blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching blog posts...');
        const pages = await getCachedNotionDatabase();
        
        // The server returns every entry in the Notion Blogs group.
        const blogPosts = (pages || [])
          .sort((a, b) => new Date(b.created_time) - new Date(a.created_time));
        setPosts(blogPosts);
        setError(null);

        // Warm cache for first 5 posts in background.
        const topPostIds = blogPosts.slice(0, 5).map(post => post.id);
        if (topPostIds.length > 0) {
          console.log('🔥 Warming cache for top posts...');
          warmCache(topPostIds).catch(e => console.warn('Cache warming failed:', e));
        }

      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
        
        // Log cache stats
        setTimeout(() => {
          const stats = getCacheStats();
          console.log('📊 Cache stats:', stats);
        }, 1000);
      }
    };

    fetchPosts();
  }, [retryCount]);



  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#a3a3a3] mb-4"></div>
            <p className="text-[#ADB7BE]">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
            <div role="alert" className="bg-[#1a1a1a] border border-[#33353F] rounded-xl p-8 text-left">
              <h2 className="text-xl font-bold text-white mb-4">Posts are temporarily unavailable</h2>
              <p className="text-[#ADB7BE] mb-4">
                We couldn’t load the posts. Please try again in a moment.
              </p>
              <button type="button" onClick={() => {
                clearNotionCache();
                setRetryCount(count => count + 1);
              }} className="rounded-lg border border-neutral-600 px-4 py-2 text-white hover:bg-neutral-800">
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#121212] pt-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto px-4 py-16"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">
              Blog
            </h1>
            <p className="text-[#ADB7BE] text-lg max-w-2xl mx-auto">
              Thoughts, learnings, and insights from my journey in technology, 
              design, and building meaningful products.
            </p>
            <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-[#6B7280]">
              <span>{posts.length} posts</span>
              <span>•</span>
              <span>Updated regularly</span>
            </div>
          </motion.div>

          {/* Blog Posts Grid */}
          <motion.div variants={containerVariants} className="space-y-8">
            {posts.map((post, index) => {
              const title = getNotionPageTitle(post);
              const description = getNotionPageDescription(post);
              const date = getNotionPageDate(post);
              const tags = getNotionPageTags(post);
              
              return (
                <motion.article
                  key={post.id}
                  variants={itemVariants}
                  className="group"
                >
                  <Link 
                    href={`/blog/${post.id}`}
                    className="block bg-[#1a1a1a] border border-[#33353F] rounded-xl p-8 
                             hover:border-[#a3a3a3]/50 hover:bg-[#1a1a1a]/80 transition-all duration-300
                             transform hover:scale-[1.02] hover:shadow-lg hover:shadow-[#a3a3a3]/10"
                  >
                  <div className="flex flex-col space-y-4">
                    {/* Date and Reading Time */}
                    <div className="flex items-center space-x-4 text-sm text-[#6B7280]">
                      <time>{date}</time>
                      <span>•</span>
                      <span>3 min read</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-white group-hover:text-[#a3a3a3]
                                 transition-colors duration-200">
                      {title}
                    </h2>

                    {/* Description */}
                    {description && (
                      <p className="text-[#ADB7BE] leading-relaxed line-clamp-3">
                        {description}
                      </p>
                    )}

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.slice(0, 4).map((tag) => (
                          <Tag
                            key={tag.id}
                            name={tag.name}
                            color={tag.color}
                          />
                        ))}
                        {tags.length > 4 && (
                          <span className="px-3 py-1 text-[#6B7280] text-xs">
                            +{tags.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Read More Arrow */}
                    <div className="flex items-center text-[#a3a3a3] font-medium text-sm
                                  group-hover:translate-x-2 transition-transform duration-200">
                      <span>Read full post</span>
                      <svg 
                        className="w-4 h-4 ml-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>

          {/* Empty State */}
          {posts.length === 0 && !loading && !error && (
            <motion.div variants={itemVariants} className="text-center py-16">
              <div className="text-[#6B7280] mb-4">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
              <p className="text-[#ADB7BE]">Check back soon for new content!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default BlogPage;
