const express = require('express');
const router = express.Router();
const { 
  createStory, 
  getStoriesFeed, 
  getMyStories, 
  getUserStories, 
  getStoryById, 
  deleteStory,
  createHighlight,
  getUserHighlights,
  deleteHighlight,
  likeStory,
  unlikeStory,
  getStoryLikes,
  getStoryViews,
  getMyStoryViews,
  recordStoryView
} = require('../services/storyService');
const auth = require('../middleware/auth');

// Story routes
router.post('/', auth, createStory);
router.get('/feed', auth, getStoriesFeed);
router.get('/me', auth, getMyStories);
router.get('/me/views', auth, getMyStoryViews);
router.get('/user/:userId', getUserStories);

// Story like routes
router.post('/:id/like', auth, likeStory);
router.delete('/:id/like', auth, unlikeStory);
router.get('/:id/likes', auth, getStoryLikes);

// Story view routes
router.post('/:id/view', auth, recordStoryView);
router.get('/:id/views', auth, getStoryViews);

// Story CRUD routes
router.get('/:id', getStoryById);
router.delete('/:id', auth, deleteStory);

// Highlight routes
router.post('/highlights', auth, createHighlight);
router.get('/highlights/:userId', getUserHighlights);
router.delete('/highlights/:id', auth, deleteHighlight);

module.exports = router; 