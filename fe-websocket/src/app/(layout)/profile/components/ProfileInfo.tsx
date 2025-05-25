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
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import ChangePasswordModal from './ChangePasswordModal';
import {useProfileData} from "@/hooks/useProfileData";

interface ProfileInfoProps {
  user: User;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { isCurrentUser } = useProfileData(user.id);

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

  const infoSections = [
    {
      title: 'Basic Information',
      items: [
        { icon: FaUser, label: 'Full Name', value: user.fullName },
        { icon: FaEnvelope, label: 'Email', value: user.email },
        { icon: FaBirthdayCake, label: 'Birth Date', value: formatDate(user.birthDate) },
        { icon: FaGlobeAmericas, label: 'Gender', value: user.gender?.toLowerCase() },
      ]
    },
    {
      title: 'Social Information',
      items: [
        { icon: FaUserFriends, label: 'Followers & Following', value: `${user.followersCount} followers • ${user.followingCount} following` },
        { icon: FaImage, label: 'Posts', value: `${user.postsCount} posts` },
        { icon: FaClock, label: 'Last Seen', value: formatDate(user.lastSeen) },
        { icon: FaLock, label: 'Account Type', value: user.isPrivate ? 'Private Account' : 'Public Account' },
      ]
    }
  ];

  const optionalFields = [
    { icon: FaUser, label: 'Bio', value: user.bio },
    { icon: FaMapMarkerAlt, label: 'Location', value: user.location },
    { icon: FaPhone, label: 'Phone', value: user.phoneNumber },
    { icon: FaGlobe, label: 'Website', value: user.website, isLink: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm p-6 space-y-6">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></span>
            <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.status.toLowerCase()}</span>
          </div>
        </div>

        {/* Main Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {infoSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{section.title}</h3>
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <item.icon className="text-gray-600 dark:text-gray-400 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                      <p className="text-gray-900 dark:text-white font-medium">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Optional Fields */}
        {(user.bio || user.location || user.phoneNumber || user.website) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {optionalFields.map((field, index) => field.value && (
                <motion.div
                  key={field.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + (index * 0.05) }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <field.icon className="text-gray-600 dark:text-gray-400 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{field.label}</p>
                    {field.isLink ? (
                      <a
                        href={field.value as string}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {field.value}
                      </a>
                    ) : (
                      <p className="text-gray-900 dark:text-white">{field.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {isCurrentUser && (
            <>
              {/* Security Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security</h3>
                <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span>Change Password</span>
                </button>
              </div>
            </>
        )}

        {/* Change Password Modal */}
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      </div>
    </motion.div>
  );
} 