const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new message
const createMessage = async (senderId, receiverId, content, chatRoomId = null) => {
  try {
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        chatRoomId
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
            fullName: true
          }
        },
        receiver: {
          select: {
            id: true,
            username: true,
            avatar: true,
            fullName: true
          }
        }
      }
    });
    return message;
  } catch (error) {
    throw new Error('Error creating message: ' + error.message);
  }
};

// Get chat history between two users
const getDirectMessages = async (userId1, userId2, page = 1, limit = 50) => {
  try {
    const skip = (page - 1) * limit;
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 }
        ],
        chatRoomId: null // Only direct messages
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
            fullName: true
          }
        },
        receiver: {
          select: {
            id: true,
            username: true,
            avatar: true,
            fullName: true
          }
        }
      },
      skip,
      take: limit
    });

    const total = await prisma.message.count({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 }
        ],
        chatRoomId: null
      }
    });

    return {
      messages: messages.reverse(), // Return in chronological order
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    throw new Error('Error fetching messages: ' + error.message);
  }
};

// Create a new chat room
const createChatRoom = async (name, description, ownerId, isPrivate = false) => {
  try {
    const chatRoom = await prisma.chatRoom.create({
      data: {
        name,
        description,
        ownerId,
        isPrivate,
        members: {
          create: {
            userId: ownerId // Add owner as first member
          }
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            avatar: true,
            fullName: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                fullName: true
              }
            }
          }
        }
      }
    });
    return chatRoom;
  } catch (error) {
    throw new Error('Error creating chat room: ' + error.message);
  }
};

// Add member to chat room
const addMemberToChatRoom = async (userId, chatRoomId) => {
  try {
    const member = await prisma.chatRoomMember.create({
      data: {
        userId,
        chatRoomId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            fullName: true
          }
        },
        chatRoom: true
      }
    });
    return member;
  } catch (error) {
    throw new Error('Error adding member to chat room: ' + error.message);
  }
};

// Get chat room messages
const getChatRoomMessages = async (chatRoomId, page = 1, limit = 50) => {
  try {
    const skip = (page - 1) * limit;
    const messages = await prisma.message.findMany({
      where: {
        chatRoomId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
            fullName: true
          }
        }
      },
      skip,
      take: limit
    });

    const total = await prisma.message.count({
      where: {
        chatRoomId
      }
    });

    return {
      messages: messages.reverse(), // Return in chronological order
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    throw new Error('Error fetching chat room messages: ' + error.message);
  }
};

// Get user's chat rooms
const getUserChatRooms = async (userId) => {
  try {
    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        members: {
          some: {
            userId
          }
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            avatar: true,
            fullName: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                fullName: true
              }
            }
          }
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                avatar: true,
                fullName: true
              }
            }
          }
        }
      }
    });
    return chatRooms;
  } catch (error) {
    throw new Error('Error fetching user chat rooms: ' + error.message);
  }
};

// Get user's recent chats (direct messages)
const getRecentChats = async (userId) => {
  try {
    // Get the most recent message for each conversation
    const recentMessages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ],
        chatRoomId: null // Only direct messages
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
            fullName: true
          }
        },
        receiver: {
          select: {
            id: true,
            username: true,
            avatar: true,
            fullName: true
          }
        }
      }
    });

    // Group messages by conversation
    const conversations = new Map();
    recentMessages.forEach(message => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      if (!conversations.has(otherUserId)) {
        conversations.set(otherUserId, message);
      }
    });

    return Array.from(conversations.values());
  } catch (error) {
    throw new Error('Error fetching recent chats: ' + error.message);
  }
};

module.exports = {
  createMessage,
  getDirectMessages,
  createChatRoom,
  addMemberToChatRoom,
  getChatRoomMessages,
  getUserChatRooms,
  getRecentChats
}; 