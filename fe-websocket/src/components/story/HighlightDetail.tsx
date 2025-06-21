import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconTrash, IconEye } from '@tabler/icons-react';
import { Highlight, Story } from '@/types/story';
import { useHighlights } from '@/hooks/useStories';

interface HighlightDetailProps {
  highlight: Highlight;
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

const HighlightDetail: React.FC<HighlightDetailProps> = ({
  highlight,
  isOpen,
  onClose,
  currentUserId
}) => {
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const { removeStoriesFromHighlight, isRemovingStoriesFromHighlight } = useHighlights(highlight.authorId);

  const isOwnHighlight = currentUserId === highlight.authorId;

  const handleRemoveStories = async () => {
    if (selectedStories.length === 0) return;

    try {
      await removeStoriesFromHighlight({
        highlightId: highlight.id,
        storyIds: selectedStories,
      });
      setSelectedStories([]);
    } catch (error) {
      console.error('Error removing stories from highlight:', error);
    }
  };

  const toggleStorySelection = (storyId: string) => {
    setSelectedStories(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  };

  const viewStory = (story: Story) => {
    // Implement story viewer logic here
    console.log('View story:', story);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <img
                    src={highlight.coverImage}
                    alt={highlight.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {highlight.name}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {highlight.stories.length} stories • Created by {highlight.author.fullName}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isOwnHighlight && selectedStories.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRemoveStories}
                    disabled={isRemovingStoriesFromHighlight}
                    className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    <IconTrash className="w-4 h-4" />
                    <span>Remove ({selectedStories.length})</span>
                  </motion.button>
                )}
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stories Grid */}
            {highlight.stories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {highlight.stories.map((story) => (
                  <div
                    key={story.id}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedStories.includes(story.id)
                        ? 'border-red-500'
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <img
                      src={story.mediaUrl}
                      alt="story"
                      className="w-full h-32 object-cover"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="text-xs">
                          {new Date(story.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => viewStory(story)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full"
                      >
                        <IconEye className="w-3 h-3" />
                      </motion.button>
                      
                      {isOwnHighlight && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleStorySelection(story.id)}
                          className={`p-1 rounded-full ${
                            selectedStories.includes(story.id)
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-gray-500 hover:bg-gray-600 text-white'
                          }`}
                        >
                          <IconTrash className="w-3 h-3" />
                        </motion.button>
                      )}
                    </div>

                    {/* Selection Indicator */}
                    {selectedStories.includes(story.id) && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-30 flex items-center justify-center">
                        <div className="bg-red-500 text-white rounded-full p-1">
                          <IconTrash className="w-3 h-3" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No stories in this highlight
                </p>
              </div>
            )}

            {/* Footer */}
            {isOwnHighlight && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedStories.length > 0 
                    ? `${selectedStories.length} stories selected for removal`
                    : 'Click on stories to select them for removal'
                  }
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HighlightDetail; 