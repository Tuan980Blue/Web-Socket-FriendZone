'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useProfileData} from '@/hooks/useProfileData';

function LoginRequired() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
            <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Login Required</h2>
                <p className="text-gray-600 mb-6">Please login to view your profile</p>
                <button
                    onClick={() => router.push('/auth')}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
}

// Components
import ProfileHero from './components/ProfileHero';
import ProfileStats from './components/ProfileStats';
import ProfileTabs from './components/ProfileTabs';
import ProfileStories from './components/ProfileStories';
import ProfileInfo from "@/app/(layout)/profile/components/ProfileInfo";
import ProfileSkeleton from './components/ProfileSkeleton';
import QuickPost from '../../../components/quickPost/QuickPost';

export default function Profile() {
    const [isDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');

    // Get current user's profile data
    const {profileUser, isLoading} = useProfileData(undefined);

    if (isLoading) {
        return <ProfileSkeleton/>;
    }

    if (!profileUser) {
        return <LoginRequired/>;
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