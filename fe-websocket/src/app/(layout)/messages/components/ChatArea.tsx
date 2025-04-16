import React from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';

interface Message {
    id: string;
    content: string;
    isOwn: boolean;
    timestamp: string;
    status: 'read' | 'delivered' | 'sent';
    type: 'text' | 'image' | 'voice';
}

interface ChatAreaProps {
    messages: Message[];
    chatName: string;
    isOnline: boolean;
    onSendMessage: (content: string, type: 'text' | 'image' | 'voice') => void;
    onBack?: () => void;
    className?: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({
    messages,
    chatName,
    isOnline,
    onSendMessage,
    onBack,
    className = ''
}) => {
    return (
        <div className={`flex-1 flex flex-col ${className}`}>
            <ChatHeader name={chatName} isOnline={isOnline} onBack={onBack} />
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <MessageBubble key={message.id} {...message} />
                ))}
            </div>

            {/* Message Input */}
            <MessageInput onSend={onSendMessage} />
        </div>
    );
};

export default ChatArea; 