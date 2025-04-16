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
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 text-sm font-medium relative ${
                        activeTab === tab.id
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                  {activeTab === tab.id && (
                      <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                      />
                  )}
                </button>
            );
          })}
        </div>
      </div>
  );
}
