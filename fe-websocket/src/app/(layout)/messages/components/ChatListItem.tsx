import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import Image from 'next/image';

interface ChatListItemProps {
    avatar: string;
    name: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    isOnline?: boolean;
    isRead?: boolean;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
    avatar,
    name,
    lastMessage,
    time,
    unreadCount,
    isOnline,
    isRead
}) => {
    return (
        <div className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700">
                    <Image 
                        src={avatar || '/image-person.png'} 
                        alt={name} 
                        width={40} 
                        height={40} 
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
                {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                )}
            </div>
            <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                    <h3 className="font-medium">{name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{time}</span>
                </div>
                <div className="flex items-center mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex-1">
                        {lastMessage}
                    </p>
                    {isRead ? (
                        <CheckCheck className="ml-2 text-blue-500" size={16} />
                    ) : (
                        <Check className="ml-2 text-gray-400" size={16} />
                    )}
                </div>
            </div>
            {unreadCount && unreadCount > 0 && (
                <div className="ml-2 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                </div>
            )}
        </div>
    );
};

export default ChatListItem; 