import React from 'react';

const PostSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
      </div>

      {/* Image placeholder */}
      <div className="mt-4 h-64 w-full bg-gray-200 rounded-lg" />

      {/* Actions */}
      <div className="flex justify-between mt-4">
        <div className="flex space-x-4">
          <div className="h-6 w-6 bg-gray-200 rounded" />
          <div className="h-6 w-6 bg-gray-200 rounded" />
          <div className="h-6 w-6 bg-gray-200 rounded" />
        </div>
        <div className="h-6 w-6 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default PostSkeleton; 