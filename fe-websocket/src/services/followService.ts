import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
    username: string;
    fullName: string;
    avatar: string;
    bio: string;
    status: string;
    lastSeen: string;
    followersCount: number;
    followingCount: number;
    mutualFollowersCount?: number;
    isFollowing?: boolean;
}

class FollowService {
    private static instance: FollowService;

    private constructor() {}

    public static getInstance(): FollowService {
        if (!FollowService.instance) {
            FollowService.instance = new FollowService();
        }
        return FollowService.instance;
    }

    async getFollowers(): Promise<User[]> {
        const response = await api.get('/follows');
        return response.data.data;
    }

    async getFollowing(): Promise<User[]> {
        const response = await api.get('/follows/following');
        return response.data.data;
    }

    async getSuggestions(): Promise<User[]> {
        const response = await api.get('/follows/suggestions');
        return response.data.data;
    }

    async followUser(userId: string): Promise<void> {
        await api.post(`/follows/follow/${userId}`);
    }

    async unfollowUser(userId: string): Promise<void> {
        await api.delete(`/follows/unfollow/${userId}`);
    }
}

export const followService = FollowService.getInstance(); 