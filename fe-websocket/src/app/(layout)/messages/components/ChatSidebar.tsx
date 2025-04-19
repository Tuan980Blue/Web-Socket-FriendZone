import React from 'react';
import { Button, Avatar } from '@mantine/core';
import { IconUserPlus, IconMessage } from '@tabler/icons-react';
import { Message as ChatServiceMessage } from '@/services/chatService';
import { useTheme } from 'next-themes';

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
    const { theme } = useTheme();
    
    if (isLoading) {
        return (
            <div className="w-full md:w-80 bg-[#FAFAFA] dark:bg-[#121212] border-r border-[#DBDBDB] dark:border-[#262626]">
                <div className="p-4">
                    <div className="animate-pulse space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-[#DBDBDB] dark:bg-[#262626] rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-[#DBDBDB] dark:bg-[#262626] rounded w-3/4"></div>
                                    <div className="h-3 bg-[#DBDBDB] dark:bg-[#262626] rounded w-1/2 mt-2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full md:w-80 bg-[#FAFAFA] dark:bg-[#121212] border-r border-[#DBDBDB] dark:border-[#262626]">
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-[#262626] dark:text-[#FAFAFA]">Messages</h2>
                    <Button
                        variant="light"
                        size="sm"
                        radius="md"
                        className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white hover:opacity-90"
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
                                            ? 'bg-gradient-to-r from-[#F58529]/10 via-[#DD2A7B]/10 to-[#515BD4]/10'
                                            : 'hover:bg-[#FAFAFA] dark:hover:bg-[#262626]'
                                    }`}
                                    onClick={() => onSelectChat(otherUser)}
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                                        <Avatar
                                            src={otherUser.avatar}
                                            alt={`${otherUser.fullName}'s avatar`}
                                            size="md"
                                            radius="xl"
                                            className="relative z-10 border-2 border-[#FAFAFA] dark:border-[#121212]"
                                        >
                                            {otherUser.fullName.charAt(0).toUpperCase()}
                                        </Avatar>
                                        {selectedChat?.id === otherUser.id && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#20C997] rounded-full border-2 border-[#FAFAFA] dark:border-[#121212]"></div>
                                        )}
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`text-sm font-medium ${
                                                selectedChat?.id === otherUser.id
                                                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]'
                                                    : 'text-[#262626] dark:text-[#FAFAFA]'
                                            }`}>
                                                {otherUser.fullName}
                                            </h3>
                                            <span className="text-xs text-[#8E8E8E]">
                                                {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#8E8E8E] truncate">
                                            {chat.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                                <div className="relative z-10 p-4 rounded-full bg-[#FAFAFA] dark:bg-[#121212]">
                                    <IconMessage size={32} className="text-[#DD2A7B]" />
                                </div>
                            </div>
                        </div>
                        <p className="text-[#8E8E8E]">No messages yet</p>
                        <Button
                            variant="light"
                            size="sm"
                            radius="md"
                            className="mt-4 bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white hover:opacity-90"
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