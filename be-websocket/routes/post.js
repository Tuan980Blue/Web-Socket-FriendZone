const express = require('express');
const router = express.Router();
const { 
  createPost, 
  getPostById, 
  deletePost, 
  getPosts, 
  searchPosts, 
  getMyPosts, 
  getUserPosts,
  addComment,
  deleteComment,
  getPostComments,
  editComment,
  toggleLike,
  getPostLikes
} = require('../services/postService');
const auth = require('../middleware/auth');

// Post routes
router.post('/', auth, createPost);
router.get('/', getPosts);
router.get('/search', searchPosts);
router.get('/me', auth, getMyPosts);
router.get('/user/:userId', getUserPosts);
router.get('/:id', getPostById);
router.delete('/:id', auth, deletePost);

// Comment routes
router.post('/:postId/comments', auth, addComment);
router.put('/comments/:commentId', auth, editComment);
router.delete('/comments/:commentId', auth, deleteComment);
router.get('/:postId/comments', getPostComments);

// Like routes
router.post('/:postId/like', auth, toggleLike);
router.get('/:postId/likes', getPostLikes);

module.exports = router; 