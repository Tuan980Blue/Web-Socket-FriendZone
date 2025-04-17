import React from 'react';
import { FileQuestion, RefreshCw } from 'lucide-react';

interface EmptyPostsProps {
  onRefresh?: () => void;
  message?: string;
}

const EmptyPosts: React.FC<EmptyPostsProps> = ({ 
  onRefresh, 
  message = "No posts found. Try changing your filters or check back later." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <FileQuestion size={32} className="text-gray-400 dark:text-gray-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No Posts Yet
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        {message}
      </p>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </button>
      )}
    </div>
  );
};

export default EmptyPosts; 