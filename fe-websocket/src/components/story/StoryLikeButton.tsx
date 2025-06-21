import React, { useState } from 'react';
import { useStoryLikeMutations } from '@/hooks/useStories';
import { motion } from 'framer-motion';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';

interface StoryLikeButtonProps {
  storyId: string;
  isLiked: boolean;
  likeCount: number;
  onLikeChange?: (isLiked: boolean) => void;
  isOwnStory?: boolean;
}

const StoryLikeButton: React.FC<StoryLikeButtonProps> = ({
  storyId,
  isLiked,
  likeCount,
  onLikeChange,
  isOwnStory = false
}) => {
  // Use mutations only, no API calls
  const { likeStory, unlikeStory, isLikingStory, isUnlikingStory } = useStoryLikeMutations(storyId);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [error, setError] = useState<string | null>(null);

  // Update local state when props change
  React.useEffect(() => {
    setLocalIsLiked(isLiked);
  }, [isLiked, likeCount]);

  const handleLikeToggle = async () => {
    // Prevent like/unlike for own stories
    if (isOwnStory) {
      setError('You cannot like your own story');
      return;
    }

    try {
      setError(null);
      
      if (localIsLiked) {
        // Optimistic update for unlike
        setLocalIsLiked(false);
        
        await unlikeStory(storyId);
        onLikeChange?.(false);
      } else {
        // Optimistic update for like
        setLocalIsLiked(true);
        
        await likeStory(storyId);
        onLikeChange?.(true);
      }
    } catch (error) {
      // Revert optimistic update on error
      setLocalIsLiked(isLiked);
      setError('Failed to update like. Please try again.');
      
      console.error('Error toggling like:', error);
    }
  };

  const isLoading = isLikingStory || isUnlikingStory;

  return (
    <div className="relative">
      <motion.button
        whileHover={!isOwnStory ? { scale: 1.1 } : {}}
        whileTap={!isOwnStory ? { scale: 0.9 } : {}}
        onClick={handleLikeToggle}
        disabled={isLoading || isOwnStory}
        className={`flex items-center space-x-2 transition-colors duration-200 ${
          isOwnStory 
            ? 'text-gray-400 cursor-not-allowed opacity-50' 
            : 'text-white hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
        title={isOwnStory ? 'You cannot like your own story' : (localIsLiked ? 'Unlike story' : 'Like story')}
        aria-label={isOwnStory ? 'You cannot like your own story' : (localIsLiked ? 'Unlike story' : 'Like story')}
        aria-pressed={localIsLiked}
      >
        {localIsLiked ? (
          <IconHeartFilled className="w-6 h-6 text-red-500" />
        ) : (
          <IconHeart className="w-6 h-6" />
        )}
      </motion.button>
      
      {/* Error Tooltip */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-red-500 text-white text-xs rounded-lg whitespace-nowrap z-10"
        >
          {error}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
        </motion.div>
      )}
    </div>
  );
};

export default StoryLikeButton; 