const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AdminService {
    async getAllUsers(page, limit) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip: skip,
                take: parseInt(limit),
                select: {
                    id: true,
                    avatar: true,
                    username: true,
                    email: true,
                    fullName: true,
                    createdAt: true,
                    isBanned: true,
                    role: true
                }
            }),
            prisma.user.count()
        ]);

        return {
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async deleteUser(userId) {
        return prisma.user.delete({
            where: { id: userId }
        });
    }

    // Method mới để xóa user hoàn toàn với tất cả dữ liệu liên quan
    async deleteUserCompletely(userId) {
        try {
            console.log(`🔄 Starting complete deletion for user: ${userId}`);
            
            // Kiểm tra user có tồn tại không trước khi xóa
            const userExists = await prisma.user.findUnique({
                where: { id: userId }
            });
            
            if (!userExists) {
                throw new Error('User not found');
            }
            
            console.log(`👤 User found: ${userExists.username}`);
            
            return await prisma.$transaction(async (tx) => {
                try {
                    console.log(`📝 Step 1: Finding posts for user ${userId}`);
                    // 1. Xóa tất cả posts của user và related data
                    const posts = await tx.post.findMany({
                        where: { authorId: userId }
                    });
                    
                    console.log(`📝 Found ${posts.length} posts to delete`);
                    
                    for (const post of posts) {
                        console.log(`🗑️ Deleting related data for post: ${post.id}`);
                        try {
                            await tx.comment.deleteMany({
                                where: { postId: post.id }
                            });
                            
                            await tx.like.deleteMany({
                                where: { postId: post.id }
                            });
                            
                            await tx.savedPost.deleteMany({
                                where: { postId: post.id }
                            });
                        } catch (postError) {
                            console.warn(`⚠️ Warning: Could not delete some related data for post ${post.id}:`, postError.message);
                        }
                    }
                    
                    console.log(`📝 Step 2: Deleting ${posts.length} posts`);
                    try {
                        await tx.post.deleteMany({
                            where: { authorId: userId }
                        });
                    } catch (postDeleteError) {
                        console.error(`❌ Error deleting posts:`, postDeleteError);
                        throw new Error(`Failed to delete posts: ${postDeleteError.message}`);
                    }
                    
                    console.log(`💬 Step 3: Deleting comments for user ${userId}`);
                    // 2. Xóa tất cả comments của user
                    try {
                        const commentsDeleted = await tx.comment.deleteMany({
                            where: { authorId: userId }
                        });
                        console.log(`💬 Deleted ${commentsDeleted.count} comments`);
                    } catch (commentError) {
                        console.error(`❌ Error deleting comments:`, commentError);
                        throw new Error(`Failed to delete comments: ${commentError.message}`);
                    }
                    
                    console.log(`👍 Step 4: Deleting likes for user ${userId}`);
                    // 3. Xóa tất cả likes của user
                    try {
                        const likesDeleted = await tx.like.deleteMany({
                            where: { userId: userId }
                        });
                        console.log(`👍 Deleted ${likesDeleted.count} likes`);
                    } catch (likeError) {
                        console.error(`❌ Error deleting likes:`, likeError);
                        throw new Error(`Failed to delete likes: ${likeError.message}`);
                    }
                    
                    console.log(`📱 Step 5: Deleting stories for user ${userId}`);
                    // 4. Xóa tất cả stories của user
                    try {
                        const storiesDeleted = await tx.story.deleteMany({
                            where: { authorId: userId }
                        });
                        console.log(`📱 Deleted ${storiesDeleted.count} stories`);
                    } catch (storyError) {
                        console.error(`❌ Error deleting stories:`, storyError);
                        throw new Error(`Failed to delete stories: ${storyError.message}`);
                    }
                    
                    console.log(`🔔 Step 6: Deleting notifications for user ${userId}`);
                    // 5. Xóa tất cả notifications của user
                    try {
                        const notificationsDeleted = await tx.notification.deleteMany({
                            where: { userId: userId }
                        });
                        console.log(`🔔 Deleted ${notificationsDeleted.count} notifications`);
                    } catch (notificationError) {
                        console.error(`❌ Error deleting notifications:`, notificationError);
                        throw new Error(`Failed to delete notifications: ${notificationError.message}`);
                    }
                    
                    console.log(`📝 Step 7: Deleting mentions for user ${userId}`);
                    // 6. Xóa tất cả mentions của user
                    try {
                        const mentionsDeleted = await tx.mention.deleteMany({
                            where: { userId: userId }
                        });
                        console.log(`📝 Deleted ${mentionsDeleted.count} mentions`);
                    } catch (mentionError) {
                        console.error(`❌ Error deleting mentions:`, mentionError);
                        throw new Error(`Failed to delete mentions: ${mentionError.message}`);
                    }
                    
                    console.log(`🏷️ Step 8: Deleting hashtags for user ${userId}`);
                    // 7. Xóa tất cả hashtags của user
                    try {
                        const hashtagsDeleted = await tx.hashtag.deleteMany({
                            where: { userId: userId }
                        });
                        console.log(`🏷️ Deleted ${hashtagsDeleted.count} hashtags`);
                    } catch (hashtagError) {
                        console.error(`❌ Error deleting hashtags:`, hashtagError);
                        throw new Error(`Failed to delete hashtags: ${hashtagError.message}`);
                    }
                    
                    console.log(`👤 Step 9: Deleting user ${userId}`);
                    // 8. Cuối cùng mới xóa user
                    try {
                        await tx.user.delete({
                            where: { id: userId }
                        });
                    } catch (userDeleteError) {
                        console.error(`❌ Error deleting user:`, userDeleteError);
                        throw new Error(`Failed to delete user: ${userDeleteError.message}`);
                    }
                    
                    console.log(`✅ Successfully deleted user ${userId} and all associated data`);
                    return { message: 'User and all associated data (posts, comments, likes, stories, notifications, mentions, hashtags) deleted successfully' };
                } catch (txError) {
                    console.error(`❌ Transaction error:`, txError);
                    throw txError;
                }
            });
        } catch (error) {
            console.error(`❌ Error deleting user ${userId}:`, error);
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }

    async updateUserInfo(userId, userData) {
        // Extract only the fields that are allowed to be updated
        const allowedFields = [
            'username', 
            'email', 
            'fullName', 
            'avatar', 
            'bio', 
            'isPrivate', 
            'website', 
            'location', 
            'phoneNumber', 
            'gender', 
            'birthDate',
            'role',
            'isBanned'
        ];
        
        // Filter out any fields that are not in the allowed list
        const filteredData = {};
        for (const key in userData) {
            if (allowedFields.includes(key)) {
                filteredData[key] = userData[key];
            }
        }
        
        // Update the user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: filteredData,
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                avatar: true,
                bio: true,
                isPrivate: true,
                website: true,
                location: true,
                phoneNumber: true,
                gender: true,
                birthDate: true,
                role: true,
                isBanned: true,
                createdAt: true,
                updatedAt: true
            }
        });
        
        return updatedUser;
    }

    async getUserById(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                avatar: true,
                bio: true,
                status: true,
                lastSeen: true,
                createdAt: true,
                updatedAt: true,
                isPrivate: true,
                isBanned: true,
                website: true,
                location: true,
                phoneNumber: true,
                gender: true,
                birthDate: true,
                followersCount: true,
                followingCount: true,
                postsCount: true,
                role: true
            }
        });
        
        if (!user) {
            throw new Error('User not found');
        }
        
        return user;
    }

    async getSystemStatistics() {
        const [
            totalUsers,
            totalPosts,
            totalComments,
            bannedUsers
        ] = await Promise.all([
            prisma.user.count(),
            prisma.post.count(),
            prisma.comment.count(),
            prisma.user.count({
                where: { isBanned: true }
            })
        ]);

        return {
            totalUsers,
            totalPosts,
            totalComments,
            bannedUsers,
            activeUsers: totalUsers - bannedUsers
        };
    }

    async toggleUserBan(userId, ban) {
        return prisma.user.update({
            where: { id: userId },
            data: { isBanned: ban }
        });
    }
}

module.exports = new AdminService(); 