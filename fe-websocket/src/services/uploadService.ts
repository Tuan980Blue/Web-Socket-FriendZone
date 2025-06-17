import axios, { AxiosError } from 'axios';
import { User } from '../types/user';

export interface UploadResponse {
  success: boolean;
  secure_url: string;
  public_id: string;
  url?: string;
}

export interface Post {
  id: number;
  content: string;
  image: string | null;
  // Add other post properties as needed
}

export interface UpdateAvatarResponse {
  success: boolean;
  user: User;
}

export interface UpdatePostImageResponse {
  success: boolean;
  post: Post;
}

export interface ErrorResponse {
  error: string;
}

export class UploadError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'UploadError';
  }
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

// Add error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response) {
      const message = error.response.data?.error || 'An error occurred';
      throw new UploadError(message, error.response.status);
    }
    throw new UploadError('Network error');
  }
);

class UploadService {
  async uploadImage(file: File): Promise<UploadResponse> {
    if (!file) {
      throw new UploadError('No file provided');
    }

    if (!file.type.startsWith('image/')) {
      throw new UploadError('File must be an image');
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post<UploadResponse>('/upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof UploadError) {
        throw error;
      }
      throw new UploadError('Failed to upload image');
    }
  }

  async uploadFile(file: File): Promise<UploadResponse> {
    if (!file) {
      throw new UploadError('No file provided');
    }

    // Check if file is image, video, or audio
    const isValidType = file.type.startsWith('image/') || 
                       file.type.startsWith('video/') || 
                       file.type.startsWith('audio/');
    
    if (!isValidType) {
      throw new UploadError('File must be an image, video, or audio');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post<UploadResponse>('/upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Add URL field for compatibility
      return {
        ...response.data,
        url: response.data.secure_url
      };
    } catch (error) {
      if (error instanceof UploadError) {
        throw error;
      }
      throw new UploadError('Failed to upload file');
    }
  }

  async updateUserAvatar(userId: string, secureUrl: string): Promise<UpdateAvatarResponse> {
    if (!userId) {
      throw new UploadError('User ID is required');
    }

    if (!secureUrl) {
      throw new UploadError('Secure URL is required');
    }

    try {
      const response = await api.put<UpdateAvatarResponse>(`/upload/user/${userId}/avatar`, {
        secure_url: secureUrl
      });
      return response.data;
    } catch (error) {
      if (error instanceof UploadError) {
        throw error;
      }
      throw new UploadError('Failed to update avatar');
    }
  }

  async updatePostImage(postId: number, secureUrl: string): Promise<UpdatePostImageResponse> {
    if (!postId) {
      throw new UploadError('Post ID is required');
    }

    if (!secureUrl) {
      throw new UploadError('Secure URL is required');
    }

    try {
      const response = await api.put<UpdatePostImageResponse>(`/upload/post/${postId}/image`, {
        secure_url: secureUrl
      });
      return response.data;
    } catch (error) {
      if (error instanceof UploadError) {
        throw error;
      }
      throw new UploadError('Failed to update post image');
    }
  }
}

export const uploadService = new UploadService(); 