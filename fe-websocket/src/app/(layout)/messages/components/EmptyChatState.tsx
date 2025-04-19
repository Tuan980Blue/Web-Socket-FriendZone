import React from 'react';
import { Button } from '@mantine/core';
import { IconUserPlus, IconMessage } from '@tabler/icons-react';
import { useTheme } from 'next-themes';

interface EmptyChatStateProps {
    onNewChat: () => void;
}

const EmptyChatState: React.FC<EmptyChatStateProps> = ({ onNewChat }) => {
    const { theme } = useTheme();
    
    return (
        <div className="flex-1 flex items-center justify-center bg-[#FAFAFA] dark:bg-[#121212]">
            <div className="text-center">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                        <div className="relative z-10 p-6 rounded-full bg-[#FAFAFA] dark:bg-[#121212]">
                            <IconMessage size={48} className="text-[#DD2A7B]" />
                        </div>
                    </div>
                </div>
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]">
                    Select a chat to start messaging
                </h2>
                <p className="text-[#8E8E8E] mt-2">
                    Choose a conversation from the list to begin
                </p>
                <Button
                    variant="light"
                    size="md"
                    radius="md"
                    className="mt-6 bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white hover:opacity-90"
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