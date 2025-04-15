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

export interface Notification {
    id: string;
    type: string;
    message: string;
    read: boolean;
    createdAt: string;
    user: {
        id: string;
        username: string;
        avatar: string;
    };
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

    async getNotifications(): Promise<Notification[]> {
        const response = await api.get('/notifications');
        return response.data.data.notifications;
    }

    async markAsRead(notificationId: string): Promise<void> {
        await api.put(`/notifications/${notificationId}/read`);
    }

    async markAllAsRead(): Promise<void> {
        await api.put('/notifications/read-all');
    }
}

export const notificationService = NotificationService.getInstance(); 