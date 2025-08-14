import axios from 'axios';

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
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  bio: string;
  status: string;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
  isBanned: boolean;
  website: string;
  location: string;
  phoneNumber: string;
  gender: string;
  birthDate: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  role: string;
}

export interface PaginatedUsers {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SystemStatistics {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  bannedUsers: number;
  activeUsers: number;
}

// Thêm interface cho response mới
export interface DeleteUserResponse {
  message: string;
}

class AdminService {
  async getAllUsers(page = 1, limit = 10): Promise<PaginatedUsers> {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getUserById(userId: string): Promise<User> {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  }

  async updateUserInfo(userId: string, userData: Partial<User>): Promise<User> {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  }

  async toggleUserBan(userId: string, ban: boolean): Promise<User> {
    const response = await api.post(`/admin/users/${userId}/ban`, { ban });
    return response.data;
  }

  async deleteUser(userId: string): Promise<DeleteUserResponse> {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  }

  async getSystemStatistics(): Promise<SystemStatistics> {
    const response = await api.get(`/admin/statistics`);
    return response.data;
  }
}

const adminService = new AdminService();
export default adminService; 