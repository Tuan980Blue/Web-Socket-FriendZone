import React from 'react';
import Image from 'next/image';
import { StoryItem } from '@/hooks/useStories';

interface StoryContentProps {
  story: StoryItem;
}

const StoryContent: React.FC<StoryContentProps> = ({ story }) => {
  return (
    <div className="relative w-full h-full">
      {story.type === 'image' ? (
        <Image
          src={story.mediaUrl}
          alt="Story"
          fill
          className="object-contain"
        />
      ) : (
        <video
          src={story.mediaUrl}
          className="w-full h-full object-contain"
          controls
          autoPlay
          loop
          muted
        />
      )}
    </div>
  );
};

export default StoryContent; 