'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Reel, ReelContextType } from '@/types/reel';
import { useUserData } from './useUserData';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
    userAvatar: '/image-person.png',
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
    userAvatar: '/image-person.png',
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
    userAvatar: '/image-person.png',
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
  {
    id: '4',
    userId: 'user3',
    username: 'mikejohnson',
    userAvatar: '/image-person.png',
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
  {
    id: '5',
    userId: 'user3',
    username: 'mikejohnson',
    userAvatar: '/image-person.png',
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

// API functions
const fetchReelsApi = async (): Promise<Reel[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockReels);
    }, 1000);
  });
};

const likeReelApi = async (reelId: string): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

const saveReelApi = async (reelId: string): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

const shareReelApi = async (reelId: string): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

const addCommentApi = async (reelId: string, content: string): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

export function ReelProvider({ children }: { children: ReactNode }) {
  const { user } = useUserData();
  const queryClient = useQueryClient();

  // Fetch reels query
  const { data: reels = [], isLoading, error } = useQuery({
    queryKey: ['reels'],
    queryFn: fetchReelsApi,
    enabled: !!user,
  });

  // Like reel mutation
  const likeReelMutation = useMutation({
    mutationFn: likeReelApi,
    onSuccess: (_, reelId) => {
      queryClient.setQueryData(['reels'], (oldData: Reel[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(reel =>
          reel.id === reelId
            ? {
                ...reel,
                isLiked: !reel.isLiked,
                likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
              }
            : reel
        );
      });
    },
  });

  // Save reel mutation
  const saveReelMutation = useMutation({
    mutationFn: saveReelApi,
    onSuccess: (_, reelId) => {
      queryClient.setQueryData(['reels'], (oldData: Reel[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(reel =>
          reel.id === reelId
            ? { ...reel, isSaved: !reel.isSaved }
            : reel
        );
      });
    },
  });

  // Share reel mutation
  const shareReelMutation = useMutation({
    mutationFn: shareReelApi,
    onSuccess: (_, reelId) => {
      queryClient.setQueryData(['reels'], (oldData: Reel[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(reel =>
          reel.id === reelId
            ? { ...reel, shares: reel.shares + 1 }
            : reel
        );
      });
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: ({ reelId, content }: { reelId: string; content: string }) =>
      addCommentApi(reelId, content),
    onSuccess: (_, { reelId }) => {
      queryClient.setQueryData(['reels'], (oldData: Reel[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(reel =>
          reel.id === reelId
            ? { ...reel, comments: reel.comments + 1 }
            : reel
        );
      });
    },
  });

  const setReels = (newReels: Reel[]) => {
    queryClient.setQueryData(['reels'], newReels);
  };

  return (
    <ReelContext.Provider
      value={{
        reels,
        setReels,
        isLoading,
        error: error ? 'Failed to fetch reels' : null,
        fetchReels: () => queryClient.invalidateQueries({ queryKey: ['reels'] }),
        likeReel: async (reelId: string) => {
          await likeReelMutation.mutateAsync(reelId);
        },
        saveReel: async (reelId: string) => {
          await saveReelMutation.mutateAsync(reelId);
        },
        shareReel: async (reelId: string) => {
          await shareReelMutation.mutateAsync(reelId);
        },
        addComment: async (reelId: string, content: string) => {
          await addCommentMutation.mutateAsync({ reelId, content });
        },
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