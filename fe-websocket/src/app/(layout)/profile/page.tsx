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
import ProfileTabs from './components/ProfileTabs';
import StoryHightlights from './components/StoryHightlights';
import ProfileInfo from "@/app/(layout)/profile/components/ProfileInfo";
import ProfileSkeleton from './components/ProfileSkeleton';
import QuickPost from '../../../components/quickPost/QuickPost';
import ProfilePosts from './components/ProfilePosts';

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

            {/* Stories Section */}
            <StoryHightlights user={profileUser} isCurrentUser={true}/>

            {/* Quick Post Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <QuickPost isCurrentUser={true}/>
            </div>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <div className="">
                    <div className="">
                        {/* Tabs Navigation */}
                        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab}/>

                        {/* Tab Content */}
                        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm px-4">
                            {activeTab === 'posts' && (
                                <div>
                                    <ProfilePosts userId={profileUser?.id} />
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