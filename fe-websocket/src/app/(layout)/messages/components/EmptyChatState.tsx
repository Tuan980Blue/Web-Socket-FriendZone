import React from 'react';
import { Button } from '@mantine/core';
import { IconUserPlus } from '@tabler/icons-react';

interface EmptyChatStateProps {
    onNewChat: () => void;
}

const EmptyChatState: React.FC<EmptyChatStateProps> = ({ onNewChat }) => {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                    Select a chat to start messaging
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Choose a conversation from the list to begin
                </p>
                <Button
                    variant="light"
                    size="md"
                    radius="md"
                    className="mt-4 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                    leftSection={<IconUserPlus size={16} />}
                    onClick={onNewChat}
                >
                    Start a new conversation
                </Button>
            </div>
        </div>
    );
};

export default EmptyChatState; 