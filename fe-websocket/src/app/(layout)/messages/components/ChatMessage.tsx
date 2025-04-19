import React from 'react';
import { Avatar } from '@mantine/core';
import { format } from 'date-fns';
import { Message as ChatServiceMessage } from '@/services/chatService';

type Message = ChatServiceMessage;

interface ChatMessageProps {
    message: Message;
    isOwnMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => {
    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[70%] gap-2`}>
                {!isOwnMessage && (
                    <Avatar
                        src={message.sender?.avatar}
                        alt={message.sender?.username}
                        radius="xl"
                        size="md"
                        className="flex-shrink-0"
                    />
                )}
                <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                    <div
                        className={`rounded-lg px-4 py-2 ${
                            isOwnMessage
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                        }`}
                    >
                        <p className="text-sm">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {format(new Date(message.createdAt), 'HH:mm')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage; 