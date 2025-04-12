import { User } from '@/types/user';
import { FaGlobe, FaGithub, FaLinkedin, FaCircle } from 'react-icons/fa';

interface ProfileInfoProps {
  user: User;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <div className="space-y-4">
        {/* Bio */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">About</h3>
          <p className="mt-1 text-gray-600">{user.bio || 'No bio yet'}</p>
        </div>

        {/* Location */}
        {user.location && (
          <div className="flex items-center text-gray-600">
            <FaGlobe className="mr-2" />
            <span>{user.location}</span>
          </div>
        )}

        {/* Join Date */}
        <div className="text-gray-600">
          Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })}
        </div>

        {/* Social Links */}
        <div className="flex space-x-4">
          {user.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              <FaGlobe className="w-5 h-5" />
            </a>
          )}
          {user.github && (
            <a
              href={user.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-800"
            >
              <FaGithub className="w-5 h-5" />
            </a>
          )}
          {user.linkedin && (
            <a
              href={user.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center">
          <FaCircle
            className={`w-2 h-2 mr-2 ${
              user.isOnline ? 'text-green-500' : 'text-gray-400'
            }`}
          />
          <span className="text-sm text-gray-600">
            {user.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Privacy Settings */}
        <div className="text-sm text-gray-500">
          Profile visibility: {user.privacy || 'Public'}
        </div>
      </div>
    </div>
  );
} 