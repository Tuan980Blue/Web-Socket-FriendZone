require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const os = require('os');
const path = require('path');
const authRoutes = require('./routes/auth');
const followRoutes = require('./routes/follow');
const notificationRoutes = require('./routes/notification');
const usersRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');
const postRoutes = require('./routes/post');
const otpRoutes = require('./routes/otp');
const SocketService = require('./services/socketService');
const prisma = require('./prisma/client');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const socketService = new SocketService(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/otp', otpRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.code === 'LIMIT_FILE_TYPES') {
    return res.status(422).json({ error: err.message });
  }
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(422).json({ error: 'File too large. Max size is 5MB' });
  }

  if (err.name === 'MulterError') {
    return res.status(422).json({ error: 'File upload error' });
  }

  res.status(500).json({ error: 'Something went wrong!' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Export both app and server
module.exports = { app, server };
