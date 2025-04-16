import React from 'react';
import { useTheme } from 'next-themes';

interface QuickPostContentProps {
  postContent: string;
  setPostContent: (value: string) => void;
}

export default function QuickPostContent({ postContent, setPostContent }: QuickPostContentProps) {
  const { theme } = useTheme();

  return (
    <textarea
      className={`w-full p-3 text-[#262626] dark:text-[#FAFAFA] rounded-xl resize-none focus:outline-none transition-colors duration-300
        ${theme === 'dark' 
          ? 'bg-[#121212] placeholder-[#8E8E8E] focus:ring-2 focus:ring-[#DD2A7B]/50 border border-[#262626]' 
          : 'bg-[#FAFAFA] placeholder-[#8E8E8E] focus:ring-2 focus:ring-[#DD2A7B]/50 border border-[#DBDBDB]'}`}
      placeholder="Bạn đang nghĩ gì?"
      rows={4}
      value={postContent}
      onChange={(e) => setPostContent(e.target.value)}
      onClick={(e) => e.stopPropagation()}
    />
  );
} 