import React, { useState, useMemo } from 'react';
import { useStories } from '@/hooks/useStories';
import { motion } from 'framer-motion';
import { User } from '@/types/user';
import { Story, CreateStoryData } from '@/types/story';
import AddStoryModal from './story/AddStoryModal';
import StoryViewer from './story/StoryViewer';
import MyStoryViews from './story/MyStoryViews';
import HighlightManager from './story/HighlightManager';

interface StorySectionProps {
  user: User | null;
}

interface UnifiedStoryItem {
  story: Story;
  author: {
    id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  isOwnStory: boolean;
  hasUnviewedStories: boolean;
}

const StorySection: React.FC<StorySectionProps> = ({ user }) => {
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
  const [isViewingStory, setIsViewingStory] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  
  const { 
    storiesFeed, 
    myStories, 
    createStory, 
    isCreatingStory,
    storiesFeedLoading,
    myStoriesLoading 
  } = useStories();

  // Memoized unified stories array with proper structure
  const unifiedStories = useMemo((): UnifiedStoryItem[] => {
    const stories: UnifiedStoryItem[] = [];

    // Add my stories first
    myStories.forEach(story => {
      if (story && story.authorId && user) {
        stories.push({
          story,
          author: {
            id: user.id,
            username: user.username || 'Unknown',
            fullName: user.fullName || 'Unknown User',
            avatar: user.avatar
          },
          isOwnStory: true,
          hasUnviewedStories: false // Own stories are always "viewed"
        });
      }
    });

    // Add feed stories
    storiesFeed.forEach(feedItem => {
      if (feedItem.author && feedItem.stories && feedItem.stories.length > 0) {
        // Check if any story in this user's collection hasn't been viewed
        const hasUnviewed = feedItem.stories.some(story => 
          story && !story.isLikedByCurrentUser && story.viewCount === 0
        );

        feedItem.stories.forEach(story => {
          if (story && story.authorId) {
            stories.push({
              story,
              author: feedItem.author,
              isOwnStory: false,
              hasUnviewedStories: hasUnviewed
            });
          }
        });
      }
    });

    return stories;
  }, [myStories, storiesFeed, user]);

  // Memoized story groups for display
  const storyGroups = useMemo(() => {
    const groups: { [key: string]: UnifiedStoryItem[] } = {};

    unifiedStories.forEach(item => {
      const key = item.author.id;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });

    return Object.values(groups);
  }, [unifiedStories]);

  const handleAddStory = (data: CreateStoryData) => {
    createStory(data);
    setIsAddStoryModalOpen(false);
  };

  const openStory = (storyIndex: number) => {
    if (storyIndex >= 0 && storyIndex < unifiedStories.length) {
      setSelectedStoryIndex(storyIndex);
      setIsViewingStory(true);
    }
  };

  const closeStory = () => {
    setIsViewingStory(false);
  };

  // Get the first story index for a specific author
  const getFirstStoryIndexForAuthor = (authorId: string): number => {
    return unifiedStories.findIndex(item => item.author.id === authorId);
  };

  const isLoading = storiesFeedLoading || myStoriesLoading;

  return (
    <div className="mb-8">
      {/* Stories Horizontal Scroll */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4 px-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stories</h3>
            <div className="flex items-center space-x-4">
              {/* My Story Views Stats */}
              {user && myStories.length > 0 && (
                <MyStoryViews />
              )}
              
              {/* Highlights Manager */}
              {user && myStories.length > 0 && (
                <HighlightManager
                  userId={user.id}
                  currentUser={user}
                  stories={myStories}
                />
              )}
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex flex-col items-center space-y-1 flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4">
              {/* Add Story Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer"
                onClick={() => setIsAddStoryModalOpen(true)}
              >
                <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">+</span>
                  </div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Add Story</span>
              </motion.div>

              {/* Story Groups */}
              {storyGroups.map((group) => {
                const firstStory = group[0];
                const storyIndex = getFirstStoryIndexForAuthor(firstStory.author.id);
                const hasUnviewedStories = group.some(item => item.hasUnviewedStories);
                const isOwnStory = firstStory.isOwnStory;
                
                return (
                  <div key={firstStory.author.id} className="relative">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer"
                      onClick={() => openStory(storyIndex)}
                    >
                      <div className={`relative w-16 h-16 rounded-full p-0.5 ${
                        hasUnviewedStories 
                          ? 'bg-gradient-to-tr from-yellow-400 to-pink-600' 
                          : 'bg-gradient-to-tr from-gray-400 to-gray-600'
                      }`}>
                        <img
                          src={firstStory.author.avatar || '/default-avatar.png'}
                          alt={firstStory.author.username}
                          className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/default-avatar.png';
                          }}
                        />
                        
                        {/* Story count badge for multiple stories */}
                        {group.length > 1 && (
                          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                            {group.length}
                          </div>
                        )}
                        
                        {/* View count badge for own stories */}
                        {isOwnStory && firstStory.story.viewCount > 0 && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {firstStory.story.viewCount > 99 ? '99+' : firstStory.story.viewCount}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[60px]">
                        {isOwnStory ? 'Your story' : firstStory.author.username}
                      </span>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Story Viewer */}
      <StoryViewer
        stories={unifiedStories.map(item => item.story)}
        initialStoryIndex={selectedStoryIndex}
        isOpen={isViewingStory}
        onClose={closeStory}
        currentUser={user}
      />

      {/* Add Story Modal */}
      <AddStoryModal
        isOpen={isAddStoryModalOpen}
        onClose={() => setIsAddStoryModalOpen(false)}
        onAddStory={handleAddStory}
        isLoading={isCreatingStory}
      />
    </div>
  );
};

export default StorySection; 