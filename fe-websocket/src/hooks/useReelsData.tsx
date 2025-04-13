'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Reel, ReelContextType } from '@/types/reel';
import { useUserData } from './useUserData';

// Create context with default values
const ReelContext = createContext<ReelContextType>({
  reels: [],
  setReels: () => {},
  isLoading: true,
  error: null,
  fetchReels: async () => {},
  likeReel: async () => {},
  saveReel: async () => {},
  shareReel: async () => {},
  addComment: async () => {},
});

// Mock data for development
const mockReels: Reel[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'johndoe',
    userAvatar: '/default-avatar.png',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: '/reviewfilm.png',
    caption: 'Amazing sunset at the beach! 🌅 #sunset #beach #vacation',
    hashtags: ['sunset', 'beach', 'vacation'],
    likes: 325,
    comments: 14,
    shares: 42,
    isLiked: false,
    isSaved: false,
    createdAt: '2023-04-01T12:00:00Z',
    updatedAt: '2023-04-01T12:00:00Z',
  },
  {
    id: '2',
    userId: 'user2',
    username: 'janesmith',
    userAvatar: '/default-avatar.png',
    videoUrl: 'https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4',
    thumbnailUrl: '/reviewfilm.png',
    caption: 'Cooking my favorite pasta recipe! 🍝 #cooking #food #pasta',
    hashtags: ['cooking', 'food', 'pasta'],
    likes: 189,
    comments: 7,
    shares: 23,
    isLiked: true,
    isSaved: false,
    createdAt: '2023-04-02T15:30:00Z',
    updatedAt: '2023-04-02T15:30:00Z',
  },
  {
    id: '3',
    userId: 'user3',
    username: 'mikejohnson',
    userAvatar: '/default-avatar.png',
    videoUrl: 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4',
    thumbnailUrl: '/reviewfilm.png',
    caption: 'New dance moves! 💃 #dance #music #trending',
    hashtags: ['dance', 'music', 'trending'],
    likes: 567,
    comments: 32,
    shares: 78,
    isLiked: false,
    isSaved: true,
    createdAt: '2023-04-03T09:15:00Z',
    updatedAt: '2023-04-03T09:15:00Z',
  },
];

export function ReelProvider({ children }: { children: ReactNode }) {
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserData();

  // Fetch reels from API
  const fetchReels = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      // const response = await fetch('/api/reels');
      // const data = await response.json();
      
      // For now, use mock data
      setTimeout(() => {
        setReels(mockReels);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to fetch reels');
      setIsLoading(false);
      console.error(err);
    }
  };

  // Like a reel
  const likeReel = async (reelId: string) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/reels/${reelId}/like`, { method: 'POST' });
      
      // Update local state
      setReels(prevReels => 
        prevReels.map(reel => 
          reel.id === reelId 
            ? { 
                ...reel, 
                isLiked: !reel.isLiked,
                likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1
              } 
            : reel
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Save a reel
  const saveReel = async (reelId: string) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/reels/${reelId}/save`, { method: 'POST' });
      
      // Update local state
      setReels(prevReels => 
        prevReels.map(reel => 
          reel.id === reelId 
            ? { ...reel, isSaved: !reel.isSaved } 
            : reel
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Share a reel
  const shareReel = async (reelId: string) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/reels/${reelId}/share`, { method: 'POST' });
      
      // Update local state
      setReels(prevReels => 
        prevReels.map(reel => 
          reel.id === reelId 
            ? { ...reel, shares: reel.shares + 1 } 
            : reel
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Add a comment to a reel
  const addComment = async (reelId: string, content: string) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/reels/${reelId}/comments`, { 
      //   method: 'POST',
      //   body: JSON.stringify({ content })
      // });
      
      // Log the comment for mock data
      console.log(`Adding comment to reel ${reelId}: ${content}`);
      
      // Update local state
      setReels(prevReels => 
        prevReels.map(reel => 
          reel.id === reelId 
            ? { ...reel, comments: reel.comments + 1 } 
            : reel
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch reels on mount
  useEffect(() => {
    if (user) {
      fetchReels();
    }
  }, [user]);

  return (
    <ReelContext.Provider
      value={{
        reels,
        setReels,
        isLoading,
        error,
        fetchReels,
        likeReel,
        saveReel,
        shareReel,
        addComment,
      }}
    >
      {children}
    </ReelContext.Provider>
  );
}

// Custom hook to use the reel context
export function useReelsData() {
  const context = useContext(ReelContext);
  if (context === undefined) {
    throw new Error('useReelsData must be used within a ReelProvider');
  }
  return context;
} 