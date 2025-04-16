'use client';

import React, { useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import { UserCircle2, ChevronDown, Check, Loader2 } from 'lucide-react';
import { Button } from "@mantine/core";
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
    <div className="w-auto max-w-6xl mx-auto mb-4">
      <div 
        className={`rounded-2xl p-4 shadow-lg transition-all duration-300 cursor-pointer
          ${theme === 'dark' 
            ? 'bg-[#121212] border border-[#262626] hover:border-[#DD2A7B]/30' 
            : 'bg-white border border-[#DBDBDB] hover:border-[#DD2A7B]/30'}`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        {/* Collapsed View */}
        {!isExpanded && (
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] flex items-center justify-center shadow-lg">
                <UserCircle2 className="text-white" size={24} />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[#262626] dark:text-[#FAFAFA]">{user?.fullName || undefined}</h3>
              <p className={`text-sm italic ${theme === 'dark' ? 'text-[#8E8E8E]' : 'text-[#8E8E8E]'}`}>
                Bạn đang nghĩ gì thế?
              </p>
            </div>
            <ChevronDown className={`${theme === 'dark' ? 'text-[#8E8E8E]' : 'text-[#8E8E8E]'} transition-transform duration-300`} size={20} />
          </div>
        )}

        {/* Expanded View */}
        {isExpanded && (
          <>
            <QuickPostHeader isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
            
            <div className="mt-4">
              <QuickPostContent postContent={postContent} setPostContent={setPostContent} />
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center justify-between mt-4">
              <QuickPostActions 
                handleImageUpload={handleImageUpload}
                showOptions={showOptions}
                setShowOptions={setShowOptions}
              />

              <div className="flex items-center space-x-3">
                <PrivacyDropdown
                  selectedPrivacy={selectedPrivacy}
                  setSelectedPrivacy={setSelectedPrivacy}
                  showPrivacyDropdown={showPrivacyDropdown}
                  setShowPrivacyDropdown={setShowPrivacyDropdown}
                />
                <Button
                  onClick={(e) => { e.stopPropagation(); handlePostSubmit(); }}
                  disabled={!postContent.trim() || isLoading}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 flex items-center space-x-2
                    ${!postContent.trim() || isLoading
                      ? 'bg-[#DBDBDB] text-[#8E8E8E] cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white hover:opacity-90 hover:shadow-lg'}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Đang đăng...</span>
                    </>
                  ) : (
                    <>
                      <Check size={18}/>
                      <span className="ml-2">Đăng</span>
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