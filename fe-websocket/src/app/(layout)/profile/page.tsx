'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { useUserData } from '@/hooks/useUserData';
import ProfileHeader from './components/ProfileHeader';
import ProfileStats from './components/ProfileStats';
import ProfileInfo from './components/ProfileInfo';
import ProfileAdditionalInfo from './components/ProfileAdditionalInfo';

export default function Profile() {
  const { user, isLoading } = useUserData();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#121212]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-[#DBDBDB] dark:bg-[#262626] rounded-lg"></div>
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
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#121212]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader user={user} />
        <ProfileStats user={user} />
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileInfo user={user} />
          <ProfileAdditionalInfo user={user} />
        </div>
      </main>
    </div>
  );
} 