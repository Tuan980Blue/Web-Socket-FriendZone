import React from 'react';
import { Modal, Input, Button, Text, Avatar, Loader } from '@mantine/core';
import { IconSearch, IconUserPlus } from '@tabler/icons-react';
import { User } from '@/services/userService';

interface NewChatModalProps {
    opened: boolean;
    onClose: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: User[];
    isSearching: boolean;
    onSearch: () => void;
    onStartNewChat: (user: User) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({
    opened,
    onClose,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    onSearch,
    onStartNewChat
}) => {
    
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <div className="flex items-center">
                    <div className="relative mr-2">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                        <div className="relative z-10 p-1 rounded-full bg-[#FAFAFA] dark:bg-[#121212]">
                            <IconUserPlus size={16} className="text-[#DD2A7B]" />
                        </div>
                    </div>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] font-semibold">
                        Start a new conversation
                    </span>
                </div>
            }
            size="md"
            classNames={{
                header: 'border-b border-[#DBDBDB] dark:border-[#262626]',
                content: 'bg-[#FAFAFA] dark:bg-[#121212]',
                close: 'text-[#8E8E8E] hover:bg-[#FAFAFA] dark:hover:bg-[#262626]'
            }}
        >
            <div className="mb-4">
                <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                    rightSection={
                        <Button 
                            variant="subtle" 
                            size="xs" 
                            onClick={onSearch}
                            disabled={isSearching}
                            className="text-[#8E8E8E] hover:bg-transparent"
                        >
                            {isSearching ? <Loader size="xs" color="#DD2A7B" /> : <IconSearch size={16} />}
                        </Button>
                    }
                    classNames={{
                        input: 'bg-[#FAFAFA] dark:bg-[#262626] border-[#DBDBDB] dark:border-[#262626] text-[#262626] dark:text-[#FAFAFA]',
                        wrapper: 'bg-[#FAFAFA] dark:bg-[#262626]'
                    }}
                />
            </div>

            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {searchResults.length > 0 ? (
                    <div className="space-y-2">
                        {searchResults.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-[#FAFAFA] dark:hover:bg-[#262626] transition-colors"
                                onClick={() => onStartNewChat(user)}
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                                    <Avatar
                                        src={user.avatar || '/default-avatar.png'}
                                        alt={user.username}
                                        radius="xl"
                                        size="md"
                                        className="relative z-10 border-2 border-[#FAFAFA] dark:border-[#121212]"
                                    >
                                        {user.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                </div>
                                <div className="ml-3">
                                    <Text fw={500} className="text-[#262626] dark:text-[#FAFAFA]">{user.fullName || user.username}</Text>
                                    <Text size="sm" className="text-[#8E8E8E]">@{user.username}</Text>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : searchQuery && !isSearching ? (
                    <div className="text-center py-4">
                        <Text className="text-[#8E8E8E]">No users found</Text>
                    </div>
                ) : !searchQuery ? (
                    <div className="text-center py-4">
                        <Text className="text-[#8E8E8E]">Type to search for users</Text>
                    </div>
                ) : null}
            </div>
        </Modal>
    );
};

export default NewChatModal; 