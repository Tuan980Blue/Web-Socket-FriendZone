'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useProfileData} from '@/hooks/useProfileData';

// Components
import ProfileHero from './components/ProfileHero';
import ProfileStats from './components/ProfileStats';
import ProfileTabs from './components/ProfileTabs';
import ProfileStories from './components/ProfileStories';
import ProfileInfo from "@/app/(layout)/profile/components/ProfileInfo";
import ProfileSkeleton from './components/ProfileSkeleton';
import QuickPost from '../../../components/quickPost/QuickPost';

export default function Profile() {
    const router = useRouter();
    const [isDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');

    // Get current user's profile data
    const {profileUser, isLoading} = useProfileData(undefined);

    // Redirect to auth if not logged in
    if (!isLoading && !profileUser) {
        router.push('/auth');
    }

    if (isLoading) {
        return <ProfileSkeleton/>;
    }

    if (!profileUser) {
        return null;
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#FAFAFA]'}`}>
            {/* Hero Section */}
            <ProfileHero user={profileUser} isCurrentUser={true}/>

            {/* Stats with Animation */}
            <ProfileStats user={profileUser}/>
            {/* Stories Section */}
            <ProfileStories user={profileUser}/>

            {/* Quick Post Section */}
            <QuickPost isCurrentUser={true}/>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="">
                    <div className="space-y-4">
                        {/* Tabs Navigation */}
                        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab}/>

                        {/* Tab Content */}
                        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-4">
                            {activeTab === 'posts' && (
                                <div className="space-y-6">
                                    {/* Post Feed will be implemented here */}
                                </div>
                            )}
                            {activeTab === 'introduces' && (
                                <div>
                                    <ProfileInfo user={profileUser}/>
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