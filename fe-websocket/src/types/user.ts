export type UserStatus = 'ONLINE' | 'OFFLINE' | 'AWAY' | 'BUSY';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

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
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  error: string | null;
} 