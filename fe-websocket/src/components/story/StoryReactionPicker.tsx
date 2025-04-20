import React from 'react';
import { motion } from 'framer-motion';

interface StoryReactionPickerProps {
  onReactionSelect: (emoji: string) => void;
}

const StoryReactionPicker: React.FC<StoryReactionPickerProps> = ({ onReactionSelect }) => {
  // Emoji options
  const emojis = ['❤️', '😍', '😂', '😮', '😢', '🙏', '🔥', '👍', '👏', '🎉'];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-16 left-4 right-4 bg-black/80 rounded-lg p-4 z-30"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-white font-medium mb-2">Add Reaction</h3>
      <div className="flex justify-center space-x-4">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            className="text-3xl hover:scale-125 transition-transform"
            onClick={() => onReactionSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default StoryReactionPicker; 