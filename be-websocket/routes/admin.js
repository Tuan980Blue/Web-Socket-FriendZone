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
        const { domain } = req.params;
        
        // Validate domain format
        if (!domain || domain.length < 3) {
            return res.status(400).json({ 
                error: 'Domain must be at least 3 characters long' 
            });
        }

        // Add @ prefix if not provided
        const emailSuffix = domain.startsWith('@') ? domain : `@${domain}`;
        
        // Tìm tất cả users có email kết thúc bằng domain
        const users = await adminService.findUsersByEmailDomain(emailSuffix);
        
        if (users.length === 0) {
            return res.json({
                message: `No users found with email ending in ${emailSuffix}`,
                deletedUsers: 0,
                domain: emailSuffix
            });
        }

        let totalDeletedUsers = 0;
        let failedUsers = [];

        // Xóa song song tất cả users để tăng tốc độ
        const startTime = Date.now();
        
        // Giới hạn số lượng xóa song song để tránh quá tải database
        const batchSize = 3; // Xóa 3 users cùng lúc
        
        for (let i = 0; i < users.length; i += batchSize) {
            const batch = users.slice(i, i + batchSize);
            
            // Tạo array các promises để xóa song song trong batch
            const deletePromises = batch.map(async (user) => {
                try {
                    await adminService.deleteAllUserPosts(user.id);
                    return { success: true, user };
                } catch (userDeleteError) {
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
        }
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        res.json({
            message: `Successfully deleted ${totalDeletedUsers} users with email ending in ${emailSuffix}`,
            totalUsers: users.length,
            totalDeletedUsers,
            domain: emailSuffix,
            processedUsers: users.map(u => ({ id: u.id, email: u.email, username: u.username }))
        });
    } catch (error) {
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

// Delete images by date range from Cloudinary
router.delete('/cloudinary/images/date-range', async (req, res) => {
    try {
        const { 
            start_date, 
            end_date, 
            type = 'upload',
            max_results = 100
        } = req.body;

        if (!start_date || !end_date) {
            return res.status(400).json({ 
                error: 'Both start_date and end_date are required (YYYY-MM-DD format)' 
            });
        }

        const result = await adminService.deleteCloudinaryImagesByDateRange(
            start_date, 
            end_date, 
            type, 
            max_results
        );

        res.json(result);

    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            timestamp: new Date().toISOString(),
            route: '/admin/cloudinary/images/date-range'
        });
    }
});

module.exports = router; 