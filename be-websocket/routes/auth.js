const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const userService = require('../services/userService');
const auth = require('../middleware/auth');

// Google OAuth Login
router.post('/google-login', async (req, res) => {
  try {
    const { email, name, picture, googleId, password } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ error: 'Email and Google ID are required' });
    }

    // Check if user exists
    let user = await userService.findByEmail(email);

    if (!user) {
      // If no password provided for new account, return special response
      if (!password) {
        return res.status(200).json({ 
          requirePassword: true,
          message: 'Please create a password for your account',
          userInfo: {
            email,
            name,
            picture,
            googleId
          }
        });
      }

      // Extract username from email (everything before @)
      const baseUsername = email.split('@')[0];
      
      // Check if username already exists
      let username = baseUsername;
      let isUnique = false;
      let attempts = 0;
      
      while (!isUnique && attempts < 5) {
        const existingUser = await userService.findByUsername(username);
        if (!existingUser) {
          isUnique = true;
        } else {
          // If username exists, append a random number
          username = `${baseUsername}${Math.floor(Math.random() * 1000)}`;
          attempts++;
        }
      }

      if (!isUnique) {
        throw new Error('Could not generate a unique username');
      }

      user = await userService.createUser({
        email,
        username,
        password, // Use provided password instead of googleId
        fullName: name,
        avatar: picture,
        isGoogleAccount: true
      });
    }

    // Update user status to ONLINE
    await userService.updateStatus(user.id, 'ONLINE');

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        gender: user.gender,
        birthDate: user.birthDate,
        avatar: user.avatar,
        status: user.status,
        lastSeen: user.lastSeen,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isPrivate: user.isPrivate,
        website: user.website,
        location: user.location,
        phoneNumber: user.phoneNumber,
        bio: user.bio,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
        postsCount: user.postsCount,
        role: user.role
      },
      token: jwtToken
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(400).json({ error: error.message || 'Google login failed' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      fullName,
      gender,
      birthDate,
    } = req.body;

    // Check if user already exists
    const existingUser = await userService.findByEmail(email) ||
        await userService.findByUsername(username);

    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email or username already exists'
      });
    }

    // Create new user with additional fields
    const user = await userService.createUser({
      username,
      email,
      password,
      fullName,
      gender,
      birthDate: birthDate ? new Date(birthDate) : null,
    });

    // Generate token
    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        gender: user.gender,
        birthDate: user.birthDate,
        avatar: user.avatar,
        status: user.status,
        lastSeen: user.lastSeen,
        createdAt: user.createdAt,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await userService.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update user status to ONLINE
    await userService.updateStatus(user.id, 'ONLINE');

    // Generate token
    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        gender: user.gender,
        birthDate: user.birthDate,
        avatar: user.avatar,
        status: user.status,
        lastSeen: user.lastSeen,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isPrivate: user.isPrivate,
        website: user.website,
        location: user.location,
        phoneNumber: user.phoneNumber,
        bio: user.bio,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
        postsCount: user.postsCount,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    // TODO: Generate reset token and send email
    // For now, just return success
    res.json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await userService.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        gender: user.gender,
        birthDate: user.birthDate,
        avatar: user.avatar,
        status: user.status,
        lastSeen: user.lastSeen,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isPrivate: user.isPrivate,
        website: user.website,
        location: user.location,
        phoneNumber: user.phoneNumber,
        bio: user.bio,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
        postsCount: user.postsCount,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user information
router.put('/update', auth, async (req, res) => {
  try {
    const user = await userService.updateUser(req.user.id, req.body);
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Change Password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Update password with validation
    await userService.updatePassword(req.user.id, newPassword, currentPassword);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    // Handle specific error messages
    if (error.message === 'New password must be different from current password') {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === 'Current password is incorrect') {
      return res.status(401).json({ error: error.message });
    }
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    // Handle validation errors
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 