import axios from 'axios';
import { Post, PostResponse, CreatePostData } from '@/types/post';

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

export const postService = {
  createPost: async (data: CreatePostData): Promise<Post> => {
    const response = await api.post(`${API_URL}/posts`, data);
    return response.data;
  },

  getPosts: async (page: number = 1, limit: number = 10): Promise<PostResponse> => {
    const response = await api.get(`${API_URL}/posts`, {
      params: { page, limit }
    });
    return response.data;
  },

  getMyPosts: async (page: number = 1, limit: number = 10): Promise<PostResponse> => {
    const response = await api.get(`${API_URL}/posts/me`, {
      params: { page, limit }
    });
    return response.data;
  },

  getUserPosts: async (userId: string, page: number = 1, limit: number = 10): Promise<PostResponse> => {
    const response = await api.get(`${API_URL}/posts/user/${userId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  getPostById: async (id: string): Promise<Post> => {
    const response = await api.get(`${API_URL}/posts/${id}`);
    return response.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(`${API_URL}/posts/${id}`);
  },

  searchPosts: async (query: string, page: number = 1, limit: number = 10): Promise<PostResponse> => {
    const response = await api.get(`${API_URL}/posts/search`, {
      params: { query, page, limit }
    });
    return response.data;
  }
}; 