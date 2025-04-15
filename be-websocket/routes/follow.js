const express = require('express');
const router = express.Router();
const followService = require('../services/followService');
const authMiddleware = require('../middleware/auth');

// Lấy danh sách người đang follow mình (followers)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const followers = await followService.getFollowers(userId);
        res.json({ success: true, data: followers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Lấy danh sách người mình đang follow (following)
router.get('/following', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const following = await followService.getFollowing(userId);
        res.json({ success: true, data: following });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Lấy danh sách gợi ý người dùng để follow
router.get('/suggestions', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const suggestions = await followService.getSuggestions(userId);
        res.json({ success: true, data: suggestions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Follow một người dùng
router.post('/follow/:userId', authMiddleware, async (req, res) => {
    try {
        const followerId = req.user.id;
        const followingId = req.params.userId;

        // Không thể follow chính mình
        if (followerId === followingId) {
            return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
        }

        const follow = await followService.followUser(followerId, followingId);
        res.json({ success: true, data: follow });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Unfollow một người dùng
router.delete('/unfollow/:userId', authMiddleware, async (req, res) => {
    try {
        const followerId = req.user.id;
        const followingId = req.params.userId;
        const unfollow = await followService.unfollowUser(followerId, followingId);
        res.json({ success: true, data: unfollow });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Kiểm tra trạng thái follow
router.get('/status/:userId', authMiddleware, async (req, res) => {
    try {
        const followerId = req.user.id;
        const followingId = req.params.userId;
        const isFollowing = await followService.checkFollowStatus(followerId, followingId);
        res.json({ success: true, data: { isFollowing } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;