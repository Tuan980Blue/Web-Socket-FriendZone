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