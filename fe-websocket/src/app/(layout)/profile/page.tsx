'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { useUserData } from '@/hooks/useUserData';
import ProfileHeader from '@/app/(layout)/profile/components/ProfileHeader';
import ProfileInfo from '@/app/(layout)/profile/components/ProfileInfo';
import ProfileTabs from '@/app/(layout)/profile/components/ProfileTabs';

export default function Profile() {
  const { user, isLoading } = useUserData();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not logged in
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="mt-4 h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Mock data for demonstration
  const mockStats = {
    friends: 123,
    posts: 45,
    photos: 67,
    likes: 890,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader
          user={user}
          isOwnProfile={true}
          stats={mockStats}
        />
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProfileInfo user={user} />
          </div>
          <div className="lg:col-span-2">
            <ProfileTabs userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  );
} 