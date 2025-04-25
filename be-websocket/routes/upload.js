const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const auth = require('../middleware/auth');
const uploadService = require("../services/uploadService");

// Upload image to Cloudinary
router.post('/upload', auth, upload.single('image'), uploadService.uploadImage);

// Update user avatar
router.put('/user/:userId/avatar', auth, uploadService.updateUserAvatar);

// Update post image
router.put('/post/:postId/image', auth, uploadService.updatePostImage);

module.exports = router; 