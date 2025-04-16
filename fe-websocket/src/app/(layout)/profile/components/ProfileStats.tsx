import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { User } from '@/types/user';

interface ProfileStatsProps {
  user: User;
}

export default function ProfileStats({ user }: ProfileStatsProps) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    });
  }, [controls]);

  const stats = [
    { label: 'Posts', value: user.postsCount || 0 },
    { label: 'Followers', value: user.followersCount || 0 },
    { label: 'Following', value: user.followingCount || 0 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-[#1E1E1E] rounded-xl p-2 gap-2 flex items-center justify-center shadow-sm text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-lg font-bold text-blue-600 dark:text-blue-400"
            >
              {stat.value}
            </motion.div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 