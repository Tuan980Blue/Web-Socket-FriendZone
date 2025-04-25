import { motion } from 'framer-motion';
import {
  FiImage,
  FiUser,
  FiVideo,
  FiCalendar,
  FiMapPin,
  FiLink,
} from 'react-icons/fi';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'posts', label: 'Posts', icon: FiImage },
  { id: 'introduces', label: 'Introduces', icon: FiUser },
  { id: 'photos', label: 'Photos', icon: FiImage },
  { id: 'videos', label: 'Videos', icon: FiVideo },
  { id: 'events', label: 'Events', icon: FiCalendar },
  { id: 'places', label: 'Places', icon: FiMapPin },
  { id: 'links', label: 'Links', icon: FiLink },
];

export default function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium relative ${
                  isActive
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon 
                  className={`w-5 h-5 ${isActive ? 'opacity-100' : 'opacity-60'} md:mr-2`} 
                />
                <span className="hidden md:inline">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
