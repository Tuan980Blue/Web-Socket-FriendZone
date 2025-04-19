import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService, Message } from '@/services/chatService';
import { useUserData } from './useUserData';
import { useCallback, useEffect, useState } from 'react';

interface UseChatOptions {
  userId?: string;
  page?: number;
  limit?: number;
}

interface MessagesResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useChat(options: UseChatOptions = {}) {
  const { user } = useUserData();
  const queryClient = useQueryClient();
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    username: string;
    avatar: string;
    fullName: string;
    status?: string;
  } | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Query để lấy danh sách chat gần đây
  const {
    data: chats = [],
    isLoading: isLoadingChats,
    error: chatsError,
  } = useQuery({
    queryKey: ['chats', user?.id],
    queryFn: () => chatService.getRecentChats(),
    enabled: !!user?.id,
  });

  // Query để lấy tin nhắn của một cuộc trò chuyện cụ thể
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useQuery({
    queryKey: ['messages', selectedChat?.id, options.page, options.limit],
    queryFn: () => 
      selectedChat 
        ? chatService.getDirectMessages(selectedChat.id, options.page, options.limit) 
        : Promise.resolve({ messages: [], total: 0, page: 1, limit: 50, totalPages: 0 }),
    enabled: !!selectedChat?.id,
  });

  const messages = messagesData?.messages || [];

  // Mutation để gửi tin nhắn
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => {
      if (!selectedChat || !user) return Promise.reject('No chat selected or user not logged in');
      return Promise.resolve(chatService.sendMessage(selectedChat.id, content));
    },
    onSuccess: () => {
      // Invalidate và refetch danh sách chat để cập nhật chat gần đây
      queryClient.invalidateQueries({ queryKey: ['chats', user?.id] });
    },
  });

  // Xử lý tin nhắn mới từ WebSocket
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      // Nếu tin nhắn từ chat đang được chọn, thêm vào danh sách tin nhắn
      if (selectedChat && 
          (message.senderId === selectedChat.id || message.receiverId === selectedChat.id)) {
        queryClient.setQueryData(
          ['messages', selectedChat.id, options.page, options.limit],
          (oldData: MessagesResponse | undefined) => {
            if (!oldData) return { messages: [message], total: 1, page: 1, limit: 50, totalPages: 1 };
            return {
              ...oldData,
              messages: [...oldData.messages, message],
              total: oldData.total + 1,
            };
          }
        );
      }

      // Cập nhật danh sách chat gần đây
      queryClient.setQueryData(['chats', user?.id], (oldData: Message[] | undefined) => {
        if (!oldData) return [message];
        
        const otherUserId = message.senderId === user?.id ? message.receiverId : message.senderId;
        const chatIndex = oldData.findIndex((chat) => 
          chat.senderId === otherUserId || chat.receiverId === otherUserId
        );

        if (chatIndex === -1) {
          return [message, ...oldData];
        }

        const newChats = [...oldData];
        newChats[chatIndex] = message;
        return newChats;
      });
    };

    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId === selectedChat?.id) {
        setIsTyping(data.isTyping);
      }
    };

    const messageUnsubscribe = chatService.onMessage(handleNewMessage);
    const typingUnsubscribe = chatService.onTyping(handleTyping);

    return () => {
      messageUnsubscribe();
      typingUnsubscribe();
    };
  }, [selectedChat, user?.id, queryClient, options.page, options.limit]);

  // Hàm gửi tin nhắn
  const sendMessage = useCallback(async (content: string) => {
    if (!selectedChat || !content || !user) return;

    try {
      // Tạo tin nhắn tạm thời để hiển thị ngay lập tức
      const tempMessage: Message = {
        id: Date.now().toString(),
        content,
        senderId: user.id,
        receiverId: selectedChat.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sender: {
          id: user.id,
          username: user.username,
          avatar: user.avatar || '',
          fullName: user.fullName || user.username
        },
        receiver: {
          id: selectedChat.id,
          username: selectedChat.username,
          avatar: selectedChat.avatar,
          fullName: selectedChat.fullName
        }
      };

      // Thêm tin nhắn tạm thời vào cache
      queryClient.setQueryData(
        ['messages', selectedChat.id, options.page, options.limit],
        (oldData: MessagesResponse | undefined) => {
          if (!oldData) return { messages: [tempMessage], total: 1, page: 1, limit: 50, totalPages: 1 };
          return {
            ...oldData,
            messages: [...oldData.messages, tempMessage],
            total: oldData.total + 1,
          };
        }
      );

      // Cập nhật danh sách chat gần đây
      queryClient.setQueryData(['chats', user.id], (oldData: Message[] | undefined) => {
        if (!oldData) return [tempMessage];
        
        const chatIndex = oldData.findIndex((chat) => 
          chat.senderId === selectedChat.id || chat.receiverId === selectedChat.id
        );

        if (chatIndex === -1) {
          return [tempMessage, ...oldData];
        }

        const newChats = [...oldData];
        newChats[chatIndex] = tempMessage;
        return newChats;
      });

      // Gửi tin nhắn qua WebSocket
      await sendMessageMutation.mutateAsync(content);
    } catch (error) {
      console.error('Error sending message:', error);
      // Có thể thêm xử lý lỗi ở đây, ví dụ: xóa tin nhắn tạm thời nếu gửi thất bại
    }
  }, [selectedChat, user, queryClient, sendMessageMutation, options.page, options.limit]);

  // Hàm gửi trạng thái đang nhập
  const sendTypingStatus = useCallback((isTyping: boolean) => {
    if (selectedChat) {
      chatService.sendTypingStatus(selectedChat.id, isTyping);
    }
  }, [selectedChat]);

  return {
    chats,
    messages,
    selectedChat,
    setSelectedChat,
    isLoadingChats,
    isLoadingMessages,
    chatsError,
    messagesError,
    sendMessage,
    sendTypingStatus,
    isTyping,
  };
} 