import React from 'react';
import { Button, Avatar, Badge, Tooltip } from '@mantine/core';
import { IconUserPlus, IconMessage, IconCircleCheck, IconClock } from '@tabler/icons-react';
import { Message as ChatServiceMessage } from '@/services/chatService';
import { motion, AnimatePresence } from 'framer-motion';

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
            <div className="w-full md:w-80 border-r border-[#DBDBDB] dark:border-[#262626] h-screen flex flex-col">
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

    const formatTime = (date: string) => {
        const messageDate = new Date(date);
        const now = new Date();
        const diff = now.getTime() - messageDate.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return 'Yesterday';
        } else if (days < 7) {
            return messageDate.toLocaleDateString([], { weekday: 'long' });
        } else {
            return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    return (
        <div className="w-full md:w-80 bg-[#FAFAFA] dark:bg-[#121212] md:border-r border-[#DBDBDB] dark:border-[#262626] md:h-screen flex flex-col">
            <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-[#262626] dark:text-[#FAFAFA]">Messages</h2>
                    <Button
                        variant="light"
                        size="sm"
                        radius="xl"
                        className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white hover:opacity-90 transition-all duration-300"
                        leftSection={<IconUserPlus size={16} />}
                        onClick={onNewChat}
                    >
                        New Chat
                    </Button>
                </div>
                
                {chats.length > 0 ? (
                    <div className="space-y-3">
                        <AnimatePresence>
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
                                    <motion.div
                                        key={chat.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className={`group relative flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                                            selectedChat?.id === otherUser.id
                                                ? 'bg-gradient-to-r from-[#F58529]/10 via-[#DD2A7B]/10 to-[#515BD4]/10 shadow-lg'
                                                : 'hover:bg-[#FAFAFA] dark:hover:bg-[#262626] hover:shadow-md'
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
                                                className="relative z-10 border-2 border-[#FAFAFA] dark:border-[#121212] transition-transform duration-300 group-hover:scale-110"
                                            >
                                                {otherUser.fullName.charAt(0).toUpperCase()}
                                            </Avatar>
                                            {selectedChat?.id === otherUser.id && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#20C997] rounded-full border-2 border-[#FAFAFA] dark:border-[#121212]"></div>
                                            )}
                                        </div>
                                        <div className="ml-3 flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className={`text-sm font-semibold truncate ${
                                                        selectedChat?.id === otherUser.id
                                                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]'
                                                            : 'text-[#262626] dark:text-[#FAFAFA]'
                                                    }`}>
                                                        {otherUser.fullName}
                                                    </h3>
                                                    <Tooltip label="Online" position="top">
                                                        <IconCircleCheck size={14} className="text-[#20C997]" />
                                                    </Tooltip>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <IconClock size={12} className="text-[#8E8E8E]" />
                                                    <span className="text-xs text-[#8E8E8E]">
                                                        {formatTime(chat.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-sm text-[#8E8E8E] truncate flex-1">
                                                    {chat.content}
                                                </p>
                                                <Badge 
                                                    size="sm" 
                                                    radius="xl"
                                                    className="ml-2 bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]"
                                                >
                                                    New
                                                </Badge>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                                <div className="relative z-10 p-6 rounded-full bg-[#FAFAFA] dark:bg-[#121212]">
                                    <IconMessage size={40} className="text-[#DD2A7B]" />
                                </div>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-[#262626] dark:text-[#FAFAFA] mb-2">No messages yet</h3>
                        <p className="text-[#8E8E8E] mb-6">Start connecting with others</p>
                        <Button
                            variant="light"
                            size="md"
                            radius="xl"
                            className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white hover:opacity-90 transition-all duration-300 hover:scale-105"
                            leftSection={<IconUserPlus size={18} />}
                            onClick={onNewChat}
                        >
                            Start a conversation
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ChatSidebar; 