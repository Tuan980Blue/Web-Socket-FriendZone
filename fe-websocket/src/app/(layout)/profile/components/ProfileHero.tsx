import { motion } from 'framer-motion';
import Image from 'next/image';
import { User } from '@/types/user';
import {Button} from "@mantine/core";

interface ProfileHeroProps {
  user: User;
  isCurrentUser: boolean;
}

const renderBio = (bio: string | null | undefined) => {
  if (!bio || bio.trim() === '') {
    return <span className="italic text-gray-400">Chưa có mô tả cá nhân.</span>;
  }

  return bio.split('\n').map((line, index) => (
      <p key={index} className="text-gray-800 leading-relaxed">
        {line}
      </p>
  ));
};

export default function ProfileHero({ user, isCurrentUser }: ProfileHeroProps) {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-70 w-full relative overflow-hidden">
        <Image
          src={'/backgroundprofile.png'}
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg"
          >
            <Image
              src={user.avatar || '/logo2.png'}
              alt={user.username}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-primery">{user.fullName}</h1>
            <p className="text-gray-600 mt-1">@{user.username}</p>
            <div className="mt-1 italic max-w-md space-y-1">
              {renderBio(user.bio)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4 md:mt-0">
            {!isCurrentUser && (
              <>
                <Button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  {user.isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
                <Button className="px-6 py-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                  Message
                </Button>
              </>
            )}
            <Button className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
