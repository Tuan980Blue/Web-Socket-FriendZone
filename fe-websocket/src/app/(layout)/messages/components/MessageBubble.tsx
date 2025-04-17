import React from 'react';
import { Check, CheckCheck, Clock } from 'lucide-react';
import Image from 'next/image';

interface MessageBubbleProps {
    content: string;
    isOwn: boolean;
    timestamp: string;
    status: 'sending' | 'sent' | 'delivered' | 'read';
    type?: 'text' | 'image' | 'voice';
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
    content,
    isOwn,
    timestamp,
    status,
    type = 'text'
}) => {
    const getStatusIcon = () => {
        switch (status) {
            case 'sending':
                return <Clock className="text-gray-400" size={14} />;
            case 'sent':
                return <Check className="text-gray-400" size={14} />;
            case 'delivered':
                return <CheckCheck className="text-gray-400" size={14} />;
            case 'read':
                return <CheckCheck className="text-blue-500" size={14} />;
            default:
                return null;
        }
    };

    const renderContent = () => {
        switch (type) {
            case 'image':
                return (
                    <Image 
                        src={content || '/image-person.png'} 
                        alt="Message image" 
                        width={200} 
                        height={200} 
                        className="rounded-lg"
                    />
                );
            case 'voice':
                return (
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full" />
                        <span className="text-sm">Voice message</span>
                    </div>
                );
            default:
                return <p className="text-sm">{content}</p>;
        }
    };

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isOwn
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                }`}
            >
                {renderContent()}
                <div className={`flex items-center justify-end mt-1 space-x-1 ${isOwn ? 'text-white' : 'text-gray-500'}`}>
                    <span className="text-xs">{timestamp}</span>
                    {isOwn && getStatusIcon()}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble; 