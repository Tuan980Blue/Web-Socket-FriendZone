'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { IconPlus, IconEye } from '@tabler/icons-react';
import { User } from '@/types/user';
import { Highlight, Story } from '@/types/story';
import { storyService } from '@/services/storyService';
import { notifications } from '@mantine/notifications';
import CreateHighlightModal from './CreateHighlightModal';
import HighlightDetailModal from './HighlightDetailModal';

interface ProfileStoriesProps {
  user: User;
  isCurrentUser?: boolean;
}

export default function StoryHightlights({ user, isCurrentUser = false }: ProfileStoriesProps) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch highlights
        const highlightsData = await storyService.getUserHighlights(user.id);
        setHighlights(highlightsData);
        
        // Fetch stories - use getUserStories for other users, getMyStories for current user
        if (isCurrentUser) {
          const myStoriesData = await storyService.getMyStories();
          setStories(myStoriesData);
        } else {
          const userStoriesData = await storyService.getUserStories(user.id);
          setStories(userStoriesData.stories);
        }
      } catch (error) {
        console.error('Error fetching stories and highlights:', error);
        notifications.show({
          title: 'Lỗi',
          message: 'Không thể tải stories và highlights',
          color: 'red',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user.id, isCurrentUser]);

  const handleCreateHighlight = async () => {
    if (!isCurrentUser) return;
    setIsModalOpen(true);
  };

  const handleHighlightCreated = () => {
    // Refresh highlights data
    const refreshData = async () => {
      try {
        const highlightsData = await storyService.getUserHighlights(user.id);
        setHighlights(highlightsData);
      } catch (error) {
        console.error('Error refreshing highlights:', error);
      }
    };
    refreshData();
  };

  const handleHighlightClick = (highlight: Highlight) => {
    setSelectedHighlight(highlight);
    setIsDetailModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 py-4">
        <div className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide pb-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 flex-shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 py-4">
      <div 
        className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide pb-4 touch-pan-x"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          cursor: 'grab',
          userSelect: 'none',
        }}
      >
        {/* Add Highlight Button - Only show for current user */}
        {isCurrentUser && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center space-y-1 sm:space-y-2 flex-shrink-0 cursor-pointer"
            onClick={handleCreateHighlight}
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <IconPlus size={20} className="text-gray-600 dark:text-gray-400" />
            </div>
            <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 text-center">
              Add Highlight
            </span>
          </motion.div>
        )}

        {/* Highlights */}
        {highlights.map((highlight) => (
          <motion.div
            key={highlight.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center space-y-1 sm:space-y-2 flex-shrink-0 cursor-pointer"
            onClick={() => handleHighlightClick(highlight)}
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 p-1">
              <Image
                src={highlight.coverImage || '/image-person.png'}
                alt={highlight.name}
                fill
                className="object-cover rounded-full"
              />
              {/* Story count badge */}
              {highlight.stories && highlight.stories.length > 0 && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
                  {highlight.stories.length}
                </div>
              )}
            </div>
            <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate max-w-[60px] sm:max-w-[80px] text-center">
              {highlight.name}
            </span>
          </motion.div>
        ))}

        {/* Stories (if no highlights or as additional content) */}
        {stories.length > 0 && highlights.length === 0 && (
          <>
            {/* Add Story Button - Only show for current user */}
            {isCurrentUser && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center space-y-1 sm:space-y-2 flex-shrink-0"
              >
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 opacity-50" />
                  <IconPlus size={20} className="text-gray-600 dark:text-gray-400" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Add Story</span>
              </motion.div>
            )}

            {stories.slice(0, 5).map((story) => (
              <motion.div
                key={story.id}
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center space-y-1 sm:space-y-2 flex-shrink-0"
              >
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 p-1">
                  <Image
                    src={story.mediaUrl}
                    alt={user.username}
                    fill
                    className="object-cover rounded-full"
                  />
                  {/* View count indicator */}
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <IconEye size={16} className="text-white" />
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate max-w-[60px] sm:max-w-[80px]">
                  {story.location || 'Story'}
                </span>
              </motion.div>
            ))}
          </>
        )}

        {/* Empty state */}
        {highlights.length === 0 && stories.length === 0 && (
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <IconEye size={20} className="text-gray-400" />
            </div>
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 text-center">
              {isCurrentUser ? 'No stories yet' : 'No highlights yet'}
            </span>
          </div>
        )}
      </div>

      {/* Create Highlight Modal */}
      <CreateHighlightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stories={stories}
        onHighlightCreated={handleHighlightCreated}
      />

      {/* Highlight Detail Modal */}
      <HighlightDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedHighlight(null);
        }}
        highlight={selectedHighlight}
        isCurrentUser={isCurrentUser}
        availableStories={stories}
        onHighlightUpdated={handleHighlightCreated}
      />
    </div>
  );
} 