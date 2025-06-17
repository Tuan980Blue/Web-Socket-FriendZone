import React, { useState, useMemo } from 'react';
import { useStoryViews } from '@/hooks/useStories';
import { motion, AnimatePresence } from 'framer-motion';
import { IconEye, IconUsers, IconX, IconClock } from '@tabler/icons-react';
import { StoryView } from '@/types/story';

interface StoryViewStatsProps {
  storyId: string;
  viewCount: number;
}

const StoryViewStats: React.FC<StoryViewStatsProps> = ({ storyId, viewCount }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { viewsData, loading, error } = useStoryViews(storyId);

  const handleViewStatsClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Memoize sorted views by date
  const sortedViews = useMemo(() => {
    if (!viewsData?.views) return [];
    return [...viewsData.views].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [viewsData?.views]);

  // Group views by date
  const groupedViews = useMemo(() => {
    const groups: { [key: string]: StoryView[] } = {};
    
    sortedViews.forEach(view => {
      const date = new Date(view.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(view);
    });
    
    return Object.entries(groups).sort(([a], [b]) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [sortedViews]);

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
        onClick={handleViewStatsClick}
        className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors duration-200"
        title={`${viewCount} ${viewCount === 1 ? 'view' : 'views'}`}
        aria-label={`View story statistics - ${viewCount} ${viewCount === 1 ? 'view' : 'views'}`}
      >
        <IconEye className="w-5 h-5" />
        <span className="text-sm font-medium">{viewCount}</span>
      </motion.button>

      {/* View Stats Modal */}
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
                  Story Views
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
                <IconUsers className="w-5 h-5" />
                <span className="text-sm">
                  {viewCount} {viewCount === 1 ? 'view' : 'views'}
                </span>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    Failed to load view statistics. Please try again.
                  </p>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : sortedViews.length > 0 ? (
                <div className="space-y-4">
                  {groupedViews.map(([date, views]) => (
                    <div key={date} className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm">
                        <IconClock className="w-4 h-4" />
                        <span className="font-medium">{date}</span>
                        <span>({views.length} {views.length === 1 ? 'view' : 'views'})</span>
                      </div>
                      
                      <div className="space-y-2">
                        {views.map((view: StoryView) => (
                          <motion.div
                            key={view.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <div className="relative">
                              <img
                                src={view.user.avatar || '/default-avatar.png'}
                                alt={view.user.username}
                                className="w-10 h-10 rounded-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/default-avatar.png';
                                }}
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {view.user.fullName}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                @{view.user.username}
                              </p>
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                              {formatTimeAgo(view.createdAt)}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <IconEye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No views yet</p>
                  <p className="text-sm mt-1">When people view your story, they will appear here</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StoryViewStats; 