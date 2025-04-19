import React from 'react';
import { Modal, Input, Button, Text, Avatar, Loader } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
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
            title="Start a new conversation"
            size="md"
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
                        >
                            {isSearching ? <Loader size="xs" /> : <IconSearch size={16} />}
                        </Button>
                    }
                />
            </div>

            <div className="max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                    <div className="space-y-2">
                        {searchResults.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                                onClick={() => onStartNewChat(user)}
                            >
                                <Avatar
                                    src={user.avatar || '/default-avatar.png'}
                                    alt={user.username}
                                    radius="xl"
                                    size="md"
                                />
                                <div className="ml-3">
                                    <Text fw={500}>{user.fullName || user.username}</Text>
                                    <Text size="sm" c="dimmed">@{user.username}</Text>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : searchQuery && !isSearching ? (
                    <div className="text-center py-4">
                        <Text c="dimmed">No users found</Text>
                    </div>
                ) : !searchQuery ? (
                    <div className="text-center py-4">
                        <Text c="dimmed">Type to search for users</Text>
                    </div>
                ) : null}
            </div>
        </Modal>
    );
};

export default NewChatModal; 