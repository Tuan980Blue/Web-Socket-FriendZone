const { PrismaClient } = require('@prisma/client');
const { cloudinary } = require('../config/cloudinary.config');

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
            // Sử dụng transaction với timeout cao hơn và xóa tuần tự để tránh timeout
            const result = await prisma.$transaction(async (tx) => {
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
                    const commentsDeleted = await tx.comment.deleteMany({ where: { authorId: userId } });
                    deletedCounts.comments = commentsDeleted.count;
                    
                    // 2. Xóa likes của user
                    const likesDeleted = await tx.like.deleteMany({ where: { userId: userId } });
                    deletedCounts.likes = likesDeleted.count;
                    
                    // 3. Xóa saved posts của user
                    const savedPostsDeleted = await tx.savedPost.deleteMany({ where: { userId: userId } });
                    deletedCounts.savedPosts = savedPostsDeleted.count;
                    
                    // 4. Xóa stories của user
                    const storiesDeleted = await tx.story.deleteMany({ where: { authorId: userId } });
                    deletedCounts.stories = storiesDeleted.count;
                    
                    // 5. Xóa notifications của user
                    const notificationsDeleted = await tx.notification.deleteMany({ where: { userId: userId } });
                    deletedCounts.notifications = notificationsDeleted.count;
                    
                    // 6. Xóa mentions của user
                    const mentionsDeleted = await tx.mention.deleteMany({ where: { userId: userId } });
                    deletedCounts.mentions = mentionsDeleted.count;
                    
                    // 7. Xóa hashtags của user
                    const hashtagsDeleted = await tx.hashtag.deleteMany({ where: { userId: userId } });
                    deletedCounts.hashtags = hashtagsDeleted.count;
                    
                    // 8. Xóa posts của user (sẽ tự động xóa comments, likes, savedPosts liên quan)
                    const postsDeleted = await tx.post.deleteMany({ where: { authorId: userId } });
                    deletedCounts.posts = postsDeleted.count;
                    
                    // 9. Cuối cùng xóa user
                    const userDeleted = await tx.user.delete({ where: { id: userId } });
                    
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
                    throw txError;
                }
            }, {
                timeout: 6000, // Tăng timeout lên 6 giây
                maxWait: 8000  // Tăng maxWait lên 8 giây
            });
            
            return result;
            
        } catch (error) {
            throw new Error(`Failed to delete user completely: ${error.message}`);
        }
    }

    // Method để tìm tất cả users có email kết thúc bằng domain cụ thể
    async findUsersByEmailDomain(emailSuffix) {
        try {
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

            return users;
        } catch (error) {
            throw new Error(`Failed to find users by email domain: ${error.message}`);
        }
    }

    // Method để xóa ảnh từ Cloudinary theo khoảng thời gian
    // type: 'upload' (default), 'private', 'authenticated', 'fetch', 'multi', 'video', 'audio'
    async deleteCloudinaryImagesByDateRange(startDate, endDate, type = 'upload', maxResults = 100) {
        try {
            // Check Cloudinary configuration
            if (!cloudinary) {
                throw new Error('Cloudinary is not configured');
            }
            
            if (!cloudinary.api) {
                throw new Error('Cloudinary API is not available');
            }
            
            // Check if cloudinary.api.resources is a function
            if (typeof cloudinary.api.resources !== 'function') {
                throw new Error('Cloudinary API resources method is not available');
            }
            
            // Validate date format
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
                throw new Error('Date format must be YYYY-MM-DD');
            }

            // Convert dates to Date objects for comparison
            const startDateTime = new Date(startDate + 'T00:00:00.000Z');
            const endDateTime = new Date(endDate + 'T23:59:59.999Z');
            
            // Validate date range
            if (startDateTime >= endDateTime) {
                throw new Error('Start date must be before end date');
            }

            // Get resources created between dates
            let resources;
            try {
                // Note: Cloudinary API expects 'upload' as type, not 'image'
                const apiParams = {
                    max_results: parseInt(maxResults),
                    start_at: startDate,
                    end_at: endDate
                };
                
                // Only add type if it's not 'image' (use 'upload' instead)
                if (type !== 'image') {
                    apiParams.type = type;
                }
                
                resources = await cloudinary.api.resources(apiParams);
            } catch (apiError) {
                // Try to get more specific error information
                let errorMessage = 'Unknown Cloudinary API error';
                if (apiError.message) {
                    errorMessage = apiError.message;
                } else if (apiError.error && apiError.error.message) {
                    errorMessage = apiError.error.message;
                } else if (typeof apiError === 'string') {
                    errorMessage = apiError;
                }
                
                throw new Error(`Cloudinary API error: ${errorMessage}`);
            }

            if (!resources.resources || resources.resources.length === 0) {
                return {
                    message: 'No resources found in the specified date range',
                    deleted_count: 0,
                    date_range: { start_date: startDate, end_date: endDate }
                };
            }

            // Filter resources by actual creation date to ensure accuracy
            const filteredResources = resources.resources.filter(resource => {
                if (!resource.created_at) {
                    console.warn(`Resource ${resource.public_id} has no created_at field, skipping...`);
                    return false;
                }
                
                const resourceDate = new Date(resource.created_at);
                return resourceDate >= startDateTime && resourceDate <= endDateTime;
            });

            if (filteredResources.length === 0) {
                return {
                    message: 'No resources found with actual creation date in the specified range',
                    date_range: { start_date: startDate, end_date: endDate },
                    total_found: resources.resources.length,
                    filtered_count: 0,
                    deleted_count: 0,
                    note: 'Some resources were found but their creation dates were outside the specified range'
                };
            }

            console.log(`Found ${resources.resources.length} resources from API, ${filteredResources.length} match the date range`);

            // Delete only filtered resources
            let deletedCount = 0;
            let failedDeletions = [];
            let totalBytesFreed = 0;

            const deletePromises = filteredResources.map(async (resource, index) => {
                try {
                    const result = await cloudinary.uploader.destroy(resource.public_id);
                    
                    if (result.result === 'ok') {
                        return { 
                            success: true, 
                            public_id: resource.public_id,
                            bytes: resource.bytes || 0,
                            created_at: resource.created_at
                        };
                    } else {
                        throw new Error(`Failed to delete: ${result.result}`);
                    }
                } catch (error) {
                    return { 
                        success: false, 
                        public_id: resource.public_id,
                        error: error.message,
                        created_at: resource.created_at
                    };
                }
            });

            const results = await Promise.allSettled(deletePromises);
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value.success) {
                    deletedCount++;
                    totalBytesFreed += result.value.bytes;
                } else if (result.status === 'fulfilled' && !result.value.success) {
                    failedDeletions.push(result.value);
                }
            });

            return {
                message: `Successfully deleted ${deletedCount} resources in date range`,
                date_range: { start_date: startDate, end_date: endDate },
                total_found: resources.resources.length,
                filtered_count: filteredResources.length,
                deleted_count: deletedCount,
                failed_count: failedDeletions.length,
                failed_deletions: failedDeletions,
                bytes_freed: totalBytesFreed,
                note: `Only resources with creation date between ${startDate} and ${endDate} were processed`
            };

        } catch (error) {
            throw new Error(`Failed to delete Cloudinary images by date range: ${error.message}`);
        }
    }
}

module.exports = new AdminService(); 