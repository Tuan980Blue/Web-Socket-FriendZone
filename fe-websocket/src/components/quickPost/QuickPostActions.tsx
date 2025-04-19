import React from 'react';
import { Video, Image, Smile } from 'lucide-react';
import { useTheme } from 'next-themes';

interface QuickPostActionsProps {
  handleImageUpload: () => void;
  showOptions: boolean;
  setShowOptions: (value: boolean) => void;
}

export default function QuickPostActions({ 
  handleImageUpload, 
  showOptions,
  setShowOptions 
}: QuickPostActionsProps) {
  const { theme } = useTheme();

  return (
    <div className="flex space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300
          ${theme === 'dark'
            ? 'hover:bg-[#262626] text-[#FAFAFA]'
            : 'hover:bg-[#FAFAFA] text-[#262626]'}`}
      >
        <Video className="text-[#ED4956]" size={20}/>
        <span className="text-sm font-medium">Phát trực tiếp</span>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleImageUpload();
        }}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300
          ${theme === 'dark'
            ? 'hover:bg-[#262626] text-[#FAFAFA]'
            : 'hover:bg-[#FAFAFA] text-[#262626]'}`}
      >
        <span aria-label="Upload image icon">
          <Image className="text-[#3897F0]" size={20}/>
        </span>
        <span className="text-sm font-medium">Ảnh/video</span>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowOptions(!showOptions);
        }}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300
          ${theme === 'dark'
            ? 'hover:bg-[#262626] text-[#FAFAFA]'
            : 'hover:bg-[#FAFAFA] text-[#262626]'}`}
      >
        <Smile className="text-[#F58529]" size={20}/>
        <span className="text-sm font-medium">Cảm xúc/hoạt động</span>
      </button>
    </div>
  );
} 