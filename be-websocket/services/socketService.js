const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const userService = require('./userService');
const chatService = require('./chatService');

class SocketService {
  constructor(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.userSockets = new Map(); // Map to store user-socket connections
    this.messageCache = new Map(); // Map to cache messages
    
    // Thiết lập thời gian sống cho cache (ví dụ: 1 giờ)
    this.CACHE_TTL = 60 * 60 * 1000; // 1 giờ tính bằng milliseconds
    
    // Thiết lập interval để dọn dẹp cache định kỳ
    setInterval(() => this.cleanupCache(), 30 * 60 * 1000); // Dọn dẹp mỗi 30 phút
    
    this.initialize();
  }

  initialize() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userService.findById(decoded.userId);
        
        if (!user) {
          return next(new Error('User not found'));
        }

        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      this.handleConnection(socket);
    });
  }

  handleConnection(socket) {
    const userId = socket.user.id;
    
    // Store socket connection
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId).add(socket);

    // Update user status to ONLINE
    userService.updateStatus(userId, 'ONLINE');

    // Handle direct message
    socket.on('send_message', async (data) => {
      try {
        const { messageId, receiverId, content, chatRoomId } = data;
        const senderId = userId;

        // Kiểm tra xem tin nhắn đã tồn tại chưa bằng cách tìm kiếm trong cache hoặc database
        // Nếu tin nhắn đã tồn tại, bỏ qua việc lưu và chỉ gửi lại cho người nhận
        let message;
        
        // Kiểm tra trong cache trước (nếu có)
        if (this.messageCache && this.messageCache.has(messageId)) {
          message = this.messageCache.get(messageId);
        } else {
          // Nếu không có trong cache, tạo tin nhắn mới
          message = await chatService.createMessage(senderId, receiverId, content, chatRoomId);
          
          // Thêm timestamp vào tin nhắn trước khi lưu vào cache
          message.timestamp = Date.now();
          
          // Lưu vào cache để tránh trùng lặp
          if (this.messageCache) {
            this.messageCache.set(messageId, message);
          }
        }

        // Emit to receiver if online
        if (this.userSockets.has(receiverId)) {
          this.userSockets.get(receiverId).forEach(receiverSocket => {
            receiverSocket.emit('receive_message', message);
          });
        }

        // Emit back to sender
        socket.emit('message_sent', message);

        // If it's a chat room message, emit to all room members
        if (chatRoomId) {
          const chatRoom = await chatService.getChatRoomMessages(chatRoomId);
          chatRoom.members.forEach(member => {
            if (member.userId !== senderId && this.userSockets.has(member.userId)) {
              this.userSockets.get(member.userId).forEach(memberSocket => {
                memberSocket.emit('receive_message', message);
              });
            }
          });
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle typing status
    socket.on('typing', (data) => {
      const { receiverId, isTyping } = data;
      if (this.userSockets.has(receiverId)) {
        this.userSockets.get(receiverId).forEach(receiverSocket => {
          receiverSocket.emit('user_typing', {
            userId,
            isTyping
          });
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      // Remove socket from user's sockets
      this.userSockets.get(userId).delete(socket);
      
      // If user has no more active sockets, update status to OFFLINE
      if (this.userSockets.get(userId).size === 0) {
        this.userSockets.delete(userId);
        await userService.updateStatus(userId, 'OFFLINE');
      }
    });
  }

  // Method to emit to specific user
  emitToUser(userId, event, data) {
    if (this.userSockets.has(userId)) {
      this.userSockets.get(userId).forEach(socket => {
        socket.emit(event, data);
      });
    }
  }

  // Method to emit to all users
  emitToAll(event, data) {
    this.io.emit(event, data);
  }

  // Method to emit to all users except sender
  emitToAllExcept(senderId, event, data) {
    socket.broadcast.emit(event, data);
  }

  // Phương thức để dọn dẹp cache
  cleanupCache() {
    const now = Date.now();
    for (const [messageId, message] of this.messageCache.entries()) {
      // Nếu tin nhắn đã tồn tại quá lâu, xóa khỏi cache
      if (now - message.timestamp > this.CACHE_TTL) {
        this.messageCache.delete(messageId);
      }
    }
  }
}

module.exports = SocketService; 