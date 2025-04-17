import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService, Notification } from '../services/notificationService';

// Query keys
const QUERY_KEYS = {
    NOTIFICATIONS: 'notifications',
    UNREAD_COUNT: 'unread-count'
};

export const useNotifications = (page = 1, limit = 20) => {
    const queryClient = useQueryClient();

    // Fetch notifications with pagination
    const { 
        data: notificationsData,
        isLoading,
        error
    } = useQuery({
        queryKey: [QUERY_KEYS.NOTIFICATIONS, page, limit],
        queryFn: async () => {
            const response = await notificationService.getNotifications(page, limit);
            return {
                ...response,
                notifications: response.notifications.map(notif => ({
                    ...notif,
                    data: typeof notif.data === 'string' ? JSON.parse(notif.data) : notif.data
                }))
            };
        },
        staleTime: 3 * 60 * 1000, // 3 minutes
    });

    // Fetch unread count
    const { data: unreadCount = 0 } = useQuery({
        queryKey: [QUERY_KEYS.UNREAD_COUNT],
        queryFn: notificationService.getUnreadCount,
        staleTime: 1 * 60 * 1000, // 1 minute
    });

    // Mark notification as read mutation
    const markAsReadMutation = useMutation({
        mutationFn: notificationService.markAsRead,
        onMutate: async (notificationId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
            await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.UNREAD_COUNT] });

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
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNREAD_COUNT] });
        },
    });

    // Mark all notifications as read mutation
    const markAllAsReadMutation = useMutation({
        mutationFn: notificationService.markAllAsRead,
        onMutate: async () => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
            await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.UNREAD_COUNT] });

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
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNREAD_COUNT] });
        },
    });

    // Add new notification
    const addNotification = (notification: Notification) => {
        const formattedNotification = {
            ...notification,
            data: typeof notification.data === 'string' ? JSON.parse(notification.data) : notification.data
        };
        queryClient.setQueryData<Notification[]>([QUERY_KEYS.NOTIFICATIONS], (old) => 
            old ? [formattedNotification, ...old] : [formattedNotification]
        );
    };

    return {
        notifications: notificationsData?.notifications || [],
        total: notificationsData?.total || 0,
        totalPages: notificationsData?.totalPages || 0,
        currentPage: page,
        limit,
        isLoading,
        error,
        unreadCount,
        handleMarkAsRead: markAsReadMutation.mutate,
        handleMarkAllAsRead: markAllAsReadMutation.mutate,
        addNotification,
        refreshNotifications: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNREAD_COUNT] });
        }
    };
}; 