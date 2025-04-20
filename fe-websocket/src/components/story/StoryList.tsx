import React from 'react';
import Image from 'next/image';
import { StoryGroup } from '@/hooks/useStories';
import { useUserData } from '@/hooks/useUserData';

interface StoryListProps {
  groupedStories: StoryGroup[];
  onStoryClick: (groupIndex: number, storyIndex?: number) => void;
  onAddStory: () => void;
}

const StoryList: React.FC<StoryListProps> = ({
  groupedStories,
  onStoryClick,
  onAddStory
}) => {
  const { user } = useUserData();
  
  return (
    <div className="flex space-x-4 overflow-x-auto pb-2 scroll-smooth 2xl:max-w-4xl lg:max-w-2xl md:max-w-xl max-w-md mx-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Add Story Button */}
      <div 
        className="flex flex-col items-center cursor-pointer"
        onClick={onAddStory}
      >
        <div className="relative w-16 h-16 rounded-full border-2 border-blue-500 p-1">
          <Image
            src={user?.avatar || '/image-person.png'}
            alt="Your story"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </div>
        <span className="text-xs mt-1">Your Story</span>
      </div>

      {/* Story Items */}
      {groupedStories.map((group, groupIndex) => (
        <div
          key={group.userId}
          className="flex flex-col items-center cursor-pointer"
          onClick={() => onStoryClick(groupIndex)}
        >
          <div className={`relative w-16 h-16 rounded-full p-1 ${
            group.stories.some(story => !story.hasViewed)
              ? 'border-2 border-blue-500'
              : 'border-2 border-gray-300'
          }`}>
            <Image
              src={group.avatarUrl || "/default-avatar.png"}
              alt={group.username}
              width={56}
              height={56}
              className="rounded-full"
            />
            {group.isHighlighted && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
            {group.isCloseFriend && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
            )}
          </div>
          <span className="text-xs mt-1 truncate max-w-[64px]">
            {group.username}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StoryList; 