import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconTrash } from '@tabler/icons-react';
import { useStories } from '@/hooks/useStories';

interface DeleteStoryButtonProps {
  storyId: string;
  storyTitle?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'text';
  onDelete?: () => void;
  className?: string;
}

const DeleteStoryButton: React.FC<DeleteStoryButtonProps> = ({
  storyId,
  storyTitle = 'story',
  size = 'md',
  variant = 'icon',
  onDelete,
  className = ''
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { deleteStory, isDeletingStory } = useStories();

  const handleDelete = async () => {
    try {
      await deleteStory(storyId);
      setShowConfirm(false);
      onDelete?.();
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  const renderButton = () => {
    switch (variant) {
      case 'button':
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            className={`bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors ${className}`}
            title={`Delete ${storyTitle}`}
          >
            <IconTrash size={iconSizes[size]} className="inline mr-1" />
            Delete
          </button>
        );
      
      case 'text':
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            className={`text-red-500 hover:text-red-600 text-sm font-medium transition-colors ${className}`}
            title={`Delete ${storyTitle}`}
          >
            Delete
          </button>
        );
      
      default: // icon
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            className={`bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors ${sizeClasses[size]} ${className}`}
            title={`Delete ${storyTitle}`}
          >
            <IconTrash size={iconSizes[size]} />
          </button>
        );
    }
  };

  return (
    <>
      {renderButton()}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <IconTrash size={24} className="text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Delete {storyTitle}?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This action cannot be undone. The {storyTitle} will be permanently deleted.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeletingStory}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg transition-colors"
                  >
                    {isDeletingStory ? 'Deleting...' : 'Delete'}
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

export default DeleteStoryButton; 