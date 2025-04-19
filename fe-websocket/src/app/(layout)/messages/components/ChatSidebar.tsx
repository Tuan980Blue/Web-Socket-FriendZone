import React from 'react';
import { Button, Avatar } from '@mantine/core';
import { IconUserPlus } from '@tabler/icons-react';
import { Message as ChatServiceMessage } from '@/services/chatService';

interface ChatRoom {
    id: string;
    username: string;
    avatar: string;
    fullName: string;
    status?: string;
}

type Message = ChatServiceMessage;

interface ChatSidebarProps {
    chats: Message[];
    selectedChat: ChatRoom | null;
    isLoading: boolean;
    currentUserId: string | null;
    onSelectChat: (chat: ChatRoom) => void;
    onNewChat: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
    chats,
    selectedChat,
    isLoading,
    currentUserId,
    onSelectChat,
    onNewChat
}) => {
    if (isLoading) {
        return (
            <div className="w-full md:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                <div className="p-4">
                    <div className="animate-pulse space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full md:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Messages</h2>
                    <Button
                        variant="light"
                        size="sm"
                        radius="md"
                        className="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                        leftSection={<IconUserPlus size={16} />}
                        onClick={onNewChat}
                    >
                        New Chat
                    </Button>
                </div>
                
                {chats.length > 0 ? (
                    <div className="space-y-2">
                        {chats.map((chat) => {
                            const otherUserId = chat.senderId === currentUserId ? chat.receiverId : chat.senderId;
                            const otherUser = {
                                id: otherUserId,
                                username: otherUserId === chat.senderId 
                                    ? chat.sender?.username 
                                    : chat.receiver?.username || '',
                                avatar: otherUserId === chat.senderId 
                                    ? chat.sender?.avatar 
                                    : chat.receiver?.avatar || '',
                                fullName: otherUserId === chat.senderId 
                                    ? (chat.sender?.fullName || chat.sender?.username) 
                                    : (chat.receiver?.fullName || chat.receiver?.username) || '',
                            };
                            
                            return (
                                <div
                                    key={chat.id}
                                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                                        selectedChat?.id === otherUser.id
                                            ? 'bg-blue-50 dark:bg-blue-900'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                    onClick={() => onSelectChat(otherUser)}
                                >
                                    <div className="relative">
                                        <Avatar
                                            src={otherUser.avatar}
                                            alt={`${otherUser.fullName}'s avatar`}
                                            size="md"
                                            radius="xl"
                                            color="blue"
                                        >
                                            {otherUser.fullName.charAt(0).toUpperCase()}
                                        </Avatar>
                                        {selectedChat?.id === otherUser.id && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                        )}
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {otherUser.fullName}
                                            </h3>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            {chat.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
                        <Button
                            variant="light"
                            size="sm"
                            radius="md"
                            className="mt-4 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                            leftSection={<IconUserPlus size={16} />}
                            onClick={onNewChat}
                        >
                            Start a conversation
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSidebar; 