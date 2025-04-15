const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');
const authMiddleware = require('../middleware/auth');

// Lấy danh sách thông báo
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20 } = req.query;
        const notifications = await notificationService.getUserNotifications(userId, parseInt(page), parseInt(limit));
        res.json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Đánh dấu thông báo đã đọc
router.put('/:notificationId/read', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { notificationId } = req.params;
        const notification = await notificationService.markAsRead(notificationId, userId);
        res.json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Lấy số thông báo chưa đọc
router.get('/unread/count', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const count = await notificationService.getUnreadCount(userId);
        res.json({ success: true, data: { count } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router; 