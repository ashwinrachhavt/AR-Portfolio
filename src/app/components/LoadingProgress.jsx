"use client";
import { useState, useEffect } from 'react';

const LoadingProgress = ({ 
  isLoading, 
  progress = 0, 
  status = "Loading content...",
  onRetry = null,
  showRetry = false 
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [dots, setDots] = useState('');

  // Smooth progress animation
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setAnimatedProgress(prev => {
          if (prev < progress) {
            return Math.min(prev + 2, progress);
          }
          return prev;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isLoading, progress]);

  // Animated dots for loading text
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setDots(prev => {
          if (prev.length >= 3) return '';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="min-h-screen bg-[#121212] pt-20 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-[#1a1a1a] border border-[#33353F] rounded-xl p-8 text-center">
          {/* Animated Logo/Icon */}
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9333ea] to-[#7c2d92] rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-[#9333ea] to-[#7c2d92] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>

          {/* Status Text */}
          <h3 className="text-xl font-bold text-white mb-2">
            {status}{dots}
          </h3>
          
          <p className="text-[#ADB7BE] mb-6 text-sm">
            Fetching content from Notion...
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-[#6B7280] mb-2">
              <span>Progress</span>
              <span>{Math.round(animatedProgress)}%</span>
            </div>
            <div className="w-full bg-[#0a0a0a] rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#9333ea] to-[#7c2d92] rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${animatedProgress}%` }}
              >
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Retry Button */}
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-4 py-2 bg-[#9333ea] hover:bg-[#7c2d92] text-white text-sm rounded-lg transition-colors duration-300"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry Now
            </button>
          )}

          {/* Loading Animation */}
          <div className="flex justify-center space-x-1 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-[#9333ea] rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingProgress;
