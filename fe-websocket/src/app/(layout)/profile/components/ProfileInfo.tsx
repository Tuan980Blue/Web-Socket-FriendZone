import { FaUser, FaEnvelope, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
import { User } from '@/types/user';

interface ProfileInfoProps {
  user: User;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div className="bg-white dark:bg-[#121212] rounded-lg shadow-sm p-6 border border-[#DBDBDB] dark:border-[#262626]">
      <h2 className="text-xl font-semibold text-[#262626] dark:text-[#FAFAFA] mb-4">Personal Information</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <FaEnvelope className="text-[#DD2A7B]" />
          <div>
            <p className="text-sm text-[#8E8E8E]">Email</p>
            <p className="text-[#262626] dark:text-[#FAFAFA]">{user.email}</p>
          </div>
        </div>
        {user.bio && (
          <div className="flex items-start space-x-3">
            <FaUser className="text-[#DD2A7B] mt-1" />
            <div>
              <p className="text-sm text-[#8E8E8E]">Bio</p>
              <p className="text-[#262626] dark:text-[#FAFAFA]">{user.bio}</p>
            </div>
          </div>
        )}
        {user.website && (
          <div className="flex items-center space-x-3">
            <FaGlobe className="text-[#DD2A7B]" />
            <div>
              <p className="text-sm text-[#8E8E8E]">Website</p>
              <a href={user.website} className="text-[#3897F0] hover:underline" target="_blank" rel="noopener noreferrer">
                {user.website}
              </a>
            </div>
          </div>
        )}
        {user.location && (
          <div className="flex items-center space-x-3">
            <FaMapMarkerAlt className="text-[#DD2A7B]" />
            <div>
              <p className="text-sm text-[#8E8E8E]">Location</p>
              <p className="text-[#262626] dark:text-[#FAFAFA]">{user.location}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 