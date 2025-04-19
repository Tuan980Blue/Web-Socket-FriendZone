'use client'

import React, { useState, useEffect } from 'react';
import ChatArea from '@/app/(layout)/messages/components/ChatArea';
import ChatSidebar from '@/app/(layout)/messages/components/ChatSidebar';
import NewChatModal from '@/app/(layout)/messages/components/NewChatModal';
import EmptyChatState from '@/app/(layout)/messages/components/EmptyChatState';
import { useUserData } from '@/hooks/useUserData';
import { useSearchParams } from 'next/navigation';
import { userService, User } from '@/services/userService';
import { useChat } from '@/hooks/useChat';

interface ChatRoom {
    id: string;
    username: string;
    avatar: string;
    fullName: string;
    status?: string;
}

const Page = () => {
    const { user } = useUserData();
    const searchParams = useSearchParams();
    const userIdFromUrl = searchParams.get('userId');
    
    // Sử dụng hook useChat
    const {
        chats,
        messages,
        selectedChat,
        setSelectedChat,
        isLoadingChats,
        isLoadingMessages,
        sendMessage,
        sendTypingStatus,
        isTyping
    } = useChat();
    
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
    }, [userIdFromUrl, selectedChat, setSelectedChat]);

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

    const handleTypingStart = () => {
        sendTypingStatus(true);
    };

    const handleTypingStop = () => {
        sendTypingStatus(false);
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-[#FAFAFA] dark:bg-[#121212]">
            <div className={`${selectedChat ? 'hidden md:block' : 'block'} w-full md:w-80`}>
                <ChatSidebar 
                    chats={chats}
                    selectedChat={selectedChat}
                    isLoading={isLoadingChats}
                    currentUserId={user?.id || null}
                    onSelectChat={handleSelectChat}
                    onNewChat={() => setNewChatModalOpen(true)}
                />
            </div>

            <div className={`${selectedChat ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
                {selectedChat ? (
                    <ChatArea
                        messages={messages}
                        chatName={selectedChat.fullName}
                        isOnline={selectedChat.status === 'ONLINE'}
                        onSendMessage={sendMessage}
                        onTypingStart={handleTypingStart}
                        onTypingStop={handleTypingStop}
                        isTyping={isTyping}
                        onBack={() => setSelectedChat(null)}
                        className="flex flex-col h-full"
                        isLoading={isLoadingMessages}
                        currentUserId={user?.id || ''}
                        chatAvatar={selectedChat.avatar}
                    />
                ) : (
                    <EmptyChatState onNewChat={() => setNewChatModalOpen(true)} />
                )}
            </div>

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