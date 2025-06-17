import React, { useState } from 'react';
import { useHighlights } from '@/hooks/useStories';
import { motion, AnimatePresence } from 'framer-motion';
import { IconBookmark, IconPlus, IconX, IconTrash } from '@tabler/icons-react';
import { Highlight, Story } from '@/types/story';
import { User } from '@/types/user';

interface HighlightManagerProps {
  userId: string;
  currentUser: User | null;
  stories: Story[];
}

const HighlightManager: React.FC<HighlightManagerProps> = ({
  userId,
  currentUser,
  stories
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [highlightName, setHighlightName] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const { highlights, createHighlight, deleteHighlight, isCreatingHighlight, isDeletingHighlight } = useHighlights(userId);

  const isOwnProfile = currentUser?.id === userId;

  const handleCreateHighlight = async () => {
    if (!highlightName.trim() || selectedStories.length === 0) return;

    try {
      await createHighlight({
        name: highlightName,
        coverImage: coverImage || selectedStories[0], // Use first story as cover if no cover provided
        storyIds: selectedStories,
      });
      
      setHighlightName('');
      setCoverImage('');
      setSelectedStories([]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating highlight:', error);
    }
  };

  const handleDeleteHighlight = async (highlightId: string) => {
    try {
      await deleteHighlight(highlightId);
    } catch (error) {
      console.error('Error deleting highlight:', error);
    }
  };

  const toggleStorySelection = (storyId: string) => {
    setSelectedStories(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors duration-200"
      >
        <IconBookmark className="w-5 h-5" />
        <span className="text-sm font-medium">{highlights.length}</span>
      </motion.button>

      {/* Highlights Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Highlights
                </h3>
                <div className="flex items-center space-x-2">
                  {isOwnProfile && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsCreateModalOpen(true)}
                      className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      <IconPlus className="w-4 h-4" />
                      <span>New</span>
                    </motion.button>
                  )}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <IconX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {highlights.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {highlights.map((highlight: Highlight) => (
                    <div
                      key={highlight.id}
                      className="relative group cursor-pointer"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img
                          src={highlight.coverImage}
                          alt={highlight.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                        <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <p className="font-medium text-sm">{highlight.name}</p>
                          <p className="text-xs">{highlight.stories.length} stories</p>
                        </div>
                      </div>
                      {isOwnProfile && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteHighlight(highlight.id)}
                          disabled={isDeletingHighlight}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <IconTrash className="w-3 h-3" />
                        </motion.button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <IconBookmark className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No highlights yet</p>
                  {isOwnProfile && (
                    <p className="text-sm mt-2">Create your first highlight!</p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Highlight Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsCreateModalOpen(false)}
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
                  Create Highlight
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Highlight Name
                  </label>
                  <input
                    type="text"
                    value={highlightName}
                    onChange={(e) => setHighlightName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter highlight name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Image URL (optional)
                  </label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter cover image URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Stories ({selectedStories.length} selected)
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                    {stories.map((story) => (
                      <div
                        key={story.id}
                        onClick={() => toggleStorySelection(story.id)}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          selectedStories.includes(story.id)
                            ? 'border-blue-500'
                            : 'border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <img
                          src={story.mediaUrl}
                          alt="story"
                          className="w-full h-20 object-cover"
                        />
                        {selectedStories.includes(story.id) && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                            <div className="bg-blue-500 text-white rounded-full p-1">
                              <IconPlus className="w-3 h-3" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateHighlight}
                    disabled={!highlightName.trim() || selectedStories.length === 0 || isCreatingHighlight}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg disabled:cursor-not-allowed"
                  >
                    {isCreatingHighlight ? 'Creating...' : 'Create Highlight'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HighlightManager; 