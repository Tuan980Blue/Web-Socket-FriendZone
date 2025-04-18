const express = require('express');
const router = express.Router();
const followService = require('../services/followService');
const authMiddleware = require('../middleware/auth');
const prisma = require('../lib/prisma');

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

// Follow user
router.post('/follow/:userId', authMiddleware, async (req, res) => {
    try {
        const followerId = req.user.id;
        const followingId = req.params.userId;

        if (followerId === followingId) {
            return res.status(400).json({ message: 'Cannot follow yourself' });
        }

        // Kiểm tra xem đã follow chưa
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });

        if (existingFollow) {
            return res.status(400).json({ message: 'Already following this user' });
        }

        // Tạo follow relationship và thông báo
        const follow = await followService.followUser(followerId, followingId);
        res.status(201).json(follow);
    } catch (error) {
        console.error('Error in follow route:', error);
        res.status(500).json({ message: 'Error following user', error: error.message });
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