require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const authRoutes = require('./routes/auth');
const followRoutes = require('./routes/follow');
const notificationRoutes = require('./routes/notification');
const usersRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');
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

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
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
