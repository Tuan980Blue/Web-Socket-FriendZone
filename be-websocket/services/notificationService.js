const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Hàm tạo nội dung thông báo
const generateNotificationContent = (type, data) => {
    try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        
        switch (type) {
            case 'FOLLOW':
                return `${parsedData.followerFullName || parsedData.followerUsername} đã follow bạn`;
            case 'LIKE':
                return `${parsedData.likerFullName || parsedData.likerUsername} đã thích bài viết của bạn`;
            case 'COMMENT':
                return `${parsedData.commenterFullName || parsedData.commenterUsername} đã bình luận về bài viết của bạn`;
            case 'MENTION':
                return `${parsedData.mentionerFullName || parsedData.mentionerUsername} đã nhắc đến bạn trong một bài viết`;
            case 'TAG':
                return `${parsedData.taggerFullName || parsedData.taggerUsername} đã gắn thẻ bạn trong một bài viết`;
            case 'STORY_VIEW':
                return `${parsedData.viewerFullName || parsedData.viewerUsername} đã xem story của bạn`;
            case 'STORY_REACTION':
                return `${parsedData.reactorFullName || parsedData.reactorUsername} đã phản ứng với story của bạn`;
            default:
                return 'Bạn có thông báo mới';
        }
    } catch (error) {
        console.error('Error generating notification content:', error);
        return 'Bạn có thông báo mới';
    }
};

// Tạo thông báo mới
const createNotification = async (userId, type, data) => {
    try {
        // Ensure data is valid JSON
        let jsonData;
        if (typeof data === 'string') {
            try {
                // If data is already a string, try to parse it to ensure it's valid JSON
                JSON.parse(data);
                jsonData = data;
            } catch (error) {
                // If parsing fails, stringify the data
                jsonData = JSON.stringify(data || {});
            }
        } else {
            // If data is an object, stringify it
            jsonData = JSON.stringify(data || {});
        }

        // Generate content based on type and data
        const content = generateNotificationContent(type, jsonData);

        // Create notification with only the fields that are defined in the Prisma schema
        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                content,
                data: jsonData,
                isRead: false,
            },
        });
        
        return notification;
    } catch (error) {
        throw new Error('Error creating notification: ' + error.message);
    }
};

// Đánh dấu thông báo đã đọc
const markAsRead = async (notificationId, userId) => {
    try {
        const notification = await prisma.notification.update({
            where: {
                id: notificationId,
                userId,
            },
            data: {
                isRead: true,
            },
        });
        return notification;
    } catch (error) {
        throw new Error('Error marking notification as read: ' + error.message);
    }
};

// Lấy danh sách thông báo của user
const getUserNotifications = async (userId, page = 1, limit = 20) => {
    try {
        const skip = (page - 1) * limit;
        const notifications = await prisma.notification.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take: limit,
        });

        // Process notifications to ensure both content and data are valid
        const processedNotifications = notifications.map(notification => {
            try {
                // Handle content field
                const content = notification.content || generateNotificationContent(notification.type, notification.data);

                // Handle data field
                let data = '{}';
                if (notification.data) {
                    try {
                        // Try to parse the data to ensure it's valid JSON
                        const parsedData = JSON.parse(notification.data);
                        data = JSON.stringify(parsedData);
                    } catch (error) {
                        console.error('Error parsing notification data:', error);
                        data = '{}';
                    }
                }

                return {
                    ...notification,
                    content,
                    data
                };
            } catch (error) {
                console.error('Error processing notification:', error);
                return {
                    ...notification,
                    content: 'Bạn có thông báo mới',
                    data: '{}'
                };
            }
        });

        const total = await prisma.notification.count({
            where: {
                userId,
            },
        });

        return {
            notifications: processedNotifications,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    } catch (error) {
        console.error('Error in getUserNotifications:', error);
        throw new Error('Error fetching notifications: ' + error.message);
    }
};

// Đếm số thông báo chưa đọc
const getUnreadCount = async (userId) => {
    try {
        const count = await prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });
        return count;
    } catch (error) {
        throw new Error('Error counting unread notifications: ' + error.message);
    }
};

module.exports = {
    createNotification,
    markAsRead,
    getUserNotifications,
    getUnreadCount,
}; 