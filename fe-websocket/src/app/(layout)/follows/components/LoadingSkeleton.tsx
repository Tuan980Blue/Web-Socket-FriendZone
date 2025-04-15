import React from 'react';
import { Card, Skeleton, Stack, Group } from '@mantine/core';

interface LoadingSkeletonProps {
    variant?: 'default' | 'suggestion';
    count?: number;
}

const LoadingSkeleton = ({ variant = 'default', count = 3 }: LoadingSkeletonProps) => {
    const isSuggestion = variant === 'suggestion';
    const cardPadding = isSuggestion ? 'md' : 'lg';
    const avatarSize = isSuggestion ? 40 : 50;
    const titleWidth = isSuggestion ? '30%' : '40%';
    const subtitleWidth = isSuggestion ? '20%' : '20%';

    return (
        <Stack gap="md">
            {Array.from({ length: count }).map((_, i) => (
                <Card 
                    withBorder 
                    padding={cardPadding} 
                    radius="md" 
                    key={i}
                    className="animate-pulse"
                >
                    <Group gap="sm">
                        <Skeleton height={avatarSize} circle />
                        <div style={{ flex: 1 }}>
                            <Skeleton height={isSuggestion ? 16 : 20} width={titleWidth} mb="xs" />
                            <Skeleton height={isSuggestion ? 12 : 15} width={subtitleWidth} />
                            {!isSuggestion && (
                                <>
                                    <Skeleton height={14} width="60%" mt="xs" />
                                    <Group gap="xs" mt="xs">
                                        <Skeleton height={20} width={60} />
                                        <Skeleton height={20} width={100} />
                                    </Group>
                                </>
                            )}
                        </div>
                        {isSuggestion && (
                            <Skeleton height={24} width={80} radius="xl" />
                        )}
                    </Group>
                </Card>
            ))}
        </Stack>
    );
};

export default LoadingSkeleton; 