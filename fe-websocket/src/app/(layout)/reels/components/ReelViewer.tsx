'use client';

import { useState, useRef, useEffect } from 'react';
import { Reel } from '@/types/reel';
import { useReelsData } from '@/hooks/useReelsData';
import { Avatar, Button, Text, ActionIcon, Paper, Textarea, Modal } from '@mantine/core';
import { Heart, MessageCircle, Share2, Bookmark, Volume2, VolumeX, Send, X } from 'lucide-react';

interface ReelViewerProps {
  reel: Reel;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function ReelViewer({ reel, onNext, onPrev }: ReelViewerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [comment, setComment] = useState('');
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { likeReel, saveReel, shareReel, addComment } = useReelsData();
  const isLargeScreen = window.innerWidth >= 1024;

  // Handle video playback
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Handle video play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle video end
  const handleVideoEnd = () => {
    if (onNext) {
      onNext();
    }
  };

  // Handle like
  const handleLike = () => {
    likeReel(reel.id);
  };

  // Handle save
  const handleSave = () => {
    saveReel(reel.id);
  };

  // Handle share
  const handleShare = () => {
    shareReel(reel.id);
  };

  // Handle comment
  const handleComment = () => {
    if (comment.trim()) {
      addComment(reel.id, comment);
      setComment('');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
  };

  // Format hashtags for display
  const formatHashtags = (caption: string) => {
    if (!caption) return '';
    
    return caption.split(' ').map((word, index) => {
      if (word.startsWith('#')) {
        return (
          <span key={index} className="text-blue-500 hover:underline cursor-pointer">
            {word}{' '}
          </span>
        );
      }
      return word + ' ';
    });
  };

  // Comments Section Component
  const CommentsSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Text color="white" fw={500}>Comments ({reel.comments})</Text>
        {!isLargeScreen && (
          <ActionIcon 
            variant="subtle" 
            color="white" 
            size="lg"
            onClick={() => setIsCommentModalOpen(false)}
          >
            <X size={20} />
          </ActionIcon>
        )}
      </div>
      
      {/* Comment Input */}
      <div className="flex items-center space-x-2 mb-4">
        <Textarea
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1"
          minRows={1}
          maxRows={3}
          styles={{
            input: {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
            },
          }}
        />
        <ActionIcon 
          variant="filled" 
          color="blue" 
          size="lg" 
          onClick={handleComment}
          disabled={!comment.trim()}
        >
          <Send size={16} />
        </ActionIcon>
      </div>
      
      {/* Comment List - Placeholder */}
      <div className="space-y-4">
        <Text color="white" size="sm" className="text-center opacity-70">
          No comments yet. Be the first to comment!
        </Text>
      </div>
    </div>
  );

  return (
    <div className="relative h-[80vh] w-full max-w-2xl mx-auto bg-black rounded-lg overflow-hidden">
      {/* Video Player */}
      <div className="relative h-full w-full">
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className="h-full w-full object-cover"
          loop
          playsInline
          autoPlay
          muted={isMuted}
          onClick={togglePlayPause}
          onEnded={handleVideoEnd}
        />
        
        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ActionIcon 
                variant="subtle" 
                color="white" 
                size="lg" 
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </ActionIcon>
              <Text color="white" size="sm">
                {isMuted ? 'Unmute' : 'Mute'}
              </Text>
            </div>
            
            <div className="flex items-center space-x-4">
              <ActionIcon 
                variant="subtle" 
                color="white" 
                size="lg" 
                onClick={handleLike}
              >
                <Heart 
                  size={20} 
                  fill={reel.isLiked ? 'red' : 'none'} 
                  color={reel.isLiked ? 'red' : 'white'} 
                />
              </ActionIcon>
              <Text color="white" size="sm">{reel.likes}</Text>
              
              <ActionIcon 
                variant="subtle" 
                color="white" 
                size="lg" 
                onClick={handleShare}
              >
                <Share2 size={20} />
              </ActionIcon>
              <Text color="white" size="sm">{reel.shares}</Text>
              
              <ActionIcon 
                variant="subtle" 
                color="white" 
                size="lg" 
                onClick={handleSave}
              >
                <Bookmark 
                  size={20} 
                  fill={reel.isSaved ? 'white' : 'none'} 
                />
              </ActionIcon>

              {!isLargeScreen && (
                <ActionIcon 
                  variant="subtle" 
                  color="white" 
                  size="lg" 
                  onClick={() => setIsCommentModalOpen(true)}
                >
                  <MessageCircle size={20} />
                </ActionIcon>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* User Info & Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-start space-x-3">
          <Avatar 
            src={reel.userAvatar || '/image-person.png'} 
            alt={reel.username} 
            radius="xl" 
            size="md" 
          />
          <div className="flex-1">
            <Text color="white" fw={500}>@{reel.username}</Text>
            <Text color="white" size="sm" className="mt-1">
              {formatHashtags(reel.caption || '')}
            </Text>
            <Text color="white" size="xs" className="mt-1 opacity-70">
              {formatDate(reel.createdAt)}
            </Text>
          </div>
        </div>
      </div>
      
      {/* Comments Section - Only show on large screens */}
      {isLargeScreen && (
        <Paper className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 backdrop-blur-md p-4 overflow-y-auto">
          <CommentsSection />
        </Paper>
      )}
      
      {/* Comments Modal - Only show on smaller screens */}
      <Modal
        opened={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        size="100%"
        fullScreen
        padding="md"
        withCloseButton={false}
        styles={{
          body: {
            backgroundColor: 'black',
            height: '100%',
            padding: '1rem',
          },
        }}
      >
        <CommentsSection />
      </Modal>
      
      {/* Navigation Buttons */}
      {onPrev && (
        <Button
          variant="subtle"
          color="white"
          className="absolute left-2 top-1/2 transform -translate-y-1/2"
          onClick={onPrev}
        >
          Previous
        </Button>
      )}
      
      {onNext && (
        <Button
          variant="subtle"
          color="white"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={onNext}
        >
          Next
        </Button>
      )}
    </div>
  );
} 