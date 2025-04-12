'use client';

import { useState } from 'react';
import { Reel } from '@/types/reel';
import { Card, Text, Avatar, ActionIcon } from '@mantine/core';
import { Heart, MessageCircle, Share2, Bookmark, Play } from 'lucide-react';

interface ReelGridProps {
  reels: Reel[];
  onReelClick: (reel: Reel) => void;
}

export default function ReelGrid({ reels, onReelClick }: ReelGridProps) {
  const [hoveredReel, setHoveredReel] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {reels.map((reel) => (
        <Card
          key={reel.id}
          className="relative overflow-hidden cursor-pointer group"
          onClick={() => onReelClick(reel)}
          onMouseEnter={() => setHoveredReel(reel.id)}
          onMouseLeave={() => setHoveredReel(null)}
        >
          {/* Thumbnail */}
          <div className="relative aspect-[9/16] w-full">
            <img
              src={reel.thumbnailUrl || '/placeholder-video.jpg'}
              alt={reel.caption || 'Reel thumbnail'}
              className="w-full h-full object-cover"
            />
            
            {/* Video Preview (autoplay on hover) */}
            {hoveredReel === reel.id && (
              <video
                src={reel.videoUrl}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                autoPlay
                loop
                playsInline
              />
            )}
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
              <Play size={40} className="text-white" />
            </div>
            
            {/* User Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex items-center gap-2">
                <Avatar 
                  src={reel.userAvatar} 
                  alt={reel.username} 
                  radius="xl" 
                  size="sm" 
                />
                <Text color="white" size="sm" truncate>
                  @{reel.username}
                </Text>
              </div>
            </div>
            
            {/* Stats Overlay */}
            <div className="absolute top-0 right-0 p-2 flex flex-col items-end space-y-2">
              <div className="flex items-center gap-1">
                <ActionIcon variant="subtle" color="white" size="sm">
                  <Heart 
                    size={16} 
                    fill={reel.isLiked ? 'red' : 'none'} 
                    color={reel.isLiked ? 'red' : 'white'} 
                  />
                </ActionIcon>
                <Text color="white" size="xs">{reel.likes}</Text>
              </div>
              
              <div className="flex items-center gap-1">
                <ActionIcon variant="subtle" color="white" size="sm">
                  <MessageCircle size={16} />
                </ActionIcon>
                <Text color="white" size="xs">{reel.comments}</Text>
              </div>
              
              <div className="flex items-center gap-1">
                <ActionIcon variant="subtle" color="white" size="sm">
                  <Share2 size={16} />
                </ActionIcon>
                <Text color="white" size="xs">{reel.shares}</Text>
              </div>
              
              <ActionIcon variant="subtle" color="white" size="sm">
                <Bookmark 
                  size={16} 
                  fill={reel.isSaved ? 'white' : 'none'} 
                />
              </ActionIcon>
            </div>
          </div>
          
          {/* Caption (truncated) */}
          {reel.caption && (
            <Text size="sm" className="mt-2 line-clamp-2">
              {reel.caption}
            </Text>
          )}
        </Card>
      ))}
    </div>
  );
} 