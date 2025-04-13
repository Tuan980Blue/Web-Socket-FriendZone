import { FaPhone, FaVenusMars, FaCalendar } from 'react-icons/fa';
import { User } from '@/types/user';

interface ProfileAdditionalInfoProps {
  user: User;
}

export default function ProfileAdditionalInfo({ user }: ProfileAdditionalInfoProps) {
  return (
    <div className="bg-white dark:bg-[#121212] rounded-lg shadow-sm p-6 border border-[#DBDBDB] dark:border-[#262626]">
      <h2 className="text-xl font-semibold text-[#262626] dark:text-[#FAFAFA] mb-4">Additional Information</h2>
      <div className="space-y-4">
        {user.phoneNumber && (
          <div className="flex items-center space-x-3">
            <FaPhone className="text-[#DD2A7B]" />
            <div>
              <p className="text-sm text-[#8E8E8E]">Phone Number</p>
              <p className="text-[#262626] dark:text-[#FAFAFA]">{user.phoneNumber}</p>
            </div>
          </div>
        )}
        <div className="flex items-center space-x-3">
          <FaVenusMars className="text-[#DD2A7B]" />
          <div>
            <p className="text-sm text-[#8E8E8E]">Gender</p>
            <p className="text-[#262626] dark:text-[#FAFAFA]">{user.gender}</p>
          </div>
        </div>
        {user.birthDate && (
          <div className="flex items-center space-x-3">
            <FaCalendar className="text-[#DD2A7B]" />
            <div>
              <p className="text-sm text-[#8E8E8E]">Birth Date</p>
              <p className="text-[#262626] dark:text-[#FAFAFA]">{new Date(user.birthDate).toLocaleDateString()}</p>
            </div>
          </div>
        )}
        <div className="flex items-center space-x-3">
          <FaCalendar className="text-[#DD2A7B]" />
          <div>
            <p className="text-sm text-[#8E8E8E]">Member Since</p>
            <p className="text-[#262626] dark:text-[#FAFAFA]">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 