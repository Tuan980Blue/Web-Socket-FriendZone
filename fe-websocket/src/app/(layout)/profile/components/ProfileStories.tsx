import { motion } from 'framer-motion';
import Image from 'next/image';
import { IconPlus } from '@tabler/icons-react';
import { UserInContext } from '@/types/user';

interface ProfileStoriesProps {
  user: UserInContext;
}

export default function ProfileStories({ user }: ProfileStoriesProps) {
  // Mock stories data - in real app this would come from the backend
  const stories = [
    { id: 1, image: '/image-person.png', title: 'Beach Day' },
    { id: 2, image: '/image-person.png', title: 'Food' },
    { id: 3, image: '/image-person.png', title: 'Travel' },
  ];

  return (
    <div className="max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 py-4">
      <div 
        className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide pb-4 touch-pan-x"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          cursor: 'grab',
          userSelect: 'none',
        }}
      >
        {/* Stories */}
          {/* Add Story Button */}
          <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center space-y-1 sm:space-y-2 flex-shrink-0"
          >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 opacity-50" />
                  <IconPlus size={20} className="text-gray-600 dark:text-gray-400" />
              </div>
              <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Add Story</span>
          </motion.div>

        {stories.map((story) => (
          <motion.div
            key={story.id}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center space-y-1 sm:space-y-2 flex-shrink-0"
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 p-1">
              <Image
                src={story.image}
                alt={user.username}
                fill
                className="object-cover rounded-full"
              />
            </div>
            <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate max-w-[60px] sm:max-w-[80px]">
              {story.title}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 