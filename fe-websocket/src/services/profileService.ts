import axios from 'axios';
import { User } from '@/types/user';

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

export class ProfileService {
  getProfileById = async (id: string): Promise<User> => {
    try {
      const response = await api.get(`/users/${id}`);
      const userData = response.data.user;
      
      // Convert string dates to Date objects
      return {
        ...userData,
        lastSeen: new Date(userData.lastSeen),
        createdAt: new Date(userData.createdAt),
        updatedAt: new Date(userData.updatedAt),
        birthDate: userData.birthDate ? new Date(userData.birthDate) : undefined
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new Error('Failed to fetch profile data');
    }
  };

  updateProfile = async (id: string, data: Partial<User>): Promise<User> => {
    try {
      const response = await api.put(`/users/${id}`, data);
      const userData = response.data.user;
      
      return {
        ...userData,
        lastSeen: new Date(userData.lastSeen),
        createdAt: new Date(userData.createdAt),
        updatedAt: new Date(userData.updatedAt),
        birthDate: userData.birthDate ? new Date(userData.birthDate) : undefined
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  };

  updateAvatar = async (id: string, file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.post(`/users/${id}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.avatarUrl;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw new Error('Failed to update avatar');
    }
  };

  updateCover = async (id: string, file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('cover', file);
      
      const response = await api.post(`/users/${id}/cover`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.coverUrl;
    } catch (error) {
      console.error('Error updating cover:', error);
      throw new Error('Failed to update cover');
    }
  };
}

export const profileService = new ProfileService(); 