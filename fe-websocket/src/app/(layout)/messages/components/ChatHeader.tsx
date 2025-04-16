import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ChatHeaderProps {
    name: string;
    isOnline: boolean;
    onBack?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ name, isOnline, onBack }) => {
    return (
        <div className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center px-4">
            {onBack && (
                <button 
                    onClick={onBack}
                    className="md:hidden mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                    <ArrowLeft size={20} />
                </button>
            )}
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div>
                    <h2 className="font-semibold">{name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isOnline ? 'Online' : 'Offline'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader; 