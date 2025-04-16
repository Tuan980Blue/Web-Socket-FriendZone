import React from 'react';
import { UserCircle2, X } from 'lucide-react';
import { useTheme } from 'next-themes';

interface QuickPostHeaderProps {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

export default function QuickPostHeader({ isExpanded, setIsExpanded }: QuickPostHeaderProps) {
  const { theme } = useTheme();

  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] flex items-center justify-center shadow-lg">
          <UserCircle2 className="text-white" size={24} />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <h3 className={`font-semibold text-lg ${theme === 'dark' ? 'text-[#FAFAFA]' : 'text-[#262626]'}`}>
            {isExpanded ? 'Tạo bài viết mới' : 'Bạn đang nghĩ gì?'}
          </h3>
          {isExpanded && (
            <button 
              onClick={() => setIsExpanded(false)}
              className={`p-1.5 rounded-full hover:bg-[#FAFAFA] dark:hover:bg-[#262626] transition-colors duration-200`}
            >
              <X size={20} className={theme === 'dark' ? 'text-[#8E8E8E]' : 'text-[#8E8E8E]'} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 