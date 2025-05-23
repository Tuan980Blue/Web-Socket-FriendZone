import axios from 'axios';
import { Post, PostResponse, CreatePostData, CommentFormData, CommentResponse, CommentsResponse, LikeResponse, LikesResponse } from '@/types/post';
import { notifications } from '@mantine/notifications';

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
    try {
      const response = await api.post(`${API_URL}/posts`, data);
      notifications.show({
        title: 'Tạo bài viết thành công',
        message: 'Bài viết của bạn đã được đăng!',
        color: 'green',
      });
      return response.data;
    } catch (error) {
      notifications.show({
        title: 'Tạo bài viết thất bại',
        message: 'Đã có lỗi xảy ra khi tạo bài viết.',
        color: 'red',
      });
      throw error;
    }
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
    return response.data.data;
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

// Comment services
export const addComment = async (postId: string, data: CommentFormData): Promise<CommentResponse> => {
  const response = await api.post(`${API_URL}/posts/${postId}/comments`, data);
  return response.data;
};

export const editComment = async (commentId: string, data: CommentFormData): Promise<CommentResponse> => {
  const response = await api.put(`${API_URL}/posts/comments/${commentId}`, data);
  return response.data;
};

export const deleteComment = async (commentId: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`${API_URL}/posts/comments/${commentId}`);
  return response.data;
};

export const getPostComments = async (postId: string, page = 1, limit = 10): Promise<CommentsResponse> => {
  const response = await api.get(`${API_URL}/posts/${postId}/comments`, {
    params: { page, limit }
  });
  return response.data;
};

// Like services
export const toggleLike = async (postId: string): Promise<LikeResponse> => {
  const response = await api.post(`${API_URL}/posts/${postId}/like`);
  return response.data;
};

export const getPostLikes = async (postId: string, page = 1, limit = 10): Promise<LikesResponse> => {
  const response = await api.get(`${API_URL}/posts/${postId}/likes`, {
    params: { page, limit }
  });
  return response.data;
}; 