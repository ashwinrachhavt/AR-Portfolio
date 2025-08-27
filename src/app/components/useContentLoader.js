import { useState, useEffect, useCallback } from 'react';

const useContentLoader = (pageId, initialContent = null) => {
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(!initialContent);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const updateProgress = useCallback((newProgress, newStatus) => {
    setProgress(newProgress);
    setStatus(newStatus);
  }, []);

  const fetchContent = useCallback(async (isRetry = false) => {
    if (!pageId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      if (isRetry) {
        setStatus(`Retrying... (${retryCount + 1}/${maxRetries})`);
        setProgress(0);
      } else {
        setStatus('Connecting to Notion...');
        setProgress(10);
      }

      // Simulate progress for user experience
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 70) return prev + 5;
          return prev;
        });
      }, 200);

      updateProgress(25, 'Fetching page data...');
      
      const response = await fetch(`/api/notion?type=page&pageId=${pageId}`, {
        // Add cache-busting for retries
        cache: isRetry ? 'no-cache' : 'default',
        headers: isRetry ? { 'Cache-Control': 'no-cache' } : {}
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      updateProgress(60, 'Processing content...');
      const data = await response.json();
      
      clearInterval(progressInterval);

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch content');
      }

      const { markdown, page, partial } = data.data;

      // Check if we got valid content
      const hasValidMarkdown = markdown && markdown.trim() !== '';
      const hasValidPage = page && Object.keys(page).length > 0;

      if (!hasValidMarkdown && !partial) {
        throw new Error('Content is empty or invalid');
      }

      updateProgress(90, 'Finalizing...');
      
      // Brief delay to show completion
      setTimeout(() => {
        updateProgress(100, 'Content loaded successfully!');
        setContent(data.data);
        setIsLoading(false);
        setRetryCount(0);
      }, 300);

    } catch (err) {
      console.error('Content loading error:', err);
      setError(err.message);
      setProgress(0);
      
      if (retryCount < maxRetries) {
        setStatus(`Loading failed. Retrying in 3 seconds...`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchContent(true);
        }, 3000);
      } else {
        setStatus('Failed to load content');
        setIsLoading(false);
      }
    }
  }, [pageId, retryCount, maxRetries, updateProgress]);

  const manualRetry = useCallback(() => {
    setRetryCount(0);
    fetchContent(true);
  }, [fetchContent]);

  // Auto-fetch on mount or pageId change
  useEffect(() => {
    if (pageId && !content) {
      fetchContent();
    }
  }, [pageId, content, fetchContent]);

  return {
    content,
    isLoading,
    progress,
    status,
    error,
    retryCount,
    maxRetries,
    retry: manualRetry,
    hasContent: content && content.markdown && content.markdown.trim() !== ''
  };
};

export default useContentLoader;
