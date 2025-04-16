'use client'

import React, { useState } from 'react';
import ChatList from '@/app/(layout)/messages/components/ChatList';
import ChatArea from '@/app/(layout)/messages/components/ChatArea';

const Page = () => {
    const [selectedChat, setSelectedChat] = useState<string | null>(null);

    const handleSendMessage = (content: string, type: 'text' | 'image' | 'voice') => {
        // Implement message sending logic here
        console.log('Sending message:', { content, type });
    };

    // Mock data for demonstration
    const chats = [
        {
            id: '1',
            avatar: '',
            name: 'Ky Duyen',
            lastMessage: 'Hey, how are you?',
            time: '2:30 PM',
            unreadCount: 2,
            isOnline: true,
            isRead: false
        },
        {
            id: '2',
            avatar: '',
            name: 'Tuan Anh Jr',
            lastMessage: 'See you tomorrow!',
            time: 'Yesterday',
            unreadCount: 0,
            isOnline: false,
            isRead: true
        }
    ];

    const messages = [
        {
            id: '1',
            content: 'Hey there!',
            isOwn: false,
            timestamp: '2:30 PM',
            status: 'read' as const,
            type: 'text' as const
        },
        {
            id: '2',
            content: 'Hi! How are you?',
            isOwn: true,
            timestamp: '2:31 PM',
            status: 'read' as const,
            type: 'text' as const
        }
    ];

    const selectedChatData = chats.find(chat => chat.id === selectedChat);

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-gray-50 dark:bg-gray-900">
            <ChatList
                chats={chats}
                selectedChat={selectedChat}
                onSelectChat={setSelectedChat}
                className={`md:block ${selectedChat ? 'hidden md:block' : 'block'}`}
            />

            {selectedChat ? (
                <ChatArea
                    messages={messages}
                    chatName={selectedChatData?.name || ''}
                    isOnline={selectedChatData?.isOnline || false}
                    onSendMessage={handleSendMessage}
                    onBack={() => setSelectedChat(null)}
                    className={!selectedChat ? 'hidden md:flex' : 'flex'}
                />
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                            Select a chat to start messaging
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Choose a conversation from the list to begin
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;