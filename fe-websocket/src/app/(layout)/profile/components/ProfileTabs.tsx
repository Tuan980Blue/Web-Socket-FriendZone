import { useState } from 'react';
import { FaImage, FaHeart, FaUserFriends, FaBookmark, FaChartLine } from 'react-icons/fa';

type TabType = 'posts' | 'photos' | 'likes' | 'friends' | 'saved' | 'activity';

interface ProfileTabsProps {
  userId: string;
}

export default function ProfileTabs({ userId }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('posts');

  const tabs = [
    { id: 'posts', label: 'Posts', icon: null },
    { id: 'photos', label: 'Photos', icon: FaImage },
    { id: 'likes', label: 'Likes', icon: FaHeart },
    { id: 'friends', label: 'Friends', icon: FaUserFriends },
    { id: 'saved', label: 'Saved', icon: FaBookmark },
    { id: 'activity', label: 'Activity', icon: FaChartLine },
  ] as const;

  return (
    <div className="mt-6">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {Icon && <Icon className="mr-2" />}
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {/* Posts content will be implemented here */}
            <p className="text-gray-500">Posts content coming soon...</p>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="grid grid-cols-3 gap-4">
            {/* Photos grid will be implemented here */}
            <p className="text-gray-500">Photos grid coming soon...</p>
          </div>
        )}

        {activeTab === 'likes' && (
          <div className="space-y-4">
            {/* Liked posts will be implemented here */}
            <p className="text-gray-500">Liked posts coming soon...</p>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="grid grid-cols-4 gap-4">
            {/* Friends grid will be implemented here */}
            <p className="text-gray-500">Friends grid coming soon...</p>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-4">
            {/* Saved posts will be implemented here */}
            <p className="text-gray-500">Saved posts coming soon...</p>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            {/* Activity feed will be implemented here */}
            <p className="text-gray-500">Activity feed coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
} 