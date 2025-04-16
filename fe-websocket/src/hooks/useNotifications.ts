import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, Notification } from '../services/notificationService';

// Query keys
const QUERY_KEYS = {
    NOTIFICATIONS: 'notifications',
    UNREAD_COUNT: 'unread-count'
};

export const useNotifications = () => {
    const queryClient = useQueryClient();

    // Fetch notifications
    const { data: notifications = [], isLoading } = useQuery({
        queryKey: [QUERY_KEYS.NOTIFICATIONS],
        queryFn: async () => {
            const response = await notificationService.getNotifications();
            return response.notifications.map(notif => ({
                ...notif,
                data: JSON.parse(notif.data as unknown as string)
            }));
        },
        staleTime: 3 * 60 * 1000, // 3 minutes
    });

    // Calculate unread count
    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Mark notification as read mutation
    const markAsReadMutation = useMutation({
        mutationFn: notificationService.markAsRead,
        onMutate: async (notificationId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });

            // Snapshot the previous value
            const previousNotifications = queryClient.getQueryData<Notification[]>([QUERY_KEYS.NOTIFICATIONS]);

            // Optimistically update notifications
            if (previousNotifications) {
                queryClient.setQueryData<Notification[]>([QUERY_KEYS.NOTIFICATIONS], (old) =>
                    old?.map(notification =>
                        notification.id === notificationId
                            ? { ...notification, isRead: true }
                            : notification
                    )
                );
            }

            return { previousNotifications };
        },
        onError: (err, notificationId, context) => {
            // Revert optimistic update on error
            if (context?.previousNotifications) {
                queryClient.setQueryData([QUERY_KEYS.NOTIFICATIONS], context.previousNotifications);
            }
        },
        onSettled: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
        },
    });

    // Mark all notifications as read mutation
    const markAllAsReadMutation = useMutation({
        mutationFn: notificationService.markAllAsRead,
        onMutate: async () => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });

            // Snapshot the previous value
            const previousNotifications = queryClient.getQueryData<Notification[]>([QUERY_KEYS.NOTIFICATIONS]);

            // Optimistically update notifications
            if (previousNotifications) {
                queryClient.setQueryData<Notification[]>([QUERY_KEYS.NOTIFICATIONS], (old) =>
                    old?.map(notification => ({ ...notification, isRead: true }))
                );
            }

            return { previousNotifications };
        },
        onError: (err, _, context) => {
            // Revert optimistic update on error
            if (context?.previousNotifications) {
                queryClient.setQueryData([QUERY_KEYS.NOTIFICATIONS], context.previousNotifications);
            }
        },
        onSettled: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
        },
    });

    // Add new notification
    const addNotification = (notification: Notification) => {
        const formattedNotification = {
            ...notification,
            data: JSON.parse(notification.data as unknown as string)
        };
        queryClient.setQueryData<Notification[]>([QUERY_KEYS.NOTIFICATIONS], (old) => 
            old ? [formattedNotification, ...old] : [formattedNotification]
        );
    };

    return {
        notifications,
        isLoading,
        unreadCount,
        handleMarkAsRead: markAsReadMutation.mutate,
        handleMarkAllAsRead: markAllAsReadMutation.mutate,
        addNotification,
        refreshNotifications: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] })
    };
}; 