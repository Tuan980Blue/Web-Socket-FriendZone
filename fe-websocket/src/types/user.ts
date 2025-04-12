export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  isOnline?: boolean;
  privacy?: 'public' | 'friends' | 'private';
  createdAt: string;
  updatedAt: string;
  // Add other user properties as needed
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  error: string | null;
} 