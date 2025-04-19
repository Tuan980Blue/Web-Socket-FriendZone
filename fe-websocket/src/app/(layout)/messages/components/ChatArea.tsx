import React, { useRef, useEffect } from 'react';
import { Button, TextInput, Group, Avatar, Text, Loader } from '@mantine/core';
import { IconArrowLeft, IconSend } from '@tabler/icons-react';
import ChatMessage from './ChatMessage';
import { Message as ChatServiceMessage } from '@/services/chatService';

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
        <div className={`flex-1 flex flex-col bg-white dark:bg-gray-800 ${className}`}>
            {/* Chat Header */}
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <Button
                    variant="subtle"
                    size="sm"
                    radius="xl"
                    className="md:hidden mr-2"
                    onClick={onBack}
                >
                    <IconArrowLeft size={20} />
                </Button>
                <Avatar
                    src={chatAvatar}
                    alt={chatName}
                    radius="xl"
                    size="md"
                    color="blue"
                >
                    {chatName.charAt(0).toUpperCase()}
                </Avatar>
                <div className="ml-3">
                    <Text fw={500}>{chatName}</Text>
                    <Text size="sm" c="dimmed" className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {isOnline ? 'Online' : 'Offline'}
                    </Text>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader />
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
                    <div className="flex justify-center items-center h-full">
                        <Text c="dimmed">No messages yet. Start a conversation!</Text>
                    </div>
                )}
            </div>

            {/* Typing Indicator */}
            {isTyping && (
                <div className="px-4 py-2">
                    <Text size="sm" c="dimmed">
                        {chatName} is typing...
                    </Text>
                </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Group>
                    <TextInput
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={handleTyping}
                        className="flex-1"
                    />
                    <Button
                        variant="filled"
                        radius="xl"
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                    >
                        <IconSend size={20} />
                    </Button>
                </Group>
            </div>
        </div>
    );
};

export default ChatArea; 