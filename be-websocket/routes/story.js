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
  addStoriesToHighlight,
  removeStoriesFromHighlight,
  updateHighlight,
  getHighlightById,
  likeStory,
  unlikeStory,
  getStoryLikes,
  getStoryViews,
  getMyStoryViews,
  recordStoryView
} = require('../services/storyService');
const auth = require('../middleware/auth');

// Story routes - Specific routes first
router.post('/', auth, createStory);
router.get('/feed', auth, getStoriesFeed);
router.get('/my', auth, getMyStories);
router.get('/my/views', auth, getMyStoryViews);
router.get('/user/:userId', getUserStories);

// Highlight routes - Specific routes first
router.post('/highlights', auth, createHighlight);
router.get('/highlights/:userId', getUserHighlights);
router.get('/highlights/detail/:id', getHighlightById);
router.put('/highlights/:id', auth, updateHighlight);
router.post('/highlights/:id/add-stories', auth, addStoriesToHighlight);
router.post('/highlights/:id/remove-stories', auth, removeStoriesFromHighlight);
router.delete('/highlights/:id', auth, deleteHighlight);

// Story interactions with ID parameter - These must come after specific routes
router.get('/:id', getStoryById);
router.delete('/:id', auth, deleteStory);
router.post('/:id/like', auth, likeStory);
router.delete('/:id/like', auth, unlikeStory);
router.get('/:id/likes', auth, getStoryLikes);
router.get('/:id/views', auth, getStoryViews);
router.post('/:id/view', auth, recordStoryView);

module.exports = router; 