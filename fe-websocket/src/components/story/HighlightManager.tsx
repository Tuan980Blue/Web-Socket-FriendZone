import React, { useState } from 'react';
import { useHighlights } from '@/hooks/useStories';
import { motion, AnimatePresence } from 'framer-motion';
import { IconBookmark, IconPlus, IconX, IconTrash, IconEdit } from '@tabler/icons-react';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddStoriesModalOpen, setIsAddStoriesModalOpen] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null);
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [highlightName, setHighlightName] = useState('');

  const { 
    highlights, 
    createHighlight, 
    deleteHighlight, 
    addStoriesToHighlight,
    updateHighlight,
    isCreatingHighlight, 
    isDeletingHighlight,
    isAddingStoriesToHighlight,
    isUpdatingHighlight
  } = useHighlights(userId);

  const isOwnProfile = currentUser?.id === userId;

  const handleCreateHighlight = async () => {
    if (!highlightName.trim() || selectedStories.length === 0) return;

    try {
      await createHighlight({
        name: highlightName,
        coverImage: '',
        storyIds: selectedStories,
      });
      
      setHighlightName('');
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

  const handleUpdateHighlight = async () => {
    if (!selectedHighlight || (!highlightName.trim() )) return;

    try {
      const updateData: { name?: string; coverImage?: string } = {};
      if (highlightName.trim()) updateData.name = highlightName;

      await updateHighlight({
        highlightId: selectedHighlight.id,
        data: updateData,
      });
      
      setHighlightName('');
      setSelectedHighlight(null);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating highlight:', error);
    }
  };

  const handleAddStoriesToHighlight = async () => {
    if (!selectedHighlight || selectedStories.length === 0) return;

    try {
      await addStoriesToHighlight({
        highlightId: selectedHighlight.id,
        storyIds: selectedStories,
      });
      
      setSelectedStories([]);
      setSelectedHighlight(null);
      setIsAddStoriesModalOpen(false);
    } catch (error) {
      console.error('Error adding stories to highlight:', error);
    }
  };

  const toggleStorySelection = (storyId: string) => {
    setSelectedStories(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  };

  const openEditModal = (highlight: Highlight) => {
    setSelectedHighlight(highlight);
    setHighlightName(highlight.name);
    setIsEditModalOpen(true);
  };

  const openAddStoriesModal = (highlight: Highlight) => {
    setSelectedHighlight(highlight);
    setSelectedStories([]);
    setIsAddStoriesModalOpen(true);
  };

  // Get stories that are not in any highlight
  const availableStories = stories.filter(story => !story.isHighlighted);

  return (
    <>
      {/* Main Highlights Modal */}
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
                        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openEditModal(highlight)}
                            disabled={isUpdatingHighlight}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full"
                          >
                            <IconEdit className="w-3 h-3" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openAddStoriesModal(highlight)}
                            disabled={isAddingStoriesToHighlight}
                            className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-full"
                          >
                            <IconPlus className="w-3 h-3" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteHighlight(highlight.id)}
                            disabled={isDeletingHighlight}
                            className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                          >
                            <IconTrash className="w-3 h-3" />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <IconBookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No highlights yet</p>
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="mt-4 text-blue-500 hover:text-blue-600"
                    >
                      Create your first highlight
                    </button>
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
                    Select Stories ({selectedStories.length} selected)
                  </label>
                  {availableStories.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                      {availableStories.map((story) => (
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
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No available stories to add
                    </p>
                  )}
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

      {/* Edit Highlight Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedHighlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsEditModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Highlight
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
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

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateHighlight}
                    disabled={(!highlightName.trim()) || isUpdatingHighlight}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg disabled:cursor-not-allowed"
                  >
                    {isUpdatingHighlight ? 'Updating...' : 'Update Highlight'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Stories to Highlight Modal */}
      <AnimatePresence>
        {isAddStoriesModalOpen && selectedHighlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsAddStoriesModalOpen(false)}
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
                  Add Stories to &quot;{selectedHighlight.name}&quot;
                </h3>
                <button
                  onClick={() => setIsAddStoriesModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Stories ({selectedStories.length} selected)
                  </label>
                  {availableStories.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                      {availableStories.map((story) => (
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
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No available stories to add
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={() => setIsAddStoriesModalOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddStoriesToHighlight}
                    disabled={selectedStories.length === 0 || isAddingStoriesToHighlight}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg disabled:cursor-not-allowed"
                  >
                    {isAddingStoriesToHighlight ? 'Adding...' : 'Add Stories'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
      >
        <IconBookmark className="w-5 h-5" />
        <span>Highlights ({highlights.length})</span>
      </button>
    </>
  );
};

export default HighlightManager; 