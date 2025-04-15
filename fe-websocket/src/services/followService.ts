import axios from 'axios';
import { User } from '@/types/user';

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

export const followService = {
    getFollowers: async (): Promise<User[]> => {
        const response = await api.get('/follows');
        return response.data.data;
    },

    getFollowing: async (): Promise<User[]> => {
        const response = await api.get('/follows/following');
        return response.data.data;
    },

    getSuggestions: async (): Promise<User[]> => {
        const response = await api.get('/follows/suggestions');
        return response.data.data;
    },

    followUser: async (userId: string): Promise<void> => {
        await api.post(`/follows/follow/${userId}`);
    },

    unfollowUser: async (userId: string): Promise<void> => {
        await api.delete(`/follows/unfollow/${userId}`);
    },

    checkFollowStatus: async (userId: string): Promise<boolean> => {
        const response = await api.get(`/follows/status/${userId}`);
        return response.data.isFollowing;
    },
}; 