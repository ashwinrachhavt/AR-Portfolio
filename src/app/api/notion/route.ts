import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { BlogPostNotFoundError, createBlogMarkdown, queryBlogPosts, retrieveBlogPage } from "../../../lib/notion-blog";

// Performance-optimized Notion client with timeouts and connection pooling
const notion = new Client({ 
  auth: process.env.NOTION_API_KEY,
  // Add request timeout
  timeoutMs: 30000, // 30 seconds max
});

const n2m = createBlogMarkdown(notion);

// Performance monitoring
class PerformanceTimer {
  private startTime: number;
  
  constructor(private operation: string) {
    this.startTime = Date.now();
    console.log(`⏱️  ${operation} - Started`);
  }
  
  end(): number {
    const duration = Date.now() - this.startTime;
    console.log(`⏱️  ${this.operation} - Completed in ${duration}ms`);
    return duration;
  }
}

// Request timeout wrapper
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`${operation} timed out after ${timeoutMs}ms`)), timeoutMs)
  );
  
  return Promise.race([promise, timeoutPromise]);
}

// Optimized markdown processing with chunking
async function optimizedPageToMarkdown(pageId: string): Promise<string> {
  const timer = new PerformanceTimer(`PageToMarkdown ${pageId.slice(0, 8)}`);
  
  try {
    // Set a shorter timeout for markdown conversion
    const mdblocks = await withTimeout(
      n2m.pageToMarkdown(pageId), 
      15000, // 15 seconds max for markdown conversion
      'Markdown conversion'
    );
    
    const mdString = n2m.toMarkdownString(mdblocks);
    timer.end();
    
    return mdString.parent;
  } catch (error) {
    timer.end();
    console.error(`❌ Markdown conversion failed for ${pageId.slice(0, 8)}: ${error.message}`);
    throw error;
  }
}

// Cache API responses for 5 minutes
const apiCache = new Map<string, { data: any; timestamp: number; ttl?: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedResponse(key: string): any | null {
  const cached = apiCache.get(key);
  if (!cached) return null;
  
  // Use individual TTL or fall back to default
  const ttl = cached.ttl || CACHE_TTL;
  
  // Check if expired
  if (Date.now() - cached.timestamp > ttl) {
    apiCache.delete(key);
    return null;
  }
  
  return cached.data;
}

function setCachedResponse(key: string, data: any, ttlMinutes: number = 5): void {
  apiCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMinutes * 60 * 1000 // Convert to milliseconds
  });
}

// Circuit breaker for failing requests
class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private readonly maxFailures = 3;
  private readonly resetTimeout = 60000; // 1 minute
  
  async execute<T>(operation: () => Promise<T>, fallback?: () => T): Promise<T> {
    if (this.isOpen()) {
      console.log('🚫 Circuit breaker open, using fallback');
      if (fallback) return fallback();
      throw new Error('Circuit breaker is open');
    }
    
    try {
      const result = await operation();
      this.reset();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }
  
  private isOpen(): boolean {
    return this.failures >= this.maxFailures && 
           (Date.now() - this.lastFailTime) < this.resetTimeout;
  }
  
  private recordFailure(): void {
    this.failures++;
    this.lastFailTime = Date.now();
    console.log(`⚠️  Circuit breaker failure ${this.failures}/${this.maxFailures}`);
  }
  
  private reset(): void {
    this.failures = 0;
  }
}

const circuitBreaker = new CircuitBreaker();

export async function GET(request: Request) {
  const requestTimer = new PerformanceTimer('Total API Request');
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const pageId = searchParams.get("pageId");
  
  // Check for cache-busting headers (for retries)
  const cacheControl = request.headers.get('cache-control');
  const shouldBustCache = cacheControl === 'no-cache';

  try {
    if (type === "database") {
      const cacheKey = "api-database";
      
      // Check cache first (unless cache busting is requested)
      if (!shouldBustCache) {
        const cached = getCachedResponse(cacheKey);
        if (cached) {
          requestTimer.end();
          console.log('📦 API Cache hit: Database');
          return NextResponse.json({ success: true, data: cached });
        }
      } else {
        console.log('🔄 API: Cache-busting requested for database');
      }
      
      console.log('🌐 API: Fetching database from Notion');
      const databaseTimer = new PerformanceTimer('Database Query');
      
      const posts = await circuitBreaker.execute(async () => {
        return withTimeout(
          queryBlogPosts(notion),
          10000, // 10 second timeout for database queries
          'Database query'
        );
      });
      
      databaseTimer.end();
      
      // Cache the response
      setCachedResponse(cacheKey, posts);
      console.log(`💾 API: Cached database (${posts.length} posts)`);
      
      requestTimer.end();
      return NextResponse.json({ success: true, data: posts });
    }

    if (type === "page" && pageId) {
      // Validate the current blog status before serving cached or fresh content.
      const pageData = await withTimeout(retrieveBlogPage(notion, pageId), 8000, 'Blog metadata');
      const cacheKey = `api-page-${pageId}`;
      
      // Check cache first (unless cache busting is requested)
      if (!shouldBustCache) {
        const cached = getCachedResponse(cacheKey);
        if (cached) {
          requestTimer.end();
          console.log(`📦 API Cache hit: Page ${pageId.slice(0, 8)}...`);
          return NextResponse.json({ success: true, data: cached });
        }
      } else {
        console.log(`🔄 API: Cache-busting requested for page ${pageId.slice(0, 8)}...`);
      }
      
      console.log(`🌐 API: Fetching page ${pageId.slice(0, 8)}... from Notion`);
      
      const result = await circuitBreaker.execute(async () => {
        const pageTimer = new PerformanceTimer(`Page Fetch ${pageId.slice(0, 8)}`);
        
        // Optimized parallel requests with individual timeouts
        const [markdown] = await Promise.allSettled([
          optimizedPageToMarkdown(pageId),
        ]);
        
        pageTimer.end();
        
        // Handle partial failures gracefully
        const markdownContent = markdown.status === 'fulfilled' ? markdown.value : '';
        
        if (markdown.status === 'rejected') {
          console.warn(`⚠️  Markdown conversion failed: ${markdown.reason.message}`);
        }
        
        return {
          markdown: markdownContent,
          page: pageData,
          partial: markdown.status === 'rejected'
        };
      });
      
      // Cache results with different TTLs based on success/failure
      if (result.partial || !result.markdown || result.markdown.trim() === '') {
        // Cache partial/failed results for only 1 minute for faster retries
        setCachedResponse(cacheKey, result, 1);
        console.log(`💾 API: Cached page ${pageId.slice(0, 8)}... (partial/failed - 1min cache)`);
      } else {
        // Cache successful results for 5 minutes
        setCachedResponse(cacheKey, result);
        console.log(`💾 API: Cached page ${pageId.slice(0, 8)}... (success - 5min cache)`);
      }

      requestTimer.end();
      return NextResponse.json({
        success: true,
        data: result,
      });
    }

    requestTimer.end();
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  } catch (error) {
    requestTimer.end();
    if (error instanceof BlogPostNotFoundError || error.code === 'object_not_found') {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 });
    }
    console.error(`❌ API Error: ${error.message}`);
    
    // Return more specific error messages
    const errorMessage = error.message.includes('timeout') 
      ? `Request timeout: ${error.message}`
      : `Notion API error: ${error.message}`;
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
