import React from 'react';
import { Group, Text, Button, Divider } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';

interface SuggestionsHeaderProps {
    onRefresh: () => void;
    isLoading: boolean;
}

const SuggestionsHeader = ({ onRefresh, isLoading }: SuggestionsHeaderProps) => {
    return (
        <>
            <Group justify="space-between" align="center">
                <Text fw={500} size="lg" className="text-primary">
                    Gợi ý cho bạn
                </Text>
                <Button
                    variant="subtle"
                    color="gray"
                    size="xs"
                    leftSection={<IconRefresh size={14} />}
                    onClick={onRefresh}
                    loading={isLoading}
                    className="hover:bg-gray-100 transition-colors duration-200"
                >
                    Làm mới
                </Button>
            </Group>
            <Divider my="sm" className="border-gray-200" />
        </>
    );
};

export default SuggestionsHeader; 