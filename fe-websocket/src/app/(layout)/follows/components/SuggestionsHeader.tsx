import React from 'react';
import { Group, Text, Button, Divider, Stack } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';

interface SuggestionsHeaderProps {
    onRefresh: () => void;
    isLoading: boolean;
}

const SuggestionsHeader = ({ onRefresh, isLoading }: SuggestionsHeaderProps) => {
    return (
        <Stack gap="xs">
            <Group justify="space-between" align="center">
                <Text 
                    fw={500} 
                    size="lg" 
                    className="text-transparent italic bg-clip-text bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]"
                >
                    Gợi ý theo dõi
                </Text>
                <Button
                    variant="light"
                    size="sm"
                    radius="xl"
                    onClick={onRefresh}
                    loading={isLoading}
                    className="bg-gradient-to-r from-[#F58529]/10 via-[#DD2A7B]/10 to-[#515BD4]/10 border-0 transition-transform duration-200"
                    leftSection={<IconRefresh size={16} className="text-blue-400 bg-clip-text bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]" />}
                >
                    Làm mới
                </Button>
            </Group>
            <Divider color="#DBDBDB" className="dark:border-[#262626]" />
        </Stack>
    );
};

export default SuggestionsHeader; 