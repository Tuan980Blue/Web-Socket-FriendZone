import { io, Socket } from 'socket.io-client';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  chatRoomId?: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    username: string;
    avatar: string;
    fullName: string;
  };
  receiver?: {
    id: string;
    username: string;
    avatar: string;
    fullName: string;
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    username: string;
    avatar: string;
    fullName: string;
  };
  members: {
    user: {
      id: string;
      username: string;
      avatar: string;
      fullName: string;
    };
  }[];
}

class ChatService {
  private socket: Socket | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];
  private typingHandlers: ((data: { userId: string; isTyping: boolean }) => void)[] = [];

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('receive_message', (message: Message) => {
      this.messageHandlers.forEach(handler => handler(message));
    });

    this.socket.on('user_typing', (data: { userId: string; isTyping: boolean }) => {
      this.typingHandlers.forEach(handler => handler(data));
    });

    this.socket.on('error', (error: { message: string }) => {
      console.error('WebSocket error:', error);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  // API Methods
  async getRecentChats() {
    const response = await axios.get(`${API_URL}/chat/recent`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data.data;
  }

  async getDirectMessages(userId: string, page = 1, limit = 50) {
    const response = await axios.get(`${API_URL}/chat/direct/${userId}`, {
      params: { page, limit },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data.data;
  }

  async sendDirectMessage(userId: string, content: string) {
    const response = await axios.post(`${API_URL}/chat/direct/${userId}`, 
      { content },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
    );
    return response.data.data;
  }

  async getChatRooms() {
    const response = await axios.get(`${API_URL}/chat/rooms`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data.data;
  }

  async createChatRoom(name: string, description?: string, isPrivate = false) {
    const response = await axios.post(`${API_URL}/chat/rooms`,
      { name, description, isPrivate },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
    );
    return response.data.data;
  }

  async getChatRoomMessages(roomId: string, page = 1, limit = 50) {
    const response = await axios.get(`${API_URL}/chat/rooms/${roomId}/messages`, {
      params: { page, limit },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data.data;
  }

  async sendChatRoomMessage(roomId: string, content: string) {
    const response = await axios.post(`${API_URL}/chat/rooms/${roomId}/messages`,
      { content },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
    );
    return response.data.data;
  }

  async addMemberToChatRoom(roomId: string, userId: string) {
    const response = await axios.post(`${API_URL}/chat/rooms/${roomId}/members`,
      { userId },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
    );
    return response.data.data;
  }

  // WebSocket Methods
  sendMessage(receiverId: string, content: string, chatRoomId?: string) {
    if (!this.socket) return;
    
    // Tạo một ID duy nhất cho tin nhắn để tránh trùng lặp
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    this.socket.emit('send_message', { 
      messageId, 
      receiverId, 
      content, 
      chatRoomId 
    });
  }

  sendTypingStatus(receiverId: string, isTyping: boolean) {
    if (!this.socket) return;
    this.socket.emit('typing', { receiverId, isTyping });
  }

  // Event Handlers
  onMessage(handler: (message: Message) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  onTyping(handler: (data: { userId: string; isTyping: boolean }) => void) {
    this.typingHandlers.push(handler);
    return () => {
      this.typingHandlers = this.typingHandlers.filter(h => h !== handler);
    };
  }

  // Cleanup
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const chatService = new ChatService(); 