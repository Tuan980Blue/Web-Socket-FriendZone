import React from 'react';
import { motion } from 'framer-motion';
import { StoryItem } from '@/hooks/useStories';

interface StoryReactionsProps {
  story: StoryItem;
}

const StoryReactions: React.FC<StoryReactionsProps> = ({ story }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-16 left-4 right-4 bg-black/80 rounded-lg p-4 z-30"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-white font-medium mb-2">Reactions</h3>
      <div className="max-h-40 overflow-y-auto">
        {story.reactions && story.reactions.length > 0 ? (
          <div className="space-y-2">
            {story.reactions.map((reaction, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-2xl">{reaction.emoji}</span>
                <span className="text-white text-xs opacity-75">
                  {new Date(reaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white text-center">No reactions yet</p>
        )}
      </div>
    </motion.div>
  );
};

export default StoryReactions; 