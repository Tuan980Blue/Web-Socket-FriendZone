'use client';

import React, { useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import { ChevronDown, Check, Loader2 } from 'lucide-react';
import {Avatar, Button} from "@mantine/core";
import QuickPostHeader from './QuickPostHeader';
import QuickPostContent from './QuickPostContent';
import QuickPostActions from './QuickPostActions';
import PrivacyDropdown from './PrivacyDropdown';
import QuickOptionsPopup from './QuickOptionsPopup';
import {useUserData} from "@/hooks/useUserData";

interface QuickPostProps {
  isCurrentUser: boolean;
}

export default function QuickPost({ isCurrentUser }: QuickPostProps) {
  const { theme } = useTheme();
  const [postContent, setPostContent] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [selectedPrivacy, setSelectedPrivacy] = useState('public');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {user} = useUserData();

  const handlePostSubmit = async () => {
    setIsLoading(true);
    try {
      // Handle post submission logic here
      console.log('Posting:', postContent);
      setPostContent('');
      setIsExpanded(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  if (!isCurrentUser) return null;

  return (
    <div className="w-auto max-w-6xl mx-auto mb-2 px-2 md:px-0">
      <div 
        className={`rounded-2xl p-3 md:p-4 transition-all duration-300 cursor-pointer
          ${theme === 'dark' 
            ? 'bg-[#121212] border border-[#262626] hover:border-[#DD2A7B]/30' 
            : 'bg-white border border-[#DBDBDB]'}`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {/* Collapsed View */}
        {!isExpanded && (
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] flex items-center justify-center shadow-lg">
                <Avatar src={user?.avatar || '/image-person.png'}/>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm md:text-base text-[#262626] dark:text-[#FAFAFA]">{user?.fullName || undefined}</h3>
              <p className={`text-xs md:text-sm italic ${theme === 'dark' ? 'text-[#8E8E8E]' : 'text-[#8E8E8E]'}`}>
                Bạn đang nghĩ gì thế?
              </p>
            </div>
            <ChevronDown className={`${theme === 'dark' ? 'text-[#8E8E8E]' : 'text-[#8E8E8E]'} transition-transform duration-300`} size={18} />
          </div>
        )}

        {/* Expanded View */}
        {isExpanded && (
          <>
            <QuickPostHeader isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
            
            <div className="mt-3 md:mt-4">
              <QuickPostContent postContent={postContent} setPostContent={setPostContent} />
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mt-3 md:mt-4 space-y-3 md:space-y-0">
              <QuickPostActions 
                handleImageUpload={handleImageUpload}
                showOptions={showOptions}
                setShowOptions={setShowOptions}
              />

              <div className="flex items-center space-x-2 md:space-x-3">
                <PrivacyDropdown
                  selectedPrivacy={selectedPrivacy}
                  setSelectedPrivacy={setSelectedPrivacy}
                  showPrivacyDropdown={showPrivacyDropdown}
                  setShowPrivacyDropdown={setShowPrivacyDropdown}
                />
                <Button
                  onClick={(e) => { e.stopPropagation(); handlePostSubmit(); }}
                  disabled={!postContent.trim() || isLoading}
                  className={`px-4 md:px-6 py-1.5 md:py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 flex items-center space-x-2
                    ${!postContent.trim() || isLoading
                      ? 'bg-[#DBDBDB] text-[#8E8E8E] cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white hover:opacity-90 hover:shadow-lg'}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Đang đăng...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16}/>
                      <span className="ml-1 md:ml-2">Đăng</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            <QuickOptionsPopup showOptions={showOptions} />
          </>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*"
          multiple
        />
      </div>
    </div>
  );
} 