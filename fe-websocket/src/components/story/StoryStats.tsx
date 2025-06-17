import React from 'react';
import { motion } from 'framer-motion';
import { IconEye, IconHeart, IconBookmark, IconClock } from '@tabler/icons-react';
import { Story } from '@/types/story';

interface StoryStatsProps {
  stories: Story[];
  title?: string;
}

const StoryStats: React.FC<StoryStatsProps> = ({ stories, title = "Story Statistics" }) => {
  const totalViews = stories.reduce((sum, story) => sum + (story.viewCount || 0), 0);
  const totalLikes = stories.reduce((sum, story) => sum + (story.likeCount || 0), 0);
  const totalHighlights = stories.filter(story => story.isHighlighted).length;
  const activeStories = stories.filter(story => new Date(story.expiresAt) > new Date()).length;

  const stats = [
    {
      icon: IconEye,
      label: 'Total Views',
      value: totalViews,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: IconHeart,
      label: 'Total Likes',
      value: totalLikes,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      icon: IconBookmark,
      label: 'Highlights',
      value: totalHighlights,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      icon: IconClock,
      label: 'Active Stories',
      value: activeStories,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-lg p-4 text-center`}
          >
            <div className={`${stat.color} mb-2 flex justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {stories.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Total Stories: {stories.length}</span>
            <span>Avg Views: {Math.round(totalViews / stories.length)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryStats; 