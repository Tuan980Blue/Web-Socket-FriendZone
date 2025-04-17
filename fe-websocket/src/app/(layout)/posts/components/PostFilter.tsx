'use client';

import React, { useState } from 'react';
import { Filter, TrendingUp, Clock, Star } from 'lucide-react';

export type FilterType = 'all' | 'trending' | 'recent' | 'following';

interface PostFilterProps {
  onFilterChange: (filter: FilterType) => void;
  activeFilter: FilterType;
}

const PostFilter: React.FC<PostFilterProps> = ({ onFilterChange, activeFilter }) => {
  const [isOpen, setIsOpen] = useState(false);

  const filters: { id: FilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Posts', icon: <Filter size={18} /> },
    { id: 'trending', label: 'Trending', icon: <TrendingUp size={18} /> },
    { id: 'recent', label: 'Recent', icon: <Clock size={18} /> },
    { id: 'following', label: 'Following', icon: <Star size={18} /> },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Posts</h2>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter size={18} className="text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">
              {filters.find(f => f.id === activeFilter)?.label || 'Filter'}
            </span>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <div className="py-1">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => {
                      onFilterChange(filter.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm ${
                      activeFilter === filter.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-3">{filter.icon}</span>
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mt-4">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center px-3 py-1 rounded-full text-sm ${
              activeFilter === filter.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span className="mr-1">{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PostFilter; 