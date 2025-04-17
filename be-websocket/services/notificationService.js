const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                data: jsonData,
                isRead: false,
            },
        });
        return notification;
    } catch (error) {
        throw new Error('Error creating notification: ' + error.message);
    }
};

// Tạo thông báo follow
const createFollowNotification = async (followerId, followingId) => {
    try {
        // Lấy thông tin người follow
        const follower = await prisma.user.findUnique({
            where: { id: followerId },
            select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true,
            },
        });

        // Tạo thông báo cho người được follow
        const notification = await createNotification(followingId, 'FOLLOW', {
            followerId,
            followerUsername: follower.username,
            followerFullName: follower.fullName,
            followerAvatar: follower.avatar,
            timestamp: new Date(),
        });

        return notification;
    } catch (error) {
        throw new Error('Error creating follow notification: ' + error.message);
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

        // Ensure data field is valid JSON and handle null values
        const processedNotifications = notifications.map(notification => {
            try {
                // If data is null or empty, set it to an empty object string
                if (!notification.data) {
                    return {
                        ...notification,
                        data: '{}'
                    };
                }
                
                // Try to parse the data to ensure it's valid JSON
                const parsedData = JSON.parse(notification.data);
                return {
                    ...notification,
                    data: JSON.stringify(parsedData)
                };
            } catch (error) {
                // If parsing fails, set data to an empty object string
                return {
                    ...notification,
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
    createFollowNotification,
    markAsRead,
    getUserNotifications,
    getUnreadCount,
}; 