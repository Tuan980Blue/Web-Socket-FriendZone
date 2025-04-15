import { useState, useCallback, useEffect } from 'react';
import { notificationService, Notification } from '../services/notificationService';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch notifications only when needed
    const fetchNotifications = useCallback(async () => {
        if (notifications.length === 0) {
            setIsLoading(true);
            try {
                const data = await notificationService.getNotifications();
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.read).length);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [notifications.length]);

    // Handle marking notifications as read with optimistic updates
    const handleMarkAsRead = useCallback(async (notificationId: string) => {
        try {
            // Optimistic update
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, read: true }
                        : notification
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));

            await notificationService.markAsRead(notificationId);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            // Revert optimistic update on error
            fetchNotifications();
        }
    }, [fetchNotifications]);

    const handleMarkAllAsRead = useCallback(async () => {
        try {
            // Optimistic update
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, read: true }))
            );
            setUnreadCount(0);

            await notificationService.markAllAsRead();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            // Revert optimistic update on error
            fetchNotifications();
        }
    }, [fetchNotifications]);

    // Add new notification
    const addNotification = useCallback((notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
        if (!notification.read) {
            setUnreadCount(prev => prev + 1);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return {
        notifications,
        isLoading,
        unreadCount,
        handleMarkAsRead,
        handleMarkAllAsRead,
        addNotification,
        refreshNotifications: fetchNotifications
    };
}; 