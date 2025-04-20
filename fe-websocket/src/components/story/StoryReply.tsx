import React, { useState } from 'react';

interface StoryReplyProps {
  onReply: (content: string) => void;
}

const StoryReply: React.FC<StoryReplyProps> = ({ onReply }) => {
  const [replyText, setReplyText] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    onReply(replyText);
    setReplyText('');
  };
  
  return (
    <div className="absolute bottom-4 left-4 right-4 z-20">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Reply to story..."
          className="flex-1 bg-black/50 text-white rounded-full px-4 py-2 focus:outline-none"
          onClick={(e) => e.stopPropagation()}
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white rounded-full p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default StoryReply; 