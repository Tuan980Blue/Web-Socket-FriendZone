import { 
  FaUser, 
  FaEnvelope, 
  FaGlobe, 
  FaMapMarkerAlt, 
  FaBirthdayCake, 
  FaPhone, 
  FaUserFriends, 
  FaImage, 
  FaClock, 
  FaLock, 
  FaGlobeAmericas 
} from 'react-icons/fa';
import { User } from '@/types/user';
import { format } from 'date-fns';

interface ProfileInfoProps {
  user: User;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'text-green-500';
      case 'OFFLINE':
        return 'text-gray-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div className="bg-white dark:bg-[#121212] rounded-xl shadow-lg p-6 border border-[#DBDBDB] dark:border-[#262626]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#262626] dark:text-[#FAFAFA]">Profile Information</h2>
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></span>
          <span className="text-sm text-[#8E8E8E] capitalize">{user.status.toLowerCase()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-[#FAFAFA] dark:bg-[#1E1E1E] rounded-lg">
            <FaUser className="text-[#DD2A7B] text-xl" />
            <div>
              <p className="text-sm text-[#8E8E8E]">Full Name</p>
              <p className="text-[#262626] dark:text-[#FAFAFA] font-medium">{user.fullName}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-[#FAFAFA] dark:bg-[#1E1E1E] rounded-lg">
            <FaEnvelope className="text-[#DD2A7B] text-xl" />
            <div>
              <p className="text-sm text-[#8E8E8E]">Email</p>
              <p className="text-[#262626] dark:text-[#FAFAFA] font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-[#FAFAFA] dark:bg-[#1E1E1E] rounded-lg">
            <FaBirthdayCake className="text-[#DD2A7B] text-xl" />
            <div>
              <p className="text-sm text-[#8E8E8E]">Birth Date</p>
              <p className="text-[#262626] dark:text-[#FAFAFA] font-medium">{formatDate(user.birthDate)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-[#FAFAFA] dark:bg-[#1E1E1E] rounded-lg">
            <FaGlobeAmericas className="text-[#DD2A7B] text-xl" />
            <div>
              <p className="text-sm text-[#8E8E8E]">Gender</p>
              <p className="text-[#262626] dark:text-[#FAFAFA] font-medium capitalize">{user.gender.toLowerCase()}</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-[#FAFAFA] dark:bg-[#1E1E1E] rounded-lg">
            <FaUserFriends className="text-[#DD2A7B] text-xl" />
            <div>
              <p className="text-sm text-[#8E8E8E]">Followers & Following</p>
              <p className="text-[#262626] dark:text-[#FAFAFA] font-medium">
                {user.followersCount} followers • {user.followingCount} following
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-[#FAFAFA] dark:bg-[#1E1E1E] rounded-lg">
            <FaImage className="text-[#DD2A7B] text-xl" />
            <div>
              <p className="text-sm text-[#8E8E8E]">Posts</p>
              <p className="text-[#262626] dark:text-[#FAFAFA] font-medium">{user.postsCount} posts</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-[#FAFAFA] dark:bg-[#1E1E1E] rounded-lg">
            <FaClock className="text-[#DD2A7B] text-xl" />
            <div>
              <p className="text-sm text-[#8E8E8E]">Last Seen</p>
              <p className="text-[#262626] dark:text-[#FAFAFA] font-medium">{formatDate(user.lastSeen)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-[#FAFAFA] dark:bg-[#1E1E1E] rounded-lg">
            <FaLock className="text-[#DD2A7B] text-xl" />
            <div>
              <p className="text-sm text-[#8E8E8E]">Account Type</p>
              <p className="text-[#262626] dark:text-[#FAFAFA] font-medium">
                {user.isPrivate ? 'Private Account' : 'Public Account'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Fields */}
      {(user.bio || user.location || user.phoneNumber || user.website) && (
        <div className="mt-6 pt-6 border-t border-[#DBDBDB] dark:border-[#262626]">
          <h3 className="text-lg font-semibold text-[#262626] dark:text-[#FAFAFA] mb-4">Additional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.bio && (
              <div className="flex items-start space-x-3 p-3 bg-[#FAFAFA] dark:bg-[#1E1E1E] rounded-lg">
                <FaUser className="text-[#DD2A7B] text-xl mt-1" />
                <div>
                  <p className="text-sm text-[#8E8E8E]">Bio</p>
                  <p className="text-[#262626] dark:text-[#FAFAFA]">{user.bio}</p>
                </div>
              </div>
            )}
            {user.location && (
              <div className="flex items-center space-x-3 p-3 bg-[#FAFAFA] dark:bg-[#1E1E1E] rounded-lg">
                <FaMapMarkerAlt className="text-[#DD2A7B] text-xl" />
                <div>
                  <p className="text-sm text-[#8E8E8E]">Location</p>
                  <p className="text-[#262626] dark:text-[#FAFAFA]">{user.location}</p>
                </div>
              </div>
            )}
            {user.phoneNumber && (
              <div className="flex items-center space-x-3 p-3 bg-[#FAFAFA] dark:bg-[#1E1E1E] rounded-lg">
                <FaPhone className="text-[#DD2A7B] text-xl" />
                <div>
                  <p className="text-sm text-[#8E8E8E]">Phone</p>
                  <p className="text-[#262626] dark:text-[#FAFAFA]">{user.phoneNumber}</p>
                </div>
              </div>
            )}
            {user.website && (
              <div className="flex items-center space-x-3 p-3 bg-[#FAFAFA] dark:bg-[#1E1E1E] rounded-lg">
                <FaGlobe className="text-[#DD2A7B] text-xl" />
                <div>
                  <p className="text-sm text-[#8E8E8E]">Website</p>
                  <a 
                    href={user.website} 
                    className="text-[#3897F0] hover:underline" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {user.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 