import React from 'react';

/**
 * Format a date string to a relative time string (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
}

/**
 * Format a number to a human-readable string (e.g., 1000 -> "1K", 1000000 -> "1M")
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

/**
 * Extract hashtags from a string
 */
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
  return text.match(hashtagRegex) || [];
}

/**
 * Extract mentions from a string
 */
export function extractMentions(text: string): string[] {
  const mentionRegex = /@[\w\u0590-\u05ff]+/g;
  return text.match(mentionRegex) || [];
}

/**
 * Format text with highlighted hashtags and mentions
 * This function returns an array of strings and React elements
 */
export function formatTextWithHighlights(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  
  // Combine hashtags and mentions regex
  const combinedRegex = /(#|@)[\w\u0590-\u05ff]+/g;
  let match;
  
  while ((match = combinedRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(
        React.createElement('span', 
          { key: `text-${lastIndex}` },
          text.substring(lastIndex, match.index)
        )
      );
    }
    
    // Add the highlighted hashtag or mention
    const isHashtag = match[0].startsWith('#');
    parts.push(
      React.createElement('span', 
        { 
          key: `${isHashtag ? 'hashtag' : 'mention'}-${match.index}`,
          className: `${isHashtag ? 'text-blue-500' : 'text-purple-500'} cursor-pointer hover:underline`
        },
        match[0]
      )
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text
  if (lastIndex < text.length) {
    parts.push(
      React.createElement('span', 
        { key: `text-${lastIndex}` },
        text.substring(lastIndex)
      )
    );
  }
  
  return parts;
} 