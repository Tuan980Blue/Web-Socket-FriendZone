import { motion } from 'framer-motion';
import Image from 'next/image';
import { User } from '@/types/user';

interface ProfileStoriesProps {
  user: User;
}

export default function ProfileStories({ user }: ProfileStoriesProps) {
  // Mock stories data - in real app this would come from the backend
  const stories = [
    { id: 1, image: '/story1.jpg', title: 'Beach Day' },
    { id: 2, image: '/story2.jpg', title: 'Food' },
    { id: 3, image: '/story3.jpg', title: 'Travel' },
    { id: 4, image: '/story4.jpg', title: 'Friends' },
    { id: 5, image: '/story5.jpg', title: 'Work' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
        {/* Stories */}
        {stories.map((story) => (
          <motion.div
            key={story.id}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 p-1">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover rounded-full"
              />
            </div>
            <span className="mt-2 text-xs text-gray-600 dark:text-gray-400 truncate max-w-[80px]">
              {story.title}
            </span>
          </motion.div>
        ))}

        {/* Add Story Button */}
        <motion.div
            whileHover={{ scale: 1.04 }}
            className="flex flex-col items-center"
        >
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">Add Story</span>
        </motion.div>
      </div>
    </div>
  );
} 