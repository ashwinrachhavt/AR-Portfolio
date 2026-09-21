import { useState, useEffect, useCallback } from "react";

async function fetchNotionPage(pageId, isRetry) {
  const response = await fetch(`/api/notion?type=page&pageId=${pageId}`, {
    cache: isRetry ? "no-cache" : "default",
    headers: isRetry ? { "Cache-Control": "no-cache" } : {},
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch content");
  }

  const { markdown, page, partial } = data.data;
  const hasValidMarkdown = markdown && markdown.trim() !== "";

  if (!hasValidMarkdown && !partial && !page) {
    throw new Error("Content is empty or invalid");
  }

  return data.data;
}

const useContentLoader = (pageId, initialContent = null) => {
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(!initialContent);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [retryTick, setRetryTick] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    if (!pageId || content) {
      return undefined;
    }

    let cancelled = false;
    const attempt = retryTick;

    const timer = setTimeout(() => {
      void (async () => {
        try {
          setIsLoading(true);
          setError(null);

          if (attempt > 0) {
            setStatus(`Retrying... (${attempt}/${maxRetries})`);
            setProgress(0);
          } else {
            setStatus("Connecting to Notion...");
            setProgress(10);
          }

          setProgress(25);
          setStatus("Fetching page data...");
          const data = await fetchNotionPage(pageId, attempt > 0);
          if (cancelled) return;

          setProgress(90);
          setStatus("Finalizing...");
          setContent(data);
          setProgress(100);
          setStatus("Content loaded successfully!");
          setIsLoading(false);
          setRetryCount(0);
        } catch (err) {
          if (cancelled) return;
          setError(err.message);
          setProgress(0);

          if (attempt < maxRetries) {
            setStatus("Loading failed. Retrying in 3 seconds...");
            setRetryCount(attempt + 1);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            if (!cancelled) {
              setRetryTick(attempt + 1);
            }
          } else {
            setStatus("Failed to load content");
            setIsLoading(false);
          }
        }
      })();
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pageId, content, retryTick]);

  const retry = useCallback(() => {
    setRetryCount(0);
    setContent(null);
    setIsLoading(true);
    setRetryTick((current) => current + 1);
  }, []);

  return {
    content,
    isLoading,
    progress,
    status,
    error,
    retryCount,
    maxRetries,
    retry,
    hasContent: content && content.markdown && content.markdown.trim() !== "",
  };
};

export default useContentLoader;
