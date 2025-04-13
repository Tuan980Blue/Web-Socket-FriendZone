import { FaLock, FaUnlock } from 'react-icons/fa';
import { User } from '@/types/user';

interface ProfileStatsProps {
  user: User;
}

export default function ProfileStats({ user }: ProfileStatsProps) {
  return (
    <div className="mt-6 grid grid-cols-4 gap-4">
      <div className="bg-white dark:bg-[#121212] p-4 rounded-lg shadow-sm border border-[#DBDBDB] dark:border-[#262626]">
        <p className="text-sm text-[#8E8E8E]">Followers</p>
        <p className="text-2xl font-bold text-[#262626] dark:text-[#FAFAFA]">{user.followersCount}</p>
      </div>
      <div className="bg-white dark:bg-[#121212] p-4 rounded-lg shadow-sm border border-[#DBDBDB] dark:border-[#262626]">
        <p className="text-sm text-[#8E8E8E]">Following</p>
        <p className="text-2xl font-bold text-[#262626] dark:text-[#FAFAFA]">{user.followingCount}</p>
      </div>
      <div className="bg-white dark:bg-[#121212] p-4 rounded-lg shadow-sm border border-[#DBDBDB] dark:border-[#262626]">
        <p className="text-sm text-[#8E8E8E]">Posts</p>
        <p className="text-2xl font-bold text-[#262626] dark:text-[#FAFAFA]">{user.postsCount}</p>
      </div>
      <div className="bg-white dark:bg-[#121212] p-4 rounded-lg shadow-sm border border-[#DBDBDB] dark:border-[#262626]">
        <p className="text-sm text-[#8E8E8E]">Account Type</p>
        <p className="text-2xl font-bold text-[#262626] dark:text-[#FAFAFA]">
          {user.isPrivate ? <FaLock className="inline text-[#DD2A7B]" /> : <FaUnlock className="inline text-[#20C997]" />}
        </p>
      </div>
    </div>
  );
} 