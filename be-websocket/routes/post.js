const express = require('express');
const router = express.Router();
const { createPost, getPostById, deletePost, getPosts, searchPosts, getMyPosts, getUserPosts } = require('../services/postService');
const auth = require('../middleware/auth');

// Create a new post
router.post('/', auth, createPost);

// Get posts with pagination
router.get('/', getPosts);

// Get my posts
router.get('/me', auth, getMyPosts);

// Get posts of a specific user
router.get('/user/:userId', getUserPosts);

// Search posts
router.get('/search', searchPosts);

// Get post by ID
router.get('/:id', getPostById);

// Delete a post
router.delete('/:id', auth, deletePost);

module.exports = router; 