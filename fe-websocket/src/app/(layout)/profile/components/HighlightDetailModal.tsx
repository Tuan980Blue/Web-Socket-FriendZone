'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconEdit, IconTrash, IconPlus, IconMinus, IconCheck, IconEye } from '@tabler/icons-react';
import Image from 'next/image';
import { Highlight, Story } from '@/types/story';
import { storyService } from '@/services/storyService';
import { notifications } from '@mantine/notifications';

interface HighlightDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlight: Highlight | null;
  isCurrentUser: boolean;
  availableStories: Story[];
  onHighlightUpdated: () => void;
}

export default function HighlightDetailModal({
  isOpen,
  onClose,
  highlight,
  isCurrentUser,
  availableStories,
  onHighlightUpdated,
}: HighlightDetailModalProps) {
  const [currentHighlight, setCurrentHighlight] = useState<Highlight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCoverImage, setEditCoverImage] = useState('');
  const [isAddingStories, setIsAddingStories] = useState(false);
  const [selectedStoriesToAdd, setSelectedStoriesToAdd] = useState<string[]>([]);
  const [isRemovingStories, setIsRemovingStories] = useState(false);
  const [selectedStoriesToRemove, setSelectedStoriesToRemove] = useState<string[]>([]);

  useEffect(() => {
    if (highlight && isOpen) {
      setCurrentHighlight(highlight);
      setEditName(highlight.name);
      setEditCoverImage(highlight.coverImage);
      setIsEditing(false);
      setIsAddingStories(false);
      setIsRemovingStories(false);
      setSelectedStoriesToAdd([]);
      setSelectedStoriesToRemove([]);
    }
  }, [highlight, isOpen]);

  const handleEditHighlight = async () => {
    if (!currentHighlight || !editName.trim()) return;

    setIsLoading(true);
    try {
      const updatedHighlight = await storyService.updateHighlight(currentHighlight.id, {
        name: editName.trim(),
        coverImage: editCoverImage,
      });
      
      setCurrentHighlight(updatedHighlight);
      setIsEditing(false);
      onHighlightUpdated();
      
      notifications.show({
        title: 'Thành công',
        message: 'Highlight đã được cập nhật!',
        color: 'green',
      });
    } catch (error) {
      console.error('Error updating highlight:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHighlight = async () => {
    if (!currentHighlight) return;

    if (!confirm('Bạn có chắc chắn muốn xóa highlight này?')) return;

    setIsLoading(true);
    try {
      await storyService.deleteHighlight(currentHighlight.id);
      onHighlightUpdated();
      onClose();
      
      notifications.show({
        title: 'Thành công',
        message: 'Highlight đã được xóa!',
        color: 'green',
      });
    } catch (error) {
      console.error('Error deleting highlight:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStories = async () => {
    if (!currentHighlight || selectedStoriesToAdd.length === 0) return;

    setIsLoading(true);
    try {
      const updatedHighlight = await storyService.addStoriesToHighlight(
        currentHighlight.id,
        selectedStoriesToAdd
      );
      
      setCurrentHighlight(updatedHighlight);
      setIsAddingStories(false);
      setSelectedStoriesToAdd([]);
      onHighlightUpdated();
      
      notifications.show({
        title: 'Thành công',
        message: 'Stories đã được thêm vào highlight!',
        color: 'green',
      });
    } catch (error) {
      console.error('Error adding stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStories = async () => {
    if (!currentHighlight || selectedStoriesToRemove.length === 0) return;

    setIsLoading(true);
    try {
      const updatedHighlight = await storyService.removeStoriesFromHighlight(
        currentHighlight.id,
        selectedStoriesToRemove
      );
      
      setCurrentHighlight(updatedHighlight);
      setIsRemovingStories(false);
      setSelectedStoriesToRemove([]);
      onHighlightUpdated();
      
      notifications.show({
        title: 'Thành công',
        message: 'Stories đã được xóa khỏi highlight!',
        color: 'green',
      });
    } catch (error) {
      console.error('Error removing stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoryToggle = (storyId: string, isAdd: boolean) => {
    if (isAdd) {
      setSelectedStoriesToAdd(prev => {
        if (prev.includes(storyId)) {
          return prev.filter(id => id !== storyId);
        } else {
          return [...prev, storyId];
        }
      });
    } else {
      setSelectedStoriesToRemove(prev => {
        if (prev.includes(storyId)) {
          return prev.filter(id => id !== storyId);
        } else {
          return [...prev, storyId];
        }
      });
    }
  };

  const handleCoverImageSelect = (storyId: string) => {
    const story = currentHighlight?.stories.find(s => s.id === storyId);
    if (story) {
      setEditCoverImage(story.mediaUrl);
    }
  };

  if (!currentHighlight) return null;

  // Get stories that are not in the highlight
  const storiesNotInHighlight = availableStories.filter(
    story => !currentHighlight.stories.some(hs => hs.id === story.id)
  );

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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={currentHighlight.coverImage || '/image-person.png'}
                    alt={currentHighlight.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-xl font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:text-white"
                      maxLength={30}
                    />
                  ) : (
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {currentHighlight.name}
                    </h2>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {currentHighlight.stories.length} stories
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {isCurrentUser && !isEditing && !isAddingStories && !isRemovingStories && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      title="Chỉnh sửa highlight"
                    >
                      <IconEdit size={18} className="text-gray-500 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={handleDeleteHighlight}
                      disabled={isLoading}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors"
                      title="Xóa highlight"
                    >
                      <IconTrash size={18} className="text-red-500" />
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <IconX size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Edit Mode */}
              {isEditing && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ảnh bìa
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {currentHighlight.stories.map((story) => {
                        const isSelected = editCoverImage === story.mediaUrl;
                        return (
                          <div
                            key={story.id}
                            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                              isSelected ? 'border-blue-500' : 'border-gray-200 dark:border-gray-600'
                            }`}
                            onClick={() => handleCoverImageSelect(story.id)}
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
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleEditHighlight}
                      disabled={isLoading || !editName.trim()}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </div>
              )}

              {/* Add Stories Mode */}
              {isAddingStories && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Thêm stories vào highlight
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {storiesNotInHighlight.map((story) => {
                      const isSelected = selectedStoriesToAdd.includes(story.id);
                      return (
                        <div
                          key={story.id}
                          className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                            isSelected 
                              ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                          onClick={() => handleStoryToggle(story.id, true)}
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
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setIsAddingStories(false);
                        setSelectedStoriesToAdd([]);
                      }}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleAddStories}
                      disabled={isLoading || selectedStoriesToAdd.length === 0}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? 'Đang thêm...' : `Thêm ${selectedStoriesToAdd.length} stories`}
                    </button>
                  </div>
                </div>
              )}

              {/* Remove Stories Mode */}
              {isRemovingStories && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Xóa stories khỏi highlight
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {currentHighlight.stories.map((story) => {
                      const isSelected = selectedStoriesToRemove.includes(story.id);
                      return (
                        <div
                          key={story.id}
                          className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                            isSelected 
                              ? 'border-red-500 ring-2 ring-red-200 dark:ring-red-800' 
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                          onClick={() => handleStoryToggle(story.id, false)}
                        >
                          <Image
                            src={story.mediaUrl}
                            alt="Story"
                            fill
                            className="object-cover"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                              <IconMinus size={20} className="text-white" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setIsRemovingStories(false);
                        setSelectedStoriesToRemove([]);
                      }}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleRemoveStories}
                      disabled={isLoading || selectedStoriesToRemove.length === 0}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? 'Đang xóa...' : `Xóa ${selectedStoriesToRemove.length} stories`}
                    </button>
                  </div>
                </div>
              )}

              {/* View Mode */}
              {!isEditing && !isAddingStories && !isRemovingStories && (
                <div className="space-y-4">
                  {/* Stories Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {currentHighlight.stories.map((story) => (
                      <div
                        key={story.id}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600"
                      >
                        <Image
                          src={story.mediaUrl}
                          alt="Story"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                          <IconEye size={20} className="text-white opacity-0 hover:opacity-100" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons for Current User */}
                  {isCurrentUser && (
                    <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {storiesNotInHighlight.length > 0 && (
                        <button
                          onClick={() => setIsAddingStories(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <IconPlus size={16} />
                          <span>Thêm Stories</span>
                        </button>
                      )}
                      {currentHighlight.stories.length > 0 && (
                        <button
                          onClick={() => setIsRemovingStories(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <IconMinus size={16} />
                          <span>Xóa Stories</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 