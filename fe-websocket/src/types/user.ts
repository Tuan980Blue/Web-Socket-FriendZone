export type UserStatus = 'ONLINE' | 'OFFLINE' | 'AWAY' | 'BUSY';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  fullName?: string;
  avatar?: string;
  bio?: string;
  status: UserStatus;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
  website?: string;
  location?: string;
  phoneNumber?: string;
  gender: Gender;
  birthDate?: Date;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  mutualFollowersCount?: number;
  role: UserRole;
}

// Type for user in context and API responses
export type UserInContext = Omit<User, 'password'> & {
  password?: string; // Make password optional
};

export interface UserContextType {
  user: UserInContext | null;
  setUser: (user: UserInContext | null) => void;
  isLoading: boolean;
  error: string | null;
} 