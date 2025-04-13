'use client'

import Image from 'next/image';
import { FaUser } from 'react-icons/fa';
import { User } from '@/types/user';

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const getAvatarUrl = (avatar: string | undefined) => {
    if (!avatar) return null;
    
    // If avatar is already a full URL, return it
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
      return avatar;
    }
    
    // If avatar is a relative path, prepend backend URL
    return `${process.env.NEXT_PUBLIC_API_URL}${avatar}`;
  };

  const avatarUrl = getAvatarUrl(user.avatar);

  return (
    <div className="bg-white dark:bg-[#121212] rounded-lg shadow-sm overflow-hidden border border-[#DBDBDB] dark:border-[#262626]">
      <div className="relative h-48 bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]">
        <div className="absolute -bottom-16 left-8">
          <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-[#121212] overflow-hidden">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={user.username}
                fill
                className="object-cover"
                onError={(e) => {
                  // If image fails to load, show fallback
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement?.classList.add('fallback');
                }}
              />
            ) : (
              <div className="w-full h-full bg-[#DBDBDB] dark:bg-[#262626] flex items-center justify-center">
                <FaUser className="w-12 h-12 text-[#8E8E8E]" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-20 pb-6 px-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#262626] dark:text-[#FAFAFA]">{user.fullName || user.username}</h1>
            <p className="text-[#8E8E8E]">@{user.username}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              user.status === 'ONLINE' ? 'bg-[#20C997]/10 text-[#20C997]' :
              user.status === 'OFFLINE' ? 'bg-[#8E8E8E]/10 text-[#8E8E8E]' :
              user.status === 'AWAY' ? 'bg-[#F58529]/10 text-[#F58529]' :
              'bg-[#ED4956]/10 text-[#ED4956]'
            }`}>
              {user.status}
            </span>
            <span className="text-sm text-[#8E8E8E]">
              Last seen: {new Date(user.lastSeen).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 