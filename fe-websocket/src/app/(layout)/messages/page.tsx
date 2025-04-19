'use client'

import React, { useState, useEffect, useCallback } from 'react';
import ChatArea from '@/app/(layout)/messages/components/ChatArea';
import ChatSidebar from '@/app/(layout)/messages/components/ChatSidebar';
import NewChatModal from '@/app/(layout)/messages/components/NewChatModal';
import EmptyChatState from '@/app/(layout)/messages/components/EmptyChatState';
import { chatService, Message as ChatServiceMessage } from '@/services/chatService';
import { useUserData } from '@/hooks/useUserData';
import { useSearchParams } from 'next/navigation';
import { userService, User } from '@/services/userService';

interface ChatRoom {
    id: string;
    username: string;
    avatar: string;
    fullName: string;
    status?: string;
}

type Message = ChatServiceMessage;

const Page = () => {
    const { user } = useUserData();
    const searchParams = useSearchParams();
    const userIdFromUrl = searchParams.get('userId');
    
    const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
    const [chats, setChats] = useState<Message[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    
    // New chat modal state
    const [newChatModalOpen, setNewChatModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Load user data if userId is provided in URL
    useEffect(() => {
        const loadUserFromUrl = async () => {
            if (userIdFromUrl && !selectedChat) {
                try {
                    const userData = await userService.getUserById(userIdFromUrl);
                    if (userData) {
                        setSelectedChat({
                            id: userData.id,
                            username: userData.username,
                            avatar: userData.avatar || '',
                            fullName: userData.fullName || userData.username,
                            status: userData.status
                        });
                    } else {
                        console.error('User not found');
                    }
                } catch (error) {
                    console.error('Error loading user data:', error);
                }
            }
        };

        loadUserFromUrl();
    }, [userIdFromUrl, selectedChat]);

    // Load recent chats
    useEffect(() => {
        const loadChats = async () => {
            try {
                const recentChats = await chatService.getRecentChats();
                setChats(recentChats);
            } catch (error) {
                console.error('Error loading chats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadChats();
    }, []);

    // Load messages when chat is selected
    useEffect(() => {
        const loadMessages = async () => {
            if (!selectedChat) return;

            try {
                setIsLoading(true);
                const response = await chatService.getDirectMessages(selectedChat.id);
                setMessages(response.messages);
            } catch (error) {
                console.error('Error loading messages:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadMessages();
    }, [selectedChat]);

    // Handle WebSocket messages
    useEffect(() => {
        const handleNewMessage = (message: ChatServiceMessage) => {
            // If message is from selected chat, add to messages
            if (selectedChat && 
                (message.senderId === selectedChat.id || message.receiverId === selectedChat.id)) {
                setMessages(prev => [...prev, message]);
            }

            // Update chat list with new message
            setChats(prev => {
                const otherUserId = message.senderId === user?.id ? message.receiverId : message.senderId;
                const chatIndex = prev.findIndex(chat => 
                    chat.senderId === otherUserId || chat.receiverId === otherUserId
                );

                if (chatIndex === -1) {
                    return [message, ...prev];
                }

                const newChats = [...prev];
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
    }, [selectedChat, user?.id]);

    const handleSendMessage = useCallback(async (content: string) => {
        if (!selectedChat || !content || !user) return;

        try {
            // Tạo tin nhắn tạm thời để hiển thị ngay lập tức
            const tempMessage: Message = {
                id: Date.now().toString(), // Tạm thời dùng timestamp làm ID
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

            // Thêm tin nhắn vào state ngay lập tức
            setMessages(prev => [...prev, tempMessage]);

            // Cập nhật chat list
            setChats(prev => {
                const chatIndex = prev.findIndex(chat => 
                    chat.senderId === selectedChat.id || chat.receiverId === selectedChat.id
                );

                if (chatIndex === -1) {
                    return [tempMessage, ...prev];
                }

                const newChats = [...prev];
                newChats[chatIndex] = tempMessage;
                return newChats;
            });

            // Gửi tin nhắn qua WebSocket
            chatService.sendMessage(selectedChat.id, content);
        } catch (error) {
            console.error('Error sending message:', error);
            // Có thể thêm xử lý lỗi ở đây, ví dụ: xóa tin nhắn tạm thời nếu gửi thất bại
        }
    }, [selectedChat, user]);

    const handleTypingStart = useCallback(() => {
        if (selectedChat) {
            chatService.sendTypingStatus(selectedChat.id, true);
        }
    }, [selectedChat]);

    const handleTypingStop = useCallback(() => {
        if (selectedChat) {
            chatService.sendTypingStatus(selectedChat.id, false);
        }
    }, [selectedChat]);

    const handleSelectChat = (chat: ChatRoom) => {
        setSelectedChat(chat);
    };

    // Search users for new chat
    const handleSearchUsers = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const results = await userService.searchUsers(searchQuery);
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setIsSearching(false);
        }
    };

    // Start a new chat with a user
    const handleStartNewChat = (user: User) => {
        const newChat: ChatRoom = {
            id: user.id,
            username: user.username,
            avatar: user.avatar || '',
            fullName: user.fullName || user.username,
            status: user.status
        };
        
        setSelectedChat(newChat);
        setNewChatModalOpen(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-gray-50 dark:bg-gray-900">
            <ChatSidebar 
                chats={chats}
                selectedChat={selectedChat}
                isLoading={isLoading}
                currentUserId={user?.id || null}
                onSelectChat={handleSelectChat}
                onNewChat={() => setNewChatModalOpen(true)}
            />

            {selectedChat ? (
                <ChatArea
                    messages={messages}
                    chatName={selectedChat.fullName}
                    isOnline={selectedChat.status === 'ONLINE'}
                    onSendMessage={handleSendMessage}
                    onTypingStart={handleTypingStart}
                    onTypingStop={handleTypingStop}
                    isTyping={isTyping}
                    onBack={() => setSelectedChat(null)}
                    className={!selectedChat ? 'hidden md:flex' : 'flex'}
                    isLoading={isLoading}
                    currentUserId={user?.id || ''}
                    chatAvatar={selectedChat.avatar}
                />
            ) : (
                <EmptyChatState onNewChat={() => setNewChatModalOpen(true)} />
            )}

            <NewChatModal 
                opened={newChatModalOpen}
                onClose={() => setNewChatModalOpen(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                isSearching={isSearching}
                onSearch={handleSearchUsers}
                onStartNewChat={handleStartNewChat}
            />
        </div>
    );
};

export default Page;