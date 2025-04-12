export interface Reel {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  hashtags?: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReelComment {
  id: string;
  reelId: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReelContextType {
  reels: Reel[];
  setReels: (reels: Reel[]) => void;
  isLoading: boolean;
  error: string | null;
  fetchReels: () => Promise<void>;
  likeReel: (reelId: string) => Promise<void>;
  saveReel: (reelId: string) => Promise<void>;
  shareReel: (reelId: string) => Promise<void>;
  addComment: (reelId: string, content: string) => Promise<void>;
} 