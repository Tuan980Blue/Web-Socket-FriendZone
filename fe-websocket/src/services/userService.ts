import axios from 'axios';
import {Gender, UserStatus} from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface User {
    id: string;
    email: string;
    username: string;
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
}
export const userService = {

};