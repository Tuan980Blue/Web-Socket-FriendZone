const { PrismaClient } = require('@prisma/client');

// Tạo Prisma client với cấu hình tối ưu
const prisma = new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

// Xử lý graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

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
            // Kiểm tra user có tồn tại không trước khi xóa
            const userExists = await prisma.user.findUnique({
                where: { id: userId }
            });
            
            if (!userExists) {
                throw new Error('User not found');
            }
            
            return await prisma.$transaction(async (tx) => {
                try {
                    // 1. Xóa tất cả posts của user và related data
                    const posts = await tx.post.findMany({
                        where: { authorId: userId }
                    });
                    
                    for (const post of posts) {
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
                            // Silently handle post-related data deletion errors
                        }
                    }
                    
                    try {
                        await tx.post.deleteMany({
                            where: { authorId: userId }
                        });
                    } catch (postDeleteError) {
                        throw new Error(`Failed to delete posts: ${postDeleteError.message}`);
                    }
                    
                    // 2. Xóa tất cả comments của user
                    try {
                        await tx.comment.deleteMany({
                            where: { authorId: userId }
                        });
                    } catch (commentError) {
                        throw new Error(`Failed to delete comments: ${commentError.message}`);
                    }
                    
                    // 3. Xóa tất cả likes của user
                    try {
                        await tx.like.deleteMany({
                            where: { userId: userId }
                        });
                    } catch (likeError) {
                        throw new Error(`Failed to delete likes: ${likeError.message}`);
                    }
                    
                    // 4. Xóa tất cả stories của user
                    try {
                        await tx.story.deleteMany({
                            where: { authorId: userId }
                        });
                    } catch (storyError) {
                        throw new Error(`Failed to delete stories: ${storyError.message}`);
                    }
                    
                    // 5. Xóa tất cả notifications của user
                    try {
                        await tx.notification.deleteMany({
                            where: { userId: userId }
                        });
                    } catch (notificationError) {
                        throw new Error(`Failed to delete notifications: ${notificationError.message}`);
                    }
                    
                    // 6. Xóa tất cả mentions của user
                    try {
                        await tx.mention.deleteMany({
                            where: { userId: userId }
                        });
                    } catch (mentionError) {
                        throw new Error(`Failed to delete mentions: ${mentionError.message}`);
                    }
                    
                    // 7. Xóa tất cả hashtags của user
                    try {
                        await tx.hashtag.deleteMany({
                            where: { userId: userId }
                        });
                    } catch (hashtagError) {
                        throw new Error(`Failed to delete hashtags: ${hashtagError.message}`);
                    }
                    
                    // 8. Cuối cùng mới xóa user
                    try {
                        await tx.user.delete({
                            where: { id: userId }
                        });
                    } catch (userDeleteError) {
                        throw new Error(`Failed to delete user: ${userDeleteError.message}`);
                    }
                    
                    return { message: 'User and all associated data (posts, comments, likes, stories, notifications, mentions, hashtags) deleted successfully' };
                } catch (txError) {
                    throw txError;
                }
            });
        } catch (error) {
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

    // Method để xóa tất cả posts của một user cụ thể
    async deleteAllUserPosts(userId) {
        try {
            console.log(`🔍 Starting deletion for user ID: ${userId}`);
            
            // Sử dụng transaction với timeout cao hơn và xóa tuần tự để tránh timeout
            const result = await prisma.$transaction(async (tx) => {
                console.log(`🗑️ Deleting user data in transaction for user ID: ${userId}`);
                
                let deletedCounts = {
                    comments: 0,
                    likes: 0,
                    savedPosts: 0,
                    stories: 0,
                    notifications: 0,
                    mentions: 0,
                    hashtags: 0,
                    posts: 0
                };
                
                // Xóa tuần tự để tránh timeout, nhưng vẫn hiệu quả
                try {
                    // 1. Xóa comments của user
                    console.log(`🗑️ Deleting comments for user ID: ${userId}`);
                    const commentsDeleted = await tx.comment.deleteMany({ where: { authorId: userId } });
                    deletedCounts.comments = commentsDeleted.count;
                    console.log(`✅ Deleted ${deletedCounts.comments} comments`);
                    
                    // 2. Xóa likes của user
                    console.log(`🗑️ Deleting likes for user ID: ${userId}`);
                    const likesDeleted = await tx.like.deleteMany({ where: { userId: userId } });
                    deletedCounts.likes = likesDeleted.count;
                    console.log(`✅ Deleted ${deletedCounts.likes} likes`);
                    
                    // 3. Xóa saved posts của user
                    console.log(`🗑️ Deleting saved posts for user ID: ${userId}`);
                    const savedPostsDeleted = await tx.savedPost.deleteMany({ where: { userId: userId } });
                    deletedCounts.savedPosts = savedPostsDeleted.count;
                    console.log(`✅ Deleted ${deletedCounts.savedPosts} saved posts`);
                    
                    // 4. Xóa stories của user
                    console.log(`🗑️ Deleting stories for user ID: ${userId}`);
                    const storiesDeleted = await tx.story.deleteMany({ where: { authorId: userId } });
                    deletedCounts.stories = storiesDeleted.count;
                    console.log(`✅ Deleted ${deletedCounts.stories} stories`);
                    
                    // 5. Xóa notifications của user
                    console.log(`🗑️ Deleting notifications for user ID: ${userId}`);
                    const notificationsDeleted = await tx.notification.deleteMany({ where: { userId: userId } });
                    deletedCounts.notifications = notificationsDeleted.count;
                    console.log(`✅ Deleted ${deletedCounts.notifications} notifications`);
                    
                    // 6. Xóa mentions của user
                    console.log(`🗑️ Deleting mentions for user ID: ${userId}`);
                    const mentionsDeleted = await tx.mention.deleteMany({ where: { userId: userId } });
                    deletedCounts.mentions = mentionsDeleted.count;
                    console.log(`✅ Deleted ${deletedCounts.mentions} mentions`);
                    
                    // 7. Xóa hashtags của user
                    console.log(`🗑️ Deleting hashtags for user ID: ${userId}`);
                    const hashtagsDeleted = await tx.hashtag.deleteMany({ where: { userId: userId } });
                    deletedCounts.hashtags = hashtagsDeleted.count;
                    console.log(`✅ Deleted ${deletedCounts.hashtags} hashtags`);
                    
                    // 8. Xóa posts của user (sẽ tự động xóa comments, likes, savedPosts liên quan)
                    console.log(`🗑️ Deleting posts for user ID: ${userId}`);
                    const postsDeleted = await tx.post.deleteMany({ where: { authorId: userId } });
                    deletedCounts.posts = postsDeleted.count;
                    console.log(`✅ Deleted ${deletedCounts.posts} posts`);
                    
                    // 9. Cuối cùng xóa user
                    console.log(`🗑️ Deleting user ID: ${userId}`);
                    const userDeleted = await tx.user.delete({ where: { id: userId } });
                    console.log(`✅ Deleted user: ${userDeleted.username}`);
                    
                    console.log(`✅ Transaction completed for user ID: ${userId}`);
                    
                    return {
                        message: `Successfully deleted user and all associated data`,
                        deletedUser: userDeleted,
                        deletedPosts: deletedCounts.posts,
                        deletedComments: deletedCounts.comments,
                        deletedLikes: deletedCounts.likes,
                        deletedSavedPosts: deletedCounts.savedPosts,
                        deletedStories: deletedCounts.stories,
                        deletedNotifications: deletedCounts.notifications,
                        deletedMentions: deletedCounts.mentions,
                        deletedHashtags: deletedCounts.hashtags,
                        userId: userId
                    };
                    
                } catch (txError) {
                    console.error(`❌ Transaction error for user ID ${userId}:`, txError);
                    throw txError;
                }
            }, {
                timeout: 6000, // Tăng timeout lên 6 giây
                maxWait: 8000  // Tăng maxWait lên 8 giây
            });
            
            console.log(`🎉 User deletion completed for user ID: ${userId}`);
            return result;
            
        } catch (error) {
            console.error(`❌ Error deleting user ID ${userId}:`, error);
            throw new Error(`Failed to delete user completely: ${error.message}`);
        }
    }

    // Method để tìm tất cả users có email kết thúc bằng domain cụ thể
    async findUsersByEmailDomain(emailSuffix) {
        try {
            console.log(`🔍 Searching for users with email ending in: ${emailSuffix}`);
            
            const users = await prisma.user.findMany({
                where: {
                    email: {
                        endsWith: emailSuffix
                    }
                },
                select: {
                    id: true,
                    email: true,
                    username: true
                }
            });

            console.log(`📊 Found ${users.length} users with email domain: ${emailSuffix}`);
            return users;
        } catch (error) {
            console.error(`❌ Error finding users by email domain:`, error);
            throw new Error(`Failed to find users by email domain: ${error.message}`);
        }
    }
}

module.exports = new AdminService(); 