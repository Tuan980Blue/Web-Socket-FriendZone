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
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                        <Avatar
                            src={message.sender?.avatar}
                            alt={message.sender?.username}
                            radius="xl"
                            size="md"
                            className="relative z-10 border-2 border-[#FAFAFA] dark:border-[#121212] flex-shrink-0"
                        >
                            {message.sender?.username?.charAt(0).toUpperCase()}
                        </Avatar>
                    </div>
                )}
                <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                    <div
                        className={`rounded-lg px-4 py-2 ${
                            isOwnMessage
                                ? 'bg-[#0095F6] text-white rounded-br-none'
                                : 'bg-[#FAFAFA] dark:bg-[#262626] text-[#262626] dark:text-[#FAFAFA] rounded-bl-none border border-[#DBDBDB] dark:border-[#262626]'
                        }`}
                    >
                        <p className="text-sm">{message.content}</p>
                    </div>
                    <span className="text-xs text-[#8E8E8E] mt-1">
                        {format(new Date(message.createdAt), 'HH:mm')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage; 