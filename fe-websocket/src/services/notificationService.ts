import axios from 'axios';

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

export interface Notification {
    id: string;
    userId: string;
    type: string;
    data: {
        followerId: string;
        followerUsername: string;
        followerFullName: string;
        followerAvatar: string;
        timestamp: string;
    };
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

interface BackendResponse {
    notifications: Notification[];
    limit: number;
    page: number;
    total: number;
    totalPages: number;
    success: boolean;
}

class NotificationService {
    private static instance: NotificationService;

    private constructor() {}

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    async getNotifications(): Promise<BackendResponse> {
        const response = await api.get('/notifications');
        return response.data.data;
    }

    async markAsRead(notificationId: string): Promise<void> {
        await api.put(`/notifications/${notificationId}/read`);
    }

    async markAllAsRead(): Promise<void> {
        await api.put('/notifications/read-all');
    }
}

export const notificationService = NotificationService.getInstance(); 