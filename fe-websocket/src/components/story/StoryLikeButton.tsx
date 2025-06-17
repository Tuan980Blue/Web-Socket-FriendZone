import React, { useState } from 'react';
import { useStoryLikes } from '@/hooks/useStories';
import { motion } from 'framer-motion';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';

interface StoryLikeButtonProps {
  storyId: string;
  isLiked: boolean;
  likeCount: number;
  onLikeChange?: (isLiked: boolean) => void;
}

const StoryLikeButton: React.FC<StoryLikeButtonProps> = ({
  storyId,
  isLiked,
  likeCount,
  onLikeChange
}) => {
  const { likeStory, unlikeStory, isLikingStory, isUnlikingStory } = useStoryLikes(storyId);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const [error, setError] = useState<string | null>(null);

  // Update local state when props change
  React.useEffect(() => {
    setLocalIsLiked(isLiked);
    setLocalLikeCount(likeCount);
  }, [isLiked, likeCount]);

  const handleLikeToggle = async () => {
    try {
      setError(null);
      
      if (localIsLiked) {
        // Optimistic update for unlike
        setLocalIsLiked(false);
        setLocalLikeCount(prev => Math.max(0, prev - 1));
        
        await unlikeStory(storyId);
        onLikeChange?.(false);
      } else {
        // Optimistic update for like
        setLocalIsLiked(true);
        setLocalLikeCount(prev => prev + 1);
        
        await likeStory(storyId);
        onLikeChange?.(true);
      }
    } catch (error) {
      // Revert optimistic update on error
      setLocalIsLiked(isLiked);
      setLocalLikeCount(likeCount);
      setError('Failed to update like. Please try again.');
      
      console.error('Error toggling like:', error);
    }
  };

  const isLoading = isLikingStory || isUnlikingStory;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleLikeToggle}
        disabled={isLoading}
        className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        title={localIsLiked ? 'Unlike story' : 'Like story'}
        aria-label={localIsLiked ? 'Unlike story' : 'Like story'}
        aria-pressed={localIsLiked}
      >
        {localIsLiked ? (
          <IconHeartFilled className="w-6 h-6 text-red-500" />
        ) : (
          <IconHeart className="w-6 h-6" />
        )}
        {localLikeCount > 0 && (
          <span className="text-sm font-medium">{localLikeCount}</span>
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