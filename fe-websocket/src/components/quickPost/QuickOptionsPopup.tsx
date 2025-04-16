import React from 'react';
import { MapPin, Users, Clock, Plus } from 'lucide-react';
import { useTheme } from 'next-themes';

interface QuickOptionsPopupProps {
  showOptions: boolean;
}

export default function QuickOptionsPopup({ showOptions }: QuickOptionsPopupProps) {
  const { theme } = useTheme();

  if (!showOptions) return null;

  return (
    <div 
      className={`mt-4 p-4 rounded-xl transition-all duration-300
        ${theme === 'dark' 
          ? 'bg-[#121212] border border-[#262626]' 
          : 'bg-[#FAFAFA] border border-[#DBDBDB]'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid grid-cols-2 gap-3">
        <button className={`flex items-center space-x-2 p-3 rounded-lg transition-colors duration-200
          ${theme === 'dark' 
            ? 'hover:bg-[#262626] text-[#FAFAFA]' 
            : 'hover:bg-[#FAFAFA] text-[#262626]'}`}>
          <MapPin size={18} className="text-[#3897F0]" />
          <span className="text-sm font-medium">Vị trí</span>
        </button>
        <button className={`flex items-center space-x-2 p-3 rounded-lg transition-colors duration-200
          ${theme === 'dark' 
            ? 'hover:bg-[#262626] text-[#FAFAFA]' 
            : 'hover:bg-[#FAFAFA] text-[#262626]'}`}>
          <Users size={18} className="text-[#20C997]" />
          <span className="text-sm font-medium">Gắn thẻ bạn bè</span>
        </button>
        <button className={`flex items-center space-x-2 p-3 rounded-lg transition-colors duration-200
          ${theme === 'dark' 
            ? 'hover:bg-[#262626] text-[#FAFAFA]' 
            : 'hover:bg-[#FAFAFA] text-[#262626]'}`}>
          <Clock size={18} className="text-[#515BD4]" />
          <span className="text-sm font-medium">Hẹn giờ đăng</span>
        </button>
        <button className={`flex items-center space-x-2 p-3 rounded-lg transition-colors duration-200
          ${theme === 'dark' 
            ? 'hover:bg-[#262626] text-[#FAFAFA]' 
            : 'hover:bg-[#FAFAFA] text-[#262626]'}`}>
          <Plus size={18} className="text-[#DD2A7B]" />
          <span className="text-sm font-medium">Thêm nền</span>
        </button>
      </div>
    </div>
  );
} 