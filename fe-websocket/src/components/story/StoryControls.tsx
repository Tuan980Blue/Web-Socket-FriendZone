import React from 'react';
import Image from 'next/image';

interface StoryControlsProps {
  username: string;
  avatarUrl: string;
  createdAt: Date;
  onClose: () => void;
  onToggleViewers: () => void;
  onToggleReactions: () => void;
  onToggleReactionPicker: () => void;
  onPrevStory: () => void;
  onNextStory: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

const StoryControls: React.FC<StoryControlsProps> = ({
  username,
  avatarUrl,
  createdAt,
  onClose,
  onToggleViewers,
  onToggleReactions,
  onToggleReactionPicker,
  onPrevStory,
  onNextStory,
  canGoPrev,
  canGoNext
}) => {
  return (
    <>
      {/* User Info */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={avatarUrl || "/default-avatar.png"}
              alt={username || ""}
              width={32}
              height={32}
            />
          </div>
          <span className="text-white font-medium">{username}</span>
          <span className="text-white text-xs opacity-75">
            {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="text-white bg-black/50 rounded-full p-2"
            onClick={(e) => {
              e.stopPropagation();
              onToggleViewers();
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          
          <button 
            className="text-white bg-black/50 rounded-full p-2"
            onClick={(e) => {
              e.stopPropagation();
              onToggleReactions();
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <button 
            className="text-white bg-black/50 rounded-full p-2"
            onClick={(e) => {
              e.stopPropagation();
              onToggleReactionPicker();
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          <button
            className="text-white bg-black/50 rounded-full p-2"
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-2 z-20"
        onClick={(e) => {
          e.stopPropagation();
          onPrevStory();
        }}
        disabled={!canGoPrev}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-2 z-20"
        onClick={(e) => {
          e.stopPropagation();
          onNextStory();
        }}
        disabled={!canGoNext}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  );
};

export default StoryControls; 