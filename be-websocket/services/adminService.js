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