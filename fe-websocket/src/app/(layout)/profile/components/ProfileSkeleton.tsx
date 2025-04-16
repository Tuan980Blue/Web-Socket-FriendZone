import React from 'react';

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#121212]">
      {/* Hero Skeleton */}
      <div className="relative h-[400px] bg-[#DBDBDB] dark:bg-[#262626]">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-32 h-32 rounded-full bg-[#DBDBDB] dark:bg-[#262626] border-4 border-white dark:border-[#121212] animate-pulse"></div>
        </div>
      </div>

      {/* Stories Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-[#DBDBDB] dark:bg-[#262626] animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-8 w-20 mx-auto bg-[#DBDBDB] dark:bg-[#262626] rounded animate-pulse"></div>
              <div className="h-4 w-16 mx-auto mt-2 bg-[#DBDBDB] dark:bg-[#262626] rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex space-x-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-24 bg-[#DBDBDB] dark:bg-[#262626] rounded animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-4">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-[#DBDBDB] dark:bg-[#262626] rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 