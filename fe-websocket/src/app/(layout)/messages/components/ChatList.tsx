import React from 'react';
import { Search } from 'lucide-react';
import ChatListItem from './ChatListItem';

interface Chat {
    id: string;
    avatar: string;
    name: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
    isOnline: boolean;
    isRead: boolean;
}

interface ChatListProps {
    chats: Chat[];
    selectedChat: string | null;
    onSelectChat: (chatId: string) => void;
    className?: string;
}

const ChatList: React.FC<ChatListProps> = ({ chats, selectedChat, onSelectChat, className = '' }) => {
    return (
        <div className={`w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}>
            {/* Search Bar */}
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button className="flex-1 py-3 text-center text-sm font-medium text-blue-500 border-b-2 border-blue-500">
                    All
                </button>
                <button className="flex-1 py-3 text-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400">
                    Unread
                </button>
                <button className="flex-1 py-3 text-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400">
                    Favorites
                </button>
            </div>

            {/* Chat List */}
            <div className="overflow-y-auto h-[calc(100vh-12rem)]">
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        className={selectedChat === chat.id ? 'bg-gray-100 dark:bg-gray-700' : ''}
                    >
                        <ChatListItem {...chat} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatList; 