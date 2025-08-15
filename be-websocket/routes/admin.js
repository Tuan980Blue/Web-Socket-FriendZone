const express = require('express');
const router = express.Router();
const adminService = require('../services/adminService');
const adminAuth = require('../middleware/adminAuth');

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// Get all users with pagination
router.get('/users', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);

        const users = await adminService.getAllUsers(parsedPage, parsedLimit);

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete users by email domain suffix
router.delete('/users/email-domain/:domain', async (req, res) => {
    try {
        console.log('🚀 Starting delete users by email domain process...');
        const { domain } = req.params;
        console.log(`📧 Domain received: ${domain}`);
        
        // Validate domain format
        if (!domain || domain.length < 3) {
            console.log('❌ Domain validation failed: too short');
            return res.status(400).json({ 
                error: 'Domain must be at least 3 characters long' 
            });
        }
        console.log('✅ Domain validation passed');

        // Add @ prefix if not provided
        const emailSuffix = domain.startsWith('@') ? domain : `@${domain}`;
        console.log(`🔧 Email suffix formatted: ${emailSuffix}`);
        
        // Tìm tất cả users có email kết thúc bằng domain
        console.log('🔍 Searching for users with email domain...');
        const users = await adminService.findUsersByEmailDomain(emailSuffix);
        console.log(`📊 Found ${users.length} users with email domain: ${emailSuffix}`);
        
        if (users.length === 0) {
            console.log('ℹ️ No users found to delete');
            return res.json({
                message: `No users found with email ending in ${emailSuffix}`,
                deletedUsers: 0,
                domain: emailSuffix
            });
        }

        console.log('👥 Users to be deleted:', users.map(u => ({ id: u.id, email: u.email, username: u.username })));
        let totalDeletedUsers = 0;
        let failedUsers = [];

        // Xóa song song tất cả users để tăng tốc độ
        console.log('🗑️ Starting parallel deletion process...');
        const startTime = Date.now();
        
        // Giới hạn số lượng xóa song song để tránh quá tải database
        const batchSize = 3; // Xóa 3 users cùng lúc
        
        for (let i = 0; i < users.length; i += batchSize) {
            const batch = users.slice(i, i + batchSize);
            console.log(`🔄 Processing batch ${Math.floor(i/batchSize) + 1}: ${batch.length} users`);
            
            // Tạo array các promises để xóa song song trong batch
            const deletePromises = batch.map(async (user) => {
                try {
                    console.log(`🔄 Starting deletion of user: ${user.username} (${user.email}) - ID: ${user.id}`);
                    await adminService.deleteAllUserPosts(user.id);
                    console.log(`✅ Successfully deleted user: ${user.username} (${user.email})`);
                    return { success: true, user };
                } catch (userDeleteError) {
                    console.error(`❌ Failed to delete user ${user.id}:`, userDeleteError.message);
                    failedUsers.push({ user, error: userDeleteError.message });
                    return { success: false, user, error: userDeleteError.message };
                }
            });

            // Chờ batch này hoàn thành trước khi xử lý batch tiếp theo
            const batchResults = await Promise.allSettled(deletePromises);
            
            // Đếm số lượng thành công trong batch này
            const batchSuccessCount = batchResults.filter(result => 
                result.status === 'fulfilled' && result.value.success
            ).length;
            
            totalDeletedUsers += batchSuccessCount;
            console.log(`✅ Batch ${Math.floor(i/batchSize) + 1} completed: ${batchSuccessCount}/${batch.length} users deleted`);
        }
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`⏱️ Deletion completed in ${duration}ms`);
        console.log(`🎉 Deletion process completed! Total deleted: ${totalDeletedUsers}/${users.length}`);
        
        if (failedUsers.length > 0) {
            console.log(`⚠️ Failed to delete ${failedUsers.length} users:`, failedUsers);
        }
        
        console.log(`🎉 Deletion process completed! Total deleted: ${totalDeletedUsers}/${users.length}`);
        res.json({
            message: `Successfully deleted ${totalDeletedUsers} users with email ending in ${emailSuffix}`,
            totalUsers: users.length,
            totalDeletedUsers,
            domain: emailSuffix,
            processedUsers: users.map(u => ({ id: u.id, email: u.email, username: u.username }))
        });
    } catch (error) {
        console.error('💥 Error in delete users by domain process:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user by ID
router.get('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await adminService.getUserById(userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user information
router.put('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const userData = req.body;
        const updatedUser = await adminService.updateUserInfo(userId, userData);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ban/Unban user
router.post('/users/:userId/ban', async (req, res) => {
    try {
        const { userId } = req.params;
        const { ban } = req.body;
        const result = await adminService.toggleUserBan(userId, ban);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user
router.delete('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await adminService.deleteUserCompletely(userId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete all posts of a specific user
router.delete('/users/:userId/posts', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await adminService.deleteAllUserPosts(userId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get system statistics
router.get('/statistics', async (req, res) => {
    try {
        const stats = await adminService.getSystemStatistics();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 