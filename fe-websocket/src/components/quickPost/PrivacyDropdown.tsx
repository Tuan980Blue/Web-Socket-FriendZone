import React from 'react';
import { Globe, Users, Lock, ChevronDown, Check } from 'lucide-react';
import { useTheme } from 'next-themes';

interface PrivacyOption {
  value: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}

interface PrivacyDropdownProps {
  selectedPrivacy: string;
  setSelectedPrivacy: (value: string) => void;
  showPrivacyDropdown: boolean;
  setShowPrivacyDropdown: (value: boolean) => void;
}

export default function PrivacyDropdown({
  selectedPrivacy,
  setSelectedPrivacy,
  showPrivacyDropdown,
  setShowPrivacyDropdown
}: PrivacyDropdownProps) {
  const { theme } = useTheme();

  const privacyOptions: PrivacyOption[] = [
    { 
      value: 'public', 
      icon: <Globe size={16} />, 
      label: 'Công khai',
      description: 'Mọi người có thể xem bài viết của bạn',
      color: 'text-[#20C997]',
      bgColor: 'bg-[#20C997]/10'
    },
    { 
      value: 'friends', 
      icon: <Users size={16} />, 
      label: 'Bạn bè',
      description: 'Chỉ bạn bè của bạn có thể xem bài viết',
      color: 'text-[#3897F0]',
      bgColor: 'bg-[#3897F0]/10'
    },
    { 
      value: 'private', 
      icon: <Lock size={16} />, 
      label: 'Riêng tư',
      description: 'Chỉ bạn có thể xem bài viết',
      color: 'text-[#ED4956]',
      bgColor: 'bg-[#ED4956]/10'
    },
  ];

  const selectedOption = privacyOptions.find(opt => opt.value === selectedPrivacy);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowPrivacyDropdown(!showPrivacyDropdown);
        }}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-300
          ${theme === 'dark'
            ? 'bg-[#262626] text-[#FAFAFA] hover:bg-[#262626]'
            : 'bg-[#FAFAFA] text-[#262626] hover:bg-[#FAFAFA]'}`}
      >
        {selectedOption?.icon}
        <span className="text-sm font-medium">
          {selectedOption?.label}
        </span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${showPrivacyDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showPrivacyDropdown && (
        <div 
          className={`absolute right-0 mt-2 w-64 rounded-xl shadow-lg transition-all duration-300 z-10
            ${theme === 'dark' 
              ? 'bg-[#121212] border border-[#262626]' 
              : 'bg-white border border-[#DBDBDB]'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {privacyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSelectedPrivacy(option.value);
                setShowPrivacyDropdown(false);
              }}
              className={`w-full flex items-start space-x-3 p-3 transition-colors duration-200
                ${theme === 'dark'
                  ? 'hover:bg-[#262626] text-[#FAFAFA]'
                  : 'hover:bg-[#FAFAFA] text-[#262626]'}
                ${selectedPrivacy === option.value ? option.bgColor : ''}`}
            >
              <div className={`p-2 rounded-lg ${option.bgColor}`}>
                {option.icon}
              </div>
              <div className="flex-1 text-left">
                <div className={`font-medium ${option.color}`}>{option.label}</div>
                <div className="text-xs text-[#8E8E8E]">{option.description}</div>
              </div>
              {selectedPrivacy === option.value && (
                <Check size={16} className="text-[#20C997]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 