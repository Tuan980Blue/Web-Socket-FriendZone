import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoryGroup } from '@/hooks/useStories';
import StoryProgress from './StoryProgress';
import StoryControls from './StoryControls';
import StoryContent from './StoryContent';
import StoryViewers from './StoryViewers';
import StoryReactions from './StoryReactions';
import StoryReactionPicker from './StoryReactionPicker';
import StoryReply from './StoryReply';

interface StoryModalProps {
  selectedGroup: StoryGroup | null;
  selectedStoryIndex: number;
  selectedGroupIndex: number;
  groupedStories: StoryGroup[];
  onClose: () => void;
  onNextStory: () => void;
  onPrevStory: () => void;
  onAddReaction: (storyId: string, emoji: string) => void;
  onAddReply: (storyId: string, content: string) => void;
}

const StoryModal: React.FC<StoryModalProps> = ({
  selectedGroup,
  selectedStoryIndex,
  selectedGroupIndex,
  groupedStories,
  onClose,
  onNextStory,
  onPrevStory,
  onAddReaction,
  onAddReply
}) => {
  const [showViewers, setShowViewers] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  
  // Get current story
  const selectedStory = selectedGroup ? selectedGroup.stories[selectedStoryIndex] : null;
  
  // Handle touch start for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  // Handle touch move for swipe
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  // Handle touch end for swipe
  const handleTouchEnd = () => {
    const swipeDistance = touchEndX.current - touchStartX.current;
    const minSwipeDistance = 50;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe right - go to previous
        onPrevStory();
      } else {
        // Swipe left - go to next
        onNextStory();
      }
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        onNextStory();
      } else if (e.key === 'ArrowLeft') {
        onPrevStory();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextStory, onPrevStory, onClose]);
  
  // Handle reaction
  const handleReaction = (emoji: string) => {
    if (!selectedStory) return;
    
    onAddReaction(selectedStory.id, emoji);
    setShowReactionPicker(false);
  };
  
  // Handle reply
  const handleReply = (content: string) => {
    if (!selectedStory) return;
    
    onAddReply(selectedStory.id, content);
  };
  
  // Toggle viewers list
  const toggleViewers = () => {
    setShowViewers(!showViewers);
    setShowReactions(false);
    setShowReactionPicker(false);
  };
  
  // Toggle reactions list
  const toggleReactions = () => {
    setShowReactions(!showReactions);
    setShowViewers(false);
    setShowReactionPicker(false);
  };
  
  // Toggle reaction picker
  const toggleReactionPicker = () => {
    setShowReactionPicker(!showReactionPicker);
    setShowViewers(false);
    setShowReactions(false);
  };
  
  // Toggle pause
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  if (!selectedStory) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="relative w-full h-full max-w-2xl max-h-[80vh]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={togglePause}
        onMouseLeave={togglePause}
      >
        {/* Progress Bar */}
        <StoryProgress 
          currentIndex={selectedStoryIndex}
          onProgressComplete={onNextStory}
          isPaused={isPaused}
        />
        
        {/* Story Content */}
        <StoryContent story={selectedStory} />
        
        {/* Controls */}
        <StoryControls 
          username={selectedGroup?.username || ""}
          avatarUrl={selectedGroup?.avatarUrl || ""}
          createdAt={selectedStory.createdAt}
          onClose={onClose}
          onToggleViewers={toggleViewers}
          onToggleReactions={toggleReactions}
          onToggleReactionPicker={toggleReactionPicker}
          onPrevStory={onPrevStory}
          onNextStory={onNextStory}
          canGoPrev={selectedGroupIndex > 0 || selectedStoryIndex > 0}
          canGoNext={selectedGroupIndex < groupedStories.length - 1 || selectedStoryIndex < (selectedGroup?.stories.length || 0) - 1}
        />
        
        {/* Reply Section */}
        <StoryReply onReply={handleReply} />
        
        {/* Viewers List */}
        <AnimatePresence>
          {showViewers && (
            <StoryViewers story={selectedStory} />
          )}
        </AnimatePresence>
        
        {/* Reactions List */}
        <AnimatePresence>
          {showReactions && (
            <StoryReactions story={selectedStory} />
          )}
        </AnimatePresence>
        
        {/* Reaction Picker */}
        <AnimatePresence>
          {showReactionPicker && (
            <StoryReactionPicker onReactionSelect={handleReaction} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default StoryModal; 