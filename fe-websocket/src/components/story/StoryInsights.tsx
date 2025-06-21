import React, { useState, useMemo } from 'react';
import { useStoryViews, useStoryLikes } from '@/hooks/useStories';
import { motion, AnimatePresence } from 'framer-motion';
import { IconEye, IconHeart, IconUsers, IconX, IconClock } from '@tabler/icons-react';
import { StoryView, StoryLike } from '@/types/story';

interface StoryInsightsProps {
  storyId: string;
  viewCount: number;
  likeCount: number;
}

type InsightItem = {
  id: string;
  type: 'view' | 'like';
  user: {
    id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  timestamp: string;
  createdAt: string;
};

const StoryInsights: React.FC<StoryInsightsProps> = ({ storyId, viewCount, likeCount }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Only fetch data when modal is open
  const { viewsData, loading: viewsLoading, error: viewsError } = useStoryViews(storyId, {
    enabled: isModalOpen
  });
  const { likesData, loading: likesLoading, error: likesError } = useStoryLikes(storyId, {
    enabled: isModalOpen
  });

  const handleInsightsClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Correctly calculate total unique interactions
  const totalInteractions = useMemo(() => {
    if (!isModalOpen) return viewCount; // Use props when modal is closed
    const userIds = new Set<string>();
    if (viewsData?.views) {
      viewsData.views.forEach((view: StoryView) => userIds.add(view.user.id));
    }
    if (likesData?.likes) {
      likesData.likes.forEach((like: StoryLike) => userIds.add(like.user.id));
    }
    return userIds.size;
  }, [isModalOpen, viewsData, likesData, viewCount, likeCount]);

  // Combine views and likes into a single list, prioritizing likes over views
  const combinedInsights = useMemo((): InsightItem[] => {
    const insightsMap = new Map<string, InsightItem>();
    if (likesData?.likes) {
      likesData.likes.forEach((like: StoryLike) => {
        insightsMap.set(like.user.id, {
          id: `like-${like.id}`,
          type: 'like',
          user: like.user,
          timestamp: like.createdAt,
          createdAt: like.createdAt
        });
      });
    }
    if (viewsData?.views) {
      viewsData.views.forEach((view: StoryView) => {
        if (!insightsMap.has(view.user.id)) {
          insightsMap.set(view.user.id, {
            id: `view-${view.id}`,
            type: 'view',
            user: view.user,
            timestamp: view.createdAt,
            createdAt: view.createdAt
          });
        }
      });
    }
    return Array.from(insightsMap.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [viewsData?.views, likesData?.likes]);

  const isLoading = viewsLoading || likesLoading;
  const error = viewsError || likesError;

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleInsightsClick}
        className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors duration-200"
        title={`${viewCount} views, ${likeCount} likes`}
        aria-label={`View story insights - ${viewCount} views, ${likeCount} likes`}
      >
        <IconUsers className="w-5 h-5" />
        <span className="text-sm font-medium">{totalInteractions}</span>
      </motion.button>

      {/* Insights Modal */}
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
                  Story Insights
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  aria-label="Close modal"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              {/* Stats Summary */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <IconEye className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">{viewCount}</span>
                    <span className="text-xs text-gray-500">views</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <IconHeart className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">{likeCount}</span>
                    <span className="text-xs text-gray-500">likes</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {isLoading ? '...' : `${totalInteractions} total interactions`}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    Failed to load insights. Please try again.
                  </p>
                </div>
              )}

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : combinedInsights.length > 0 ? (
                <div className="space-y-3">
                  {(() => {
                    // Group by date for display
                    const groups: { [key: string]: InsightItem[] } = {};
                    combinedInsights.forEach(insight => {
                      const date = new Date(insight.timestamp).toLocaleDateString();
                      if (!groups[date]) groups[date] = [];
                      groups[date].push(insight);
                    });
                    return Object.entries(groups).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime()).map(([date, insights]) => (
                      <div key={date} className="border-b border-gray-200 pb-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <IconClock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">{date}</span>
                        </div>
                        <div className="space-y-2">
                          {insights.map((insight) => (
                            <div key={insight.id} className="flex items-center space-x-3">
                              <img
                                src={insight.user.avatar || '/default-avatar.png'}
                                alt={insight.user.username}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {insight.user.fullName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  @{insight.user.username}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {insight.type === 'view' ? (
                                  <IconEye className="w-4 h-4 text-blue-500" />
                                ) : (
                                  <IconHeart className="w-4 h-4 text-red-500" />
                                )}
                                <span className="text-xs text-gray-500">
                                  {(() => {
                                    const now = new Date();
                                    const date = new Date(insight.timestamp);
                                    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
                                    if (diffInMinutes < 1) return 'Just now';
                                    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
                                    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
                                    return `${Math.floor(diffInMinutes / 1440)}d ago`;
                                  })()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No interactions yet</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StoryInsights; 