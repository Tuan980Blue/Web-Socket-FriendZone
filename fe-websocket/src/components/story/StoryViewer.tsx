import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconX, IconMessage, IconShare, IconChevronLeft, IconChevronRight, IconPlayerPause, IconPlayerPlay, IconTrash } from '@tabler/icons-react';
import { Story } from '@/types/story';
import { User } from '@/types/user';
import StoryLikeButton from './StoryLikeButton';
import StoryInsights from './StoryInsights';
import HighlightManager from './HighlightManager';
import { useRecordStoryView, useStories } from '@/hooks/useStories';

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  currentUser?: User | null;
}

interface StoryAuthor {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
}

const STORY_DURATION = 5000; // 5 seconds per story
const PROGRESS_UPDATE_INTERVAL = 50; // Update progress every 50ms

const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialStoryIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
  currentUser
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [viewRecorded, setViewRecorded] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startTimeRef = useRef<number>(0);
  
  const { recordStoryView } = useRecordStoryView();
  const { deleteStory, isDeletingStory } = useStories();
  
  // Filter out invalid stories and ensure they have required properties
  const validStories = stories.filter((story): story is Story => 
    Boolean(story && 
    story.id && 
    story.authorId && 
    story.mediaUrl && 
    story.mediaType)
  );

  const currentStory = validStories[currentIndex];

  // Get author info with proper type safety
  const getAuthorInfo = useCallback((story: Story): StoryAuthor => {
    if (story.author) {
      return {
        id: story.author.id,
        username: story.author.username || 'Unknown',
        fullName: story.author.fullName || 'Unknown User',
        avatar: story.author.avatar
      };
    } else {
      // Fallback to current user info for own stories
      return {
        id: story.authorId,
        username: currentUser?.username || 'You',
        fullName: currentUser?.fullName || 'You',
        avatar: currentUser?.avatar
      };
    }
  }, [currentUser]);

  const currentAuthor = currentStory ? getAuthorInfo(currentStory) : null;
  const isOwnStory = currentUser?.id === currentStory?.authorId;

  // Record story view when story is opened (only for other users' stories)
  useEffect(() => {
    if (isOpen && currentStory && !viewRecorded && currentUser) {
      const isOwnStory = currentUser.id === currentStory.authorId;
      if (!isOwnStory) {
        recordStoryView(currentStory.id);
        setViewRecorded(true);
      }
    }
  }, [isOpen, currentStory, currentUser, recordStoryView, viewRecorded]);

  // Reset story state when story changes
  useEffect(() => {
    if (isOpen && currentStory) {
      setProgress(0);
      setIsLoading(true);
      setIsLiked(currentStory.isLikedByCurrentUser || false);
      setViewRecorded(false);
      setMediaError(false);
      setShowDeleteConfirm(false);
      startTimeRef.current = Date.now();
      startProgress();
    }
  }, [isOpen, currentIndex, currentStory]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  const startProgress = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    if (!isPaused && !mediaError) {
      startTimeRef.current = Date.now();
      progressInterval.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
        
        setProgress(newProgress);
        
        if (newProgress >= 100) {
          setTimeout(() => {
            handleNext();
          }, 100);
        }
      }, PROGRESS_UPDATE_INTERVAL);
    }
  }, [isPaused, mediaError]);

  const pauseProgress = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  const resumeProgress = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
    startProgress();
  }, [startProgress]);

  const handleNext = useCallback(() => {
    if (currentIndex < validStories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      onNext?.();
    } else {
      setTimeout(() => {
        onClose();
      }, 100);
    }
  }, [currentIndex, validStories.length, onNext, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      onPrev?.();
    }
  }, [currentIndex, onPrev]);

  const handleMediaLoad = useCallback(() => {
    setIsLoading(false);
    setMediaError(false);
  }, []);

  const handleMediaError = useCallback(() => {
    setIsLoading(false);
    setMediaError(true);
    // Auto skip to next story if media fails to load
    setTimeout(handleNext, 1000);
  }, [handleNext]);

  const handlePauseToggle = useCallback(() => {
    setIsPaused(!isPaused);
    if (isPaused) {
      resumeProgress();
    } else {
      pauseProgress();
    }
  }, [isPaused, resumeProgress, pauseProgress]);

  const handleLikeChange = useCallback((liked: boolean) => {
    setIsLiked(liked);
  }, []);

  // Handle story deletion
  const handleDeleteStory = useCallback(async () => {
    if (!currentStory) return;
    
    try {
      await deleteStory(currentStory.id);
      setShowDeleteConfirm(false);
      
      // If this was the last story, close the viewer
      if (validStories.length === 1) {
        onClose();
      } else {
        // Move to next story or previous story
        if (currentIndex < validStories.length - 1) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  }, [currentStory, deleteStory, validStories.length, currentIndex, handleNext, handlePrev, onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrev();
          break;
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          handleNext();
          break;
        case 'Escape':
          e.preventDefault();
          if (showDeleteConfirm) {
            setShowDeleteConfirm(false);
          } else {
            onClose();
          }
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          handlePauseToggle();
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          if (isOwnStory && !showDeleteConfirm) {
            setShowDeleteConfirm(true);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, handlePrev, handleNext, onClose, handlePauseToggle, isOwnStory, showDeleteConfirm]);

  if (!isOpen || !currentStory || !currentAuthor) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        onClick={handlePauseToggle}
      >
        {/* Progress Bars - One for each story */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="flex space-x-1">
            {validStories.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width: index < currentIndex ? '100%' : 
                           index === currentIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src={currentAuthor.avatar || '/default-avatar.png'}
                alt={currentAuthor.username}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/default-avatar.png';
                }}
              />
            </div>
            <div>
              <span className="text-white font-medium">{currentAuthor.username}</span>
              <div className="text-gray-300 text-xs">
                {new Date(currentStory.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePauseToggle}
              className="text-white hover:text-gray-300 p-2 transition-colors"
              title={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? <IconPlayerPlay size={20} /> : <IconPlayerPause size={20} />}
            </button>
            
            {/* Delete Button for own stories */}
            {isOwnStory && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                className="text-white hover:text-red-400 p-2 transition-colors"
                title="Delete story"
              >
                <IconTrash size={20} />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 p-2 transition-colors"
              title="Close"
            >
              <IconX size={20} />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20"
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
                    Delete Story?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    This action cannot be undone. The story will be permanently deleted.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteStory}
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

        {/* Story Content */}
        <div className="relative w-full h-full flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}
          
          {mediaError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-white text-center">
                <div className="text-2xl mb-2">⚠️</div>
                <p>Failed to load media</p>
                <p className="text-sm text-gray-400">Skipping to next story...</p>
              </div>
            </div>
          )}
          
          {currentStory.mediaType === 'IMAGE' ? (
            <img
              src={currentStory.mediaUrl}
              alt="story"
              className="max-w-full max-h-full object-contain"
              onLoad={handleMediaLoad}
              onError={handleMediaError}
            />
          ) : currentStory.mediaType === 'VIDEO' ? (
            <video
              ref={videoRef}
              src={currentStory.mediaUrl}
              autoPlay
              muted
              playsInline
              className="max-w-full max-h-full object-contain"
              onLoadedData={handleMediaLoad}
              onError={handleMediaError}
              onPlay={() => setIsPaused(false)}
              onPause={() => setIsPaused(true)}
            />
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center">
                <IconMessage size={48} className="text-white" />
              </div>
              <audio
                src={currentStory.mediaUrl}
                controls
                className="max-w-full"
                onLoadedData={handleMediaLoad}
                onError={handleMediaError}
              />
            </div>
          )}

          {/* Location Badge */}
          {currentStory.location && (
            <div className="absolute top-20 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              📍 {currentStory.location}
            </div>
          )}

          {/* Filter Badge */}
          {currentStory.filter && (
            <div className="absolute top-20 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              🎨 {currentStory.filter}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 w-12 h-12 flex items-center justify-center bg-black bg-opacity-30 rounded-full transition-colors"
            title="Previous story"
          >
            <IconChevronLeft size={32} />
          </button>
        )}
        
        {currentIndex < validStories.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 w-12 h-12 flex items-center justify-center bg-black bg-opacity-30 rounded-full transition-colors"
            title="Next story"
          >
            <IconChevronRight size={32} />
          </button>
        )}

        {/* Bottom Actions */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Send message..."
              className="flex-1 bg-transparent border border-gray-600 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Like Button - CHỈ hiển thị cho story của người khác */}
            {!isOwnStory && (
              <StoryLikeButton
                storyId={currentStory.id}
                isLiked={isLiked}
                likeCount={currentStory.likeCount || 0}
                onLikeChange={handleLikeChange}
                isOwnStory={isOwnStory}
              />
            )}
            
            {/* Story Insights Button - CHỈ cho chủ story */}
            {isOwnStory && (
              <StoryInsights
                storyId={currentStory.id}
                viewCount={currentStory.viewCount || 0}
                likeCount={currentStory.likeCount || 0}
              />
            )}
            
            {/* Highlights Button (only for own stories) */}
            {currentUser?.id === currentStory.authorId && (
              <HighlightManager
                userId={currentStory.authorId}
                currentUser={currentUser}
                stories={[currentStory]}
              />
            )}
            
            <button 
              className="text-white hover:text-gray-300 p-2 transition-colors"
              onClick={(e) => e.stopPropagation()}
              title="Reply"
            >
              <IconMessage size={24} />
            </button>
            <button 
              className="text-white hover:text-gray-300 p-2 transition-colors"
              onClick={(e) => e.stopPropagation()}
              title="Share"
            >
              <IconShare size={24} />
            </button>
          </div>
        </div>

        {/* Mentions and Hashtags */}
        {(currentStory.mentions?.length > 0 || currentStory.hashtags?.length > 0) && (
          <div className="absolute bottom-20 left-4 right-4 z-10">
            <div className="flex flex-wrap gap-2">
              {currentStory.mentions?.map((mention) => (
                <span key={mention.id} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                  @{mention.user.username}
                </span>
              ))}
              {currentStory.hashtags?.map((hashtag) => (
                <span key={hashtag.id} className="bg-purple-500 text-white px-2 py-1 rounded text-sm">
                  #{hashtag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default StoryViewer; 