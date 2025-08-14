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
            // 1. Tìm tất cả posts của user
            const posts = await prisma.post.findMany({
                where: { authorId: userId },
                select: { id: true }
            });
            
            if (posts.length === 0) {
                return { 
                    message: 'No posts found for this user ID',
                    deletedPosts: 0,
                    deletedComments: 0,
                    deletedLikes: 0,
                    deletedSavedPosts: 0
                };
            }
            
            let totalCommentsDeleted = 0;
            let totalLikesDeleted = 0;
            let totalSavedPostsDeleted = 0;
            
            // 2. Xóa tất cả comments của các posts này
            try {
                const commentsDeleted = await prisma.comment.deleteMany({
                    where: { 
                        postId: { 
                            in: posts.map(post => post.id) 
                        } 
                    }
                });
                totalCommentsDeleted = commentsDeleted.count;
            } catch (commentError) {
                // Silently handle comment deletion errors
            }
            
            // 3. Xóa tất cả likes của các posts này
            try {
                const likesDeleted = await prisma.like.deleteMany({
                    where: { 
                        postId: { 
                            in: posts.map(post => post.id) 
                        } 
                    }
                });
                totalLikesDeleted = likesDeleted.count;
            } catch (likeError) {
                // Silently handle like deletion errors
            }
            
            // 4. Xóa tất cả saved posts của các posts này
            try {
                const savedPostsDeleted = await prisma.savedPost.deleteMany({
                    where: { 
                        postId: { 
                            in: posts.map(post => post.id) 
                        } 
                    }
                });
                totalSavedPostsDeleted = savedPostsDeleted.count;
            } catch (savedPostError) {
                // Silently handle saved post deletion errors
            }
            
            // 5. Cuối cùng xóa tất cả posts
            let postsDeleted = 0;
            try {
                const postsDeletedResult = await prisma.post.deleteMany({
                    where: { authorId: userId }
                });
                postsDeleted = postsDeletedResult.count;
            } catch (postDeleteError) {
                throw new Error(`Failed to delete posts: ${postDeleteError.message}`);
            }
            
            // 6. Cập nhật postsCount của user về 0 (nếu user tồn tại)
            try {
                await prisma.user.update({
                    where: { id: userId },
                    data: { postsCount: 0 }
                });
            } catch (updateError) {
                // Silently handle user update errors
            }
            
            return { 
                message: `Successfully deleted all posts for user ID: ${userId}`,
                deletedPosts: postsDeleted,
                deletedComments: totalCommentsDeleted,
                deletedLikes: totalLikesDeleted,
                deletedSavedPosts: totalSavedPostsDeleted,
                userId: userId
            };
            
        } catch (error) {
            throw new Error(`Failed to delete all posts for user: ${error.message}`);
        }
    }
}

module.exports = new AdminService(); 