import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { User } from '@/types/user';

interface ProfileStatsProps {
  user: User;
}

export default function ProfileStats({ user }: ProfileStatsProps) {
  const stats = [
    { label: 'Posts', value: user.postsCount || 0 },
    { label: 'Followers', value: user.followersCount || 0 },
    { label: 'Following', value: user.followingCount || 0 }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-center md:justify-start gap-6 text-sm">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center gap-1"
          >
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="font-semibold"
            >
              {stat.value}
            </motion.span>
            <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 