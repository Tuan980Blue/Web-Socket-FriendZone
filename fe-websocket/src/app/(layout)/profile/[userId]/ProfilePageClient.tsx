'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileData } from '@/hooks/useProfileData';
import { useFollows } from '@/hooks/useFollows';
import { UserInContext } from '@/types/user';

// Components
import ProfileHero from '../components/ProfileHero';
import ProfileTabs from '../components/ProfileTabs';
import ProfileStories from '../components/ProfileStories';
import ProfileInfo from '../components/ProfileInfo';
import ProfileSkeleton from "@/app/(layout)/profile/components/ProfileSkeleton";
import ProfilePosts from '../components/ProfilePosts';

interface Props {
    userId: string;
}

export default function ProfilePageClient({ userId }: Props) {
    const router = useRouter();
    const [isDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('posts');
    const [forceUpdate, setForceUpdate] = useState(0);
    const [isFollowingLoading, setIsFollowingLoading] = useState(false);
    const [localUser, setLocalUser] = useState<UserInContext | null>(null);

    const { profileUser, isLoading, error, isCurrentUser } = useProfileData(userId);
    const { handleFollow, handleUnfollow } = useFollows();

    useEffect(() => {
        if (profileUser) {
            setLocalUser(profileUser);
        }
    }, [profileUser]);

    useEffect(() => {
        if (!isLoading && !profileUser && !isCurrentUser) {
            router.push('/auth');
        }
    }, [isLoading, profileUser, isCurrentUser, router]);

    const handleFollowClick = async () => {
        if (!localUser) return;
        try {
            setIsFollowingLoading(true);
            await handleFollow(localUser.id);
            // Update local user state
            setLocalUser(prev => prev ? { ...prev, isFollowing: true } : null);
            setForceUpdate(prev => prev + 1);
        } finally {
            setIsFollowingLoading(false);
        }
    };

    const handleUnfollowClick = async () => {
        if (!localUser) return;
        try {
            setIsFollowingLoading(true);
            await handleUnfollow(localUser.id);
            // Update local user state
            setLocalUser(prev => prev ? { ...prev, isFollowing: false } : null);
            setForceUpdate(prev => prev + 1);
        } finally {
            setIsFollowingLoading(false);
        }
    };

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#121212] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Error</h2>
                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    if (!localUser) return null;

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#FAFAFA]'}`}>
            <ProfileHero 
                user={localUser} 
                isCurrentUser={isCurrentUser}
                onFollow={handleFollowClick}
                onUnfollow={handleUnfollowClick}
                isFollowingLoading={isFollowingLoading}
                key={forceUpdate}
            />
            <ProfileStories user={localUser} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="space-y-4">
                    <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-4">
                        {activeTab === 'posts' && (
                            <div>
                                <ProfilePosts userId={userId} />
                            </div>
                        )}
                        {activeTab === 'introduces' && <ProfileInfo user={localUser} />}
                        {activeTab === 'photos' && <div className="grid grid-cols-2 md:grid-cols-3 gap-4"></div>}
                        {activeTab === 'videos' && <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>}
                    </div>
                </div>
            </main>
        </div>
    );
}
