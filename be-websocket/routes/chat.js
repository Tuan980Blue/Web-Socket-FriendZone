const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');
const authMiddleware = require('../middleware/auth');

// Get recent chats
router.get('/recent', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const recentChats = await chatService.getRecentChats(userId);
    res.json({ success: true, data: recentChats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get direct messages with a user
router.get('/direct/:userId', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;
    const { page = 1, limit = 50 } = req.query;
    const messages = await chatService.getDirectMessages(
      currentUserId,
      otherUserId,
      parseInt(page),
      parseInt(limit)
    );
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send a direct message
router.post('/direct/:userId', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const senderId = req.user.id;
    const receiverId = req.params.userId;
    
    if (!content) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const message = await chatService.createMessage(senderId, receiverId, content);
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new chat room
router.post('/rooms', authMiddleware, async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;
    const ownerId = req.user.id;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Chat room name is required' });
    }

    const chatRoom = await chatService.createChatRoom(name, description, ownerId, isPrivate);
    res.json({ success: true, data: chatRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user's chat rooms
router.get('/rooms', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const chatRooms = await chatService.getUserChatRooms(userId);
    res.json({ success: true, data: chatRooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get chat room messages
router.get('/rooms/:roomId/messages', authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const messages = await chatService.getChatRoomMessages(
      roomId,
      parseInt(page),
      parseInt(limit)
    );
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send a message to a chat room
router.post('/rooms/:roomId/messages', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const senderId = req.user.id;
    const chatRoomId = req.params.roomId;
    
    if (!content) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const message = await chatService.createMessage(senderId, null, content, chatRoomId);
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add a member to a chat room
router.post('/rooms/:roomId/members', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const chatRoomId = req.params.roomId;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const member = await chatService.addMemberToChatRoom(userId, chatRoomId);
    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 