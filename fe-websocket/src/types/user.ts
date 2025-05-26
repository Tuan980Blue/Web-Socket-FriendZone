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

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  error: string | null;
}

export interface UserInContext {
    id: string;
    email: string;
    username: string;
    fullName?: string;
    avatar?: string;
    bio?: string;
    status: UserStatus;
    lastSeen: string;
    createdAt: string;
    updatedAt: string;
    isPrivate: boolean;
    website?: string;
    location?: string;
    phoneNumber?: string;
    gender: Gender;
    birthDate?: string;
    followersCount: number;
    followingCount: number;
    postsCount: number;
    isFollowing?: boolean;
    mutualFollowersCount?: number;
    role: UserRole;
    googleId?: string;
}

export function convertUserInContextToUser(userInContext: UserInContext): User {
    return {
        ...userInContext,
        password: '', // Password is not included in UserInContext
        lastSeen: new Date(userInContext.lastSeen),
        createdAt: new Date(userInContext.createdAt),
        updatedAt: new Date(userInContext.updatedAt),
        birthDate: userInContext.birthDate ? new Date(userInContext.birthDate) : undefined,
    };
} 