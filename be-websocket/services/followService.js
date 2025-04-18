const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const notificationService = require('./notificationService');

// Lấy danh sách người đang follow mình (followers)
const getFollowers = async (userId) => {
    try {
        const followers = await prisma.follow.findMany({
            where: {
                followingId: userId,
            },
            include: {
                follower: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        avatar: true,
                        bio: true,
                        status: true,
                        lastSeen: true,
                        followersCount: true,
                    },
                },
            },
        });

        // Get all follower IDs
        const followerIds = followers.map(follow => follow.follower.id);

        // Check if current user is following back each follower
        const followingStatus = await prisma.follow.findMany({
            where: {
                followerId: userId,
                followingId: {
                    in: followerIds
                }
            },
            select: {
                followingId: true
            }
        });

        // Create a map of following status
        const followingMap = new Map(followingStatus.map(f => [f.followingId, true]));

        // Return followers with isFollowing status
        return followers.map(follow => ({
            ...follow.follower,
            isFollowing: followingMap.has(follow.follower.id)
        }));
    } catch (error) {
        throw new Error('Error fetching followers: ' + error.message);
    }
};

// Lấy danh sách người mình đang follow (following)
const getFollowing = async (userId) => {
    try {
        const following = await prisma.follow.findMany({
            where: {
                followerId: userId,
            },
            include: {
                following: {
                    select: {
                        id: true,
                        username: true,
                        fullName: true,
                        avatar: true,
                        bio: true,
                        status: true,
                        lastSeen: true,
                        followersCount: true,
                    },
                },
            },
        });
        return following.map(follow => follow.following);
    } catch (error) {
        throw new Error('Error fetching following: ' + error.message);
    }
};

// Lấy danh sách người chưa follow mình (suggestions)
const getSuggestions = async (userId) => {
    try {
        // Lấy danh sách ID của những người đã follow
        const following = await prisma.follow.findMany({
            where: {
                followerId: userId
            },
            select: {
                followingId: true
            }
        });
        const followingIds = following.map(f => f.followingId);

        // Lấy danh sách người dùng mình chưa follow
        const suggestions = await prisma.user.findMany({
            where: {
                AND: [
                    { id: { not: userId } }, // Không phải chính mình
                    { id: { notIn: [...followingIds] } },
                    {
                        lastSeen: {
                            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
                        }
                    }
                ]
            },
            select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true,
                bio: true,
                status: true,
                lastSeen: true,
                followersCount: true,
                followingCount: true
            },
            orderBy: {
                followersCount: 'desc'
            },
            take: 10
        });

        return suggestions;
    } catch (error) {
        throw new Error('Error fetching suggestions: ' + error.message);
    }
};

// Follow một người dùng
const followUser = async (followerId, followingId) => {
    try {
        // Kiểm tra xem đã follow chưa
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });

        if (existingFollow) {
            throw new Error('Already following this user');
        }

        // Tạo follow mới
        const follow = await prisma.follow.create({
            data: {
                followerId,
                followingId,
            },
        });

        // Cập nhật số lượng followers và following
        await prisma.user.update({
            where: { id: followingId },
            data: { followersCount: { increment: 1 } },
        });

        await prisma.user.update({
            where: { id: followerId },
            data: { followingCount: { increment: 1 } },
        });

        // Tạo thông báo follow
        try {
            // Lấy thông tin người follow
            const follower = await prisma.user.findUnique({
                where: { id: followerId },
                select: {
                    username: true,
                    fullName: true,
                    avatar: true,
                },
            });

            // Tạo thông báo follow sử dụng hàm createNotification
            await notificationService.createNotification(followingId, 'FOLLOW', {
                followerId: followerId,
                followerUsername: follower.username,
                followerFullName: follower.fullName || follower.username,
                followerAvatar: follower.avatar || '/image-person.png',
                timestamp: new Date().toISOString(),
            });
        } catch (notificationError) {
            console.error('Error creating follow notification:', notificationError);
            // Không throw error ở đây vì follow đã thành công
        }

        return follow;
    } catch (error) {
        throw new Error('Error following user: ' + error.message);
    }
};

// Unfollow một người dùng
const unfollowUser = async (followerId, followingId) => {
    try {
        // Kiểm tra xem đã follow chưa
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });

        if (!existingFollow) {
            throw new Error('Not following this user');
        }

        // Xóa follow
        const follow = await prisma.follow.delete({
            where: {
                id: existingFollow.id,
            },
        });

        // Cập nhật số lượng followers và following
        await prisma.user.update({
            where: { id: followingId },
            data: { followersCount: { decrement: 1 } },
        });

        await prisma.user.update({
            where: { id: followerId },
            data: { followingCount: { decrement: 1 } },
        });

        return follow;
    } catch (error) {
        throw new Error('Error unfollowing user: ' + error.message);
    }
};

// Kiểm tra trạng thái follow
const checkFollowStatus = async (followerId, followingId) => {
    try {
        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });

        return !!follow;
    } catch (error) {
        throw new Error('Error checking follow status: ' + error.message);
    }
};

module.exports = {
    getFollowers,
    getFollowing,
    getSuggestions,
    followUser,
    unfollowUser,
    checkFollowStatus,
};