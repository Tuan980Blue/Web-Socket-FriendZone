'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserData } from '@/hooks/useUserData';

// Components
import ProfileHero from './components/ProfileHero';
import ProfileStats from './components/ProfileStats';
import ProfileTabs from './components/ProfileTabs';
import ProfileStories from './components/ProfileStories';
import ProfileInfo from "@/app/(layout)/profile/components/ProfileInfo";

export default function Profile() {
  const { user, isLoading } = useUserData();
  const router = useRouter();
  const [isDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-[#DBDBDB] dark:bg-[#262626] rounded-lg"></div>
            <div className="mt-4 h-32 bg-[#DBDBDB] dark:bg-[#262626] rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#FAFAFA]'}`}>
      {/* Hero Section */}
      <ProfileHero user={user} />
      
      {/* Stories Section */}
      <ProfileStories user={user} />
      
      {/* Stats with Animation */}
      <ProfileStats user={user} />
      
      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="">
          <div className="space-y-4">
            {/* Tabs Navigation */}
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {/* Tab Content */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-4">
              {activeTab === 'posts' && (
                <div className="space-y-6">
                  {/* Post Feed will be implemented here */}
                </div>
              )}
              {activeTab === 'introduces' && (
                  <div>
                    <ProfileInfo user={user}/>
                  </div>
              )}
              {activeTab === 'photos' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Photo Grid will be implemented here */}
                </div>
              )}
              {activeTab === 'videos' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Video Grid will be implemented here */}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 