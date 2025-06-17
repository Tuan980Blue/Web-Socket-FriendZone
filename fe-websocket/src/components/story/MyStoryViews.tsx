import React, { useState } from 'react';
import { useMyStoryViews } from '@/hooks/useStories';
import { motion, AnimatePresence } from 'framer-motion';
import { IconEye, IconUsers, IconX, IconChartBar } from '@tabler/icons-react';
import { MyStoryView } from '@/types/story';

const MyStoryViews: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { myStoryViews, loading } = useMyStoryViews();

  const handleViewStatsClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const totalViews = myStoryViews.reduce((sum, story) => sum + story.viewCount, 0);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleViewStatsClick}
        className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors duration-200"
      >
        <IconChartBar className="w-5 h-5" />
        <span className="text-sm font-medium">{totalViews}</span>
      </motion.button>

      {/* My Story Views Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  My Story Views
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-2 mb-4 text-gray-600 dark:text-gray-400">
                <IconUsers className="w-5 h-5" />
                <span className="text-sm">
                  {totalViews} total views across {myStoryViews.length} stories
                </span>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : myStoryViews.length > 0 ? (
                <div className="space-y-4">
                  {myStoryViews.map((story: MyStoryView) => (
                    <div
                      key={story.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={story.mediaUrl}
                          alt="story"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {story.mediaType.toLowerCase()}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(story.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <IconEye className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">{story.viewCount}</span>
                        </div>
                      </div>

                      {story.views && story.views.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Recent viewers:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {story.views.slice(0, 5).map((view) => (
                              <div
                                key={view.id}
                                className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-full px-3 py-1"
                              >
                                <img
                                  src={view.user.avatar || '/default-avatar.png'}
                                  alt={view.user.username}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="text-xs text-gray-700 dark:text-gray-300">
                                  {view.user.username}
                                </span>
                              </div>
                            ))}
                            {story.views.length > 5 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{story.views.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <IconChartBar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No stories with views yet</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MyStoryViews; 