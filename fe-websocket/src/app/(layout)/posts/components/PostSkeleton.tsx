import React from 'react';

const PostSkeleton = () => {
  return (
    <div className="bg-white dark:bg-[#121212] rounded-xl shadow-md overflow-hidden mb-6 border border-gray-200 dark:border-gray-800 animate-pulse">
      {/* Post Header Skeleton */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div>
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded mt-1"></div>
          </div>
        </div>
        <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
      
      {/* Post Image Skeleton */}
      <div className="aspect-square bg-gray-200 dark:bg-gray-800"></div>
      
      {/* Post Actions Skeleton */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          </div>
          <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>
        
        {/* Post Stats Skeleton */}
        <div className="flex items-center space-x-4 mb-2">
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        
        {/* Post Content Skeleton */}
        <div className="mb-2">
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded mb-1"></div>
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
        
        {/* Tags Skeleton */}
        <div className="flex flex-wrap gap-2 mb-2">
          <div className="h-5 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="h-5 w-14 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton; 