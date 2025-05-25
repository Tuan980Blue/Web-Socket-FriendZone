import axios, { AxiosError } from 'axios';
import {Gender, User} from "@/types/user";

export type { User };

interface ErrorResponse {
    error: string;
}

interface ApiResponse<T> {
    data: T;
    user: User;
    pagination?: {
        total: number;
        pages: number;
    };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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

export interface UpdateProfileData {
    fullName?: string;
    username?: string;
    bio?: string;
    website?: string;
    location?: string;
    phoneNumber?: string;
    gender?: Gender;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

export const userService = {
    getUserById: async (userId: string): Promise<User | null> => {
        try {
            const response = await api.get<ApiResponse<User>>(`/users/${userId}`);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<ErrorResponse>;
            console.error('Error fetching user:', error);
            return null;
        }
    },
    
    searchUsers: async (query: string): Promise<User[]> => {
        try {
            const response = await api.get<ApiResponse<User[]>>(`/users/search?q=${encodeURIComponent(query)}`);
            return response.data.data;
        } catch (err) {
            const error = err as AxiosError<ErrorResponse>;
            console.error('Error searching users:', error);
            return [];
        }
    },

    updateProfile: async (userId: string, data: UpdateProfileData): Promise<User> => {
        try {
            const response = await api.put<ApiResponse<User>>(`/auth/update`, data);
            if (!response.data.user) {
                throw new Error('User data not found in response');
            }
            return response.data.user;
        } catch (err) {
            const error = err as AxiosError<ErrorResponse>;
            console.error('Error updating profile:', error);
            throw new Error(error.response?.data?.error || error.message || 'Failed to update profile');
        }
    },

    uploadAvatar: async (userId: string, file: File): Promise<User> => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await api.post<ApiResponse<User>>(`/users/${userId}/avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (!response.data.user) {
                throw new Error('User data not found in response');
            }
            return response.data.user;
        } catch (err) {
            const error = err as AxiosError<ErrorResponse>;
            console.error('Error uploading avatar:', error);
            throw new Error(error.response?.data?.error || error.message || 'Failed to upload avatar');
        }
    },

    changePassword: async (data: ChangePasswordData): Promise<void> => {
        try {
            await api.post('/auth/change-password', data);
        } catch (error: any) {
            console.error('Error changing password:', error);
            throw new Error(error.response?.data?.error || 'Failed to change password');
        }
    }
};