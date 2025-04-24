const express = require('express');
const router = express.Router();
const adminService = require('../services/adminService');
const adminAuth = require('../middleware/adminAuth');

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// Get all users with pagination
router.get('/users', async (req, res) => {
    try {
        console.log('Request query:', req.query);
        const { page = 1, limit = 10 } = req.query;
        console.log('Parsed params:', { page, limit });
        const parsedPage = parseInt(page);
        const parsedLimit = parseInt(limit);
        console.log('Parsed integers:', { parsedPage, parsedLimit });
        const users = await adminService.getAllUsers(parsedPage, parsedLimit);
        console.log('Service response:', users);
        res.json(users);
    } catch (error) {
        console.error('Error in /users route:', error);
        console.error('Error stack:', error.stack);
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
        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'User not found' });
        }
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
        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'User not found' });
        }
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
        await adminService.deleteUser(userId);
        res.json({ message: 'User deleted successfully' });
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