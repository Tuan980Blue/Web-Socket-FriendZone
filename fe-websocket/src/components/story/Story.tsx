'use client';

import React, { useState } from 'react';
import { useStories } from '@/hooks/useStories';
import StoryList from './StoryList';
import StoryModal from './StoryModal';
import AddStoryModal from './AddStoryModal';

interface StoryProps {
  currentUserId: string;
  currentUsername: string;
  currentUserAvatar: string;
  onAddStory: (file: File) => void;
}

const Story: React.FC<StoryProps> = ({ 
  currentUserId, 
  currentUsername, 
  currentUserAvatar,
  onAddStory 
}) => {
  const { 
    groupedStories, 
    loading, 
    error, 
    markStoryAsViewed, 
    addReaction, 
    addReply, 
    addViewer 
  } = useStories();
  
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
  
  // Handle story click
  const handleStoryClick = (groupIndex: number, storyIndex: number = 0) => {
    setSelectedGroupIndex(groupIndex);
    setSelectedStoryIndex(storyIndex);
    setIsModalOpen(true);
    
    // Mark as viewed
    const story = groupedStories[groupIndex].stories[storyIndex];
    markStoryAsViewed(story.id);
    
    // Add viewer
    addViewer({
      storyId: story.id,
      userId: currentUserId,
      username: currentUsername,
      avatarUrl: currentUserAvatar
    });
  };
  
  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGroupIndex(null);
    setSelectedStoryIndex(0);
  };
  
  // Handle next story
  const handleNextStory = () => {
    if (selectedGroupIndex === null) return;
    
    const selectedGroup = groupedStories[selectedGroupIndex];
    
    // If there are more stories in the current group
    if (selectedStoryIndex < selectedGroup.stories.length - 1) {
      setSelectedStoryIndex(selectedStoryIndex + 1);
      
      // Mark as viewed
      const nextStory = selectedGroup.stories[selectedStoryIndex + 1];
      markStoryAsViewed(nextStory.id);
      addViewer({
        storyId: nextStory.id,
        userId: currentUserId,
        username: currentUsername,
        avatarUrl: currentUserAvatar
      });
    } 
    // If there are more groups
    else if (selectedGroupIndex < groupedStories.length - 1) {
      setSelectedGroupIndex(selectedGroupIndex + 1);
      setSelectedStoryIndex(0);
      
      // Mark as viewed
      const nextGroup = groupedStories[selectedGroupIndex + 1];
      const nextStory = nextGroup.stories[0];
      markStoryAsViewed(nextStory.id);
      addViewer({
        storyId: nextStory.id,
        userId: currentUserId,
        username: currentUsername,
        avatarUrl: currentUserAvatar
      });
    } 
    // End of all stories
    else {
      handleCloseModal();
    }
  };
  
  // Handle previous story
  const handlePrevStory = () => {
    if (selectedGroupIndex === null) return;
    
    // If there are previous stories in the current group
    if (selectedStoryIndex > 0) {
      setSelectedStoryIndex(selectedStoryIndex - 1);
    } 
    // If there are previous groups
    else if (selectedGroupIndex > 0) {
      const prevGroup = groupedStories[selectedGroupIndex - 1];
      setSelectedGroupIndex(selectedGroupIndex - 1);
      setSelectedStoryIndex(prevGroup.stories.length - 1);
    }
  };
  
  // Handle add reaction
  const handleAddReaction = (storyId: string, emoji: string) => {
    addReaction({
      storyId,
      userId: currentUserId,
      emoji
    });
  };
  
  // Handle add reply
  const handleAddReply = (storyId: string, content: string) => {
    addReply({
      storyId,
      userId: currentUserId,
      username: currentUsername,
      avatarUrl: currentUserAvatar,
      content
    });
  };
  
  // Handle open add story modal
  const handleOpenAddStoryModal = () => {
    setIsAddStoryModalOpen(true);
  };
  
  // Handle close add story modal
  const handleCloseAddStoryModal = () => {
    setIsAddStoryModalOpen(false);
  };
  
  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="text-center text-red-500">
          {error instanceof Error ? error.message : 'An error occurred'}
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-2">
      <StoryList 
        groupedStories={groupedStories}
        onStoryClick={handleStoryClick}
        onAddStory={handleOpenAddStoryModal}
      />
      
      {/* Story Modal */}
      {isModalOpen && selectedGroupIndex !== null && (
        <StoryModal 
          selectedGroup={groupedStories[selectedGroupIndex]}
          selectedStoryIndex={selectedStoryIndex}
          selectedGroupIndex={selectedGroupIndex}
          groupedStories={groupedStories}
          onClose={handleCloseModal}
          onNextStory={handleNextStory}
          onPrevStory={handlePrevStory}
          onAddReaction={handleAddReaction}
          onAddReply={handleAddReply}
        />
      )}
      
      {/* Add Story Modal */}
      {isAddStoryModalOpen && (
        <AddStoryModal 
          isOpen={isAddStoryModalOpen}
          onClose={handleCloseAddStoryModal}
          onAddStory={(file) => {
            // TODO: Implement file upload logic
            onAddStory(file);
          }}
        />
      )}
    </div>
  );
};

export default Story; 