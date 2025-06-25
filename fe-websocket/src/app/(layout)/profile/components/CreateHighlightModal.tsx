'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconPlus, IconCheck } from '@tabler/icons-react';
import Image from 'next/image';
import { Story, CreateHighlightData } from '@/types/story';
import { storyService } from '@/services/storyService';
import { notifications } from '@mantine/notifications';

interface CreateHighlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  onHighlightCreated: () => void;
}

export default function CreateHighlightModal({
  isOpen,
  onClose,
  stories,
  onHighlightCreated,
}: CreateHighlightModalProps) {
  const [highlightName, setHighlightName] = useState('');
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHighlightName('');
      setSelectedStories([]);
      setCoverImage('');
      setIsCreating(false);
    }
  }, [isOpen]);

  const handleStoryToggle = (storyId: string) => {
    setSelectedStories(prev => {
      const newSelectedStories = prev.includes(storyId)
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId];
      
      // Auto-set cover image to first selected story if no cover image is manually selected
      if (newSelectedStories.length > 0) {
        const firstStory = stories.find(s => s.id === newSelectedStories[0]);
        if (firstStory && (!coverImage || !newSelectedStories.some(id => {
          const story = stories.find(s => s.id === id);
          return story && story.mediaUrl === coverImage;
        }))) {
          setCoverImage(firstStory.mediaUrl);
        }
      } else {
        // Clear cover image if no stories are selected
        setCoverImage('');
      }
      
      return newSelectedStories;
    });
  };

  const handleCreateHighlight = async () => {
    if (!highlightName.trim() || selectedStories.length === 0) {
      notifications.show({
        title: 'Lỗi',
        message: 'Vui lòng nhập tên highlight và chọn ít nhất 1 story',
        color: 'red',
      });
      return;
    }

    setIsCreating(true);
    try {
      const createData: CreateHighlightData = {
        name: highlightName.trim(),
        coverImage: coverImage || selectedStories[0] || '/image-person.png',
        storyIds: selectedStories,
      };

      await storyService.createHighlight(createData);
      
      notifications.show({
        title: 'Thành công',
        message: 'Highlight đã được tạo!',
        color: 'green',
      });
      
      onHighlightCreated();
      onClose();
    } catch (error) {
      console.error('Error creating highlight:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCoverImageSelect = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (story) {
      setCoverImage(story.mediaUrl);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Tạo Highlight mới
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <IconX size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Highlight Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên Highlight
                </label>
                <input
                  type="text"
                  value={highlightName}
                  onChange={(e) => setHighlightName(e.target.value)}
                  placeholder="Nhập tên highlight..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  maxLength={30}
                />
              </div>

              {/* Cover Image Selection */}
              {selectedStories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ảnh bìa
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedStories.map((storyId) => {
                      const story = stories.find(s => s.id === storyId);
                      if (!story) return null;
                      
                      const isSelected = coverImage === story.mediaUrl;
                      return (
                        <div
                          key={storyId}
                          className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                            isSelected ? 'border-blue-500' : 'border-gray-200 dark:border-gray-600'
                          }`}
                          onClick={() => handleCoverImageSelect(storyId)}
                        >
                          <Image
                            src={story.mediaUrl}
                            alt="Story"
                            fill
                            className="object-cover"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                              <IconCheck size={16} className="text-white" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stories Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chọn Stories ({selectedStories.length} đã chọn)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {stories.map((story) => {
                    const isSelected = selectedStories.includes(story.id);
                    return (
                      <div
                        key={story.id}
                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          isSelected 
                            ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                        onClick={() => handleStoryToggle(story.id)}
                      >
                        <Image
                          src={story.mediaUrl}
                          alt="Story"
                          fill
                          className="object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                            <IconCheck size={20} className="text-white" />
                          </div>
                        )}
                        <div className="absolute top-1 right-1">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                          }`}>
                            {isSelected && <IconCheck size={10} className="text-white" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                disabled={isCreating}
              >
                Hủy
              </button>
              <button
                onClick={handleCreateHighlight}
                disabled={isCreating || !highlightName.trim() || selectedStories.length === 0}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang tạo...</span>
                  </>
                ) : (
                  <>
                    <IconPlus size={16} />
                    <span>Tạo Highlight</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 