import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { useUserData } from './useUserData';
import { profileService } from '@/services/profileService';

interface UseProfileDataReturn {
  profileUser: User | null;
  isLoading: boolean;
  error: string | null;
  isCurrentUser: boolean;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  updateCover: (file: File) => Promise<void>;
}

export const useProfileData = (userId: string | undefined): UseProfileDataReturn => {
  const { user: currentUser, isLoading: isCurrentUserLoading } = useUserData();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        if (!userId || userId === 'profile') {
          // If no userId in URL or it's 'profile', use current user data
          if (currentUser) {
            setProfileUser(currentUser);
          }
        } else {
          // Fetch other user's profile data
          const user = await profileService.getProfileById(userId);
          setProfileUser(user);
        }
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, currentUser]);

  const isCurrentUser = currentUser?.id === userId || (!userId || userId === 'profile');

  const updateProfile = async (data: Partial<User>) => {
    if (!profileUser) return;
    try {
      const updatedUser = await profileService.updateProfile(profileUser.id, data);
      setProfileUser(updatedUser);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    }
  };

  const updateAvatar = async (file: File) => {
    if (!profileUser) return;
    try {
      const avatarUrl = await profileService.updateAvatar(profileUser.id, file);
      setProfileUser(prev => prev ? { ...prev, avatar: avatarUrl } : null);
    } catch (err) {
      setError('Failed to update avatar');
      console.error('Error updating avatar:', err);
    }
  };

  const updateCover = async (file: File) => {
    if (!profileUser) return;
    try {
      const coverUrl = await profileService.updateCover(profileUser.id, file);
      // Assuming we have a cover field in User type
      setProfileUser(prev => prev ? { ...prev, cover: coverUrl } : null);
    } catch (err) {
      setError('Failed to update cover');
      console.error('Error updating cover:', err);
    }
  };

  return {
    profileUser,
    isLoading: isLoading || isCurrentUserLoading,
    error,
    isCurrentUser,
    updateProfile,
    updateAvatar,
    updateCover
  };
}; 