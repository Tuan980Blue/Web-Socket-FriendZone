import React, { useState, useMemo } from 'react';
import { useStoryLikes } from '@/hooks/useStories';
import { motion, AnimatePresence } from 'framer-motion';
import { IconHeart, IconX, IconClock } from '@tabler/icons-react';
import { StoryLike } from '@/types/story';

interface StoryLikeStatsProps {
  storyId: string;
  likeCount: number;
}

const StoryLikeStats: React.FC<StoryLikeStatsProps> = ({ storyId, likeCount }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { likesData, loading, error } = useStoryLikes(storyId);

  const handleLikeStatsClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Memoize sorted likes by date
  const sortedLikes = useMemo(() => {
    if (!likesData?.likes) return [];
    return [...likesData.likes].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [likesData?.likes]);

  // Group likes by date
  const groupedLikes = useMemo(() => {
    const groups: { [key: string]: StoryLike[] } = {};
    
    sortedLikes.forEach(like => {
      const date = new Date(like.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(like);
    });
    
    return Object.entries(groups).sort(([a], [b]) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [sortedLikes]);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLikeStatsClick}
        className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors duration-200"
        title={`${likeCount} ${likeCount === 1 ? 'like' : 'likes'}`}
        aria-label={`View story likes - ${likeCount} ${likeCount === 1 ? 'like' : 'likes'}`}
      >
        <IconHeart className="w-5 h-5" />
        <span className="text-sm font-medium">{likeCount}</span>
      </motion.button>

      {/* Like Stats Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Story Likes
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  aria-label="Close modal"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-2 mb-4 text-gray-600 dark:text-gray-400">
                <IconHeart className="w-5 h-5" />
                <span className="text-sm">
                  {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                </span>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    Failed to load likes. Please try again.
                  </p>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                </div>
              ) : likesData?.likes && likesData.likes.length > 0 ? (
                <div className="space-y-3">
                  {groupedLikes.map(([date, likes]) => (
                    <div key={date} className="border-b border-gray-200 pb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <IconClock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">{date}</span>
                      </div>
                      <div className="space-y-2">
                        {likes.map((like) => (
                          <div key={like.id} className="flex items-center space-x-3">
                            <img
                              src={like.user.avatar || '/default-avatar.png'}
                              alt={like.user.username}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {like.user.fullName}
                              </p>
                              <p className="text-xs text-gray-500">
                                @{like.user.username}
                              </p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(like.createdAt)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No likes yet</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StoryLikeStats; 