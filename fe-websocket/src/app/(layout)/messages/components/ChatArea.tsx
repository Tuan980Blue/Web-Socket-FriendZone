import React, { useRef, useEffect } from 'react';
import { Button, TextInput, Group, Avatar, Text, Loader } from '@mantine/core';
import { IconArrowLeft, IconSend, IconCamera, IconMoodSmile, IconPaperclip } from '@tabler/icons-react';
import ChatMessage from './ChatMessage';
import { Message as ChatServiceMessage } from '@/services/chatService';
import { useTheme } from 'next-themes';

type Message = ChatServiceMessage;

interface ChatAreaProps {
    messages: Message[];
    chatName: string;
    isOnline: boolean;
    onSendMessage: (content: string) => void;
    onTypingStart: () => void;
    onTypingStop: () => void;
    isTyping: boolean;
    onBack: () => void;
    className?: string;
    isLoading: boolean;
    currentUserId: string;
    chatAvatar?: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({
    messages,
    chatName,
    isOnline,
    onSendMessage,
    onTypingStart,
    onTypingStop,
    isTyping,
    onBack,
    className = '',
    isLoading,
    currentUserId,
    chatAvatar
}) => {
    const [message, setMessage] = React.useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleTyping = () => {
        onTypingStart();
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            onTypingStop();
        }, 1000);
    };

    return (
        <div className={`flex-1 flex flex-col bg-[#FAFAFA] dark:bg-[#121212] ${className}`}>
            {/* Chat Header - Fixed at top */}
            <div className="flex items-center md:p-4 py-1 border-b border-[#DBDBDB] dark:border-[#262626] sticky top-0 z-10 bg-[#FAFAFA] dark:bg-[#121212]">
                <Button
                    variant="subtle"
                    size="sm"
                    radius="xl"
                    className="md:hidden mr-2 text-[#262626] dark:text-[#FAFAFA]"
                    onClick={onBack}
                >
                    <IconArrowLeft size={20} />
                </Button>
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                    <Avatar
                        src={chatAvatar}
                        alt={chatName}
                        radius="xl"
                        size="md"
                        className="relative z-10 border-2 border-[#FAFAFA] dark:border-[#121212]"
                    >
                        {chatName.charAt(0).toUpperCase()}
                    </Avatar>
                </div>
                <div className="ml-3">
                    <Text fw={500} className="text-[#262626] dark:text-[#FAFAFA]">{chatName}</Text>
                    <Text size="sm" className="flex items-center text-[#8E8E8E]">
                        <span className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-[#20C997]' : 'bg-[#8E8E8E]'}`}></span>
                        {isOnline ? 'Online' : 'Offline'}
                    </Text>
                </div>
            </div>

            {/* Messages Area - Scrollable */}
            <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 custom-scrollbar"
                style={{ 
                    height: 'calc(100vh - 12rem)', 
                    scrollBehavior: 'smooth'
                }}
            >
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-spin blur-xl opacity-30"></div>
                            <Loader color="#DD2A7B" size="md" />
                        </div>
                    </div>
                ) : messages.length > 0 ? (
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <ChatMessage
                                key={msg.id}
                                message={msg}
                                isOwnMessage={msg.senderId === currentUserId}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center h-full">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                            <div className="relative z-10 p-4 rounded-full bg-[#FAFAFA] dark:bg-[#121212]">
                                <IconSend size={32} className="text-[#DD2A7B]" />
                            </div>
                        </div>
                        <Text className="text-[#8E8E8E]">No messages yet. Start a conversation!</Text>
                    </div>
                )}
            </div>

            {/* Typing Indicator */}
            {isTyping && (
                <div className="px-4 py-2 bg-[#FAFAFA] dark:bg-[#121212] border-t border-[#DBDBDB] dark:border-[#262626]">
                    <Text size="sm" className="text-[#8E8E8E]">
                        {chatName} is typing...
                    </Text>
                </div>
            )}

            {/* Message Input - Fixed at bottom */}
            <div className="py-2 md:py-4 border-t border-[#DBDBDB] dark:border-[#262626] sticky bottom-0 z-10 bg-[#FAFAFA] dark:bg-[#121212]">
                <Group>
                    <div className="flex-1 flex items-center bg-[#FAFAFA] dark:bg-[#262626] rounded-full border border-[#DBDBDB] dark:border-[#262626] ">
                        <Button 
                            variant="subtle" 
                            size="sm" 
                            radius="xl" 
                            className="text-[#8E8E8E] hover:bg-transparent"
                        >
                            <IconCamera size={20} />
                        </Button>
                        <TextInput
                            placeholder="Message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            onFocus={handleTyping}
                            className="flex-1"
                            styles={{
                                input: {
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    color: theme === 'dark' ? '#FAFAFA' : '#262626',
                                },
                                wrapper: {
                                    backgroundColor: 'transparent',
                                }
                            }}
                        />
                        <Group>
                            <Button
                                variant="subtle"
                                size="sm"
                                radius="xl"
                                className="text-[#8E8E8E] hover:bg-transparent"
                            >
                                <IconMoodSmile size={20} />
                            </Button>
                            <Button
                                variant="subtle"
                                size="sm"
                                radius="xl"
                                className="text-[#8E8E8E] hover:bg-transparent"
                            >
                                <IconPaperclip size={20} />
                            </Button>
                        </Group>
                    </div>
                    <Button
                        variant="filled"
                        radius="xl"
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white hover:opacity-90"
                    >
                        <IconSend size={20} />
                    </Button>
                </Group>
            </div>
        </div>
    );
};

export default ChatArea; 