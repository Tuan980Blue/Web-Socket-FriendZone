import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { StoryItem } from '@/hooks/useStories';

interface StoryViewersProps {
  story: StoryItem;
}

const StoryViewers: React.FC<StoryViewersProps> = ({ story }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-16 left-4 right-4 bg-black/80 rounded-lg p-4 z-30"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-white font-medium mb-2">Viewers</h3>
      <div className="max-h-40 overflow-y-auto">
        {story.viewers && story.viewers.length > 0 ? (
          <div className="space-y-2">
            {story.viewers.map((viewer, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={viewer.avatarUrl || "/default-avatar.png"}
                    alt={viewer.username}
                    width={32}
                    height={32}
                  />
                </div>
                <span className="text-white">{viewer.username}</span>
                <span className="text-white text-xs opacity-75">
                  {new Date(viewer.viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white text-center">No viewers yet</p>
        )}
      </div>
    </motion.div>
  );
};

export default StoryViewers; 