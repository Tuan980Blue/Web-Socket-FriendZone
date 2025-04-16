import React from 'react';
import { Card, Group, Skeleton, Stack } from '@mantine/core';

export const LoadingSkeleton = () => (
    <Stack gap="md">
        {[1, 2, 3].map((i) => (
            <Card withBorder padding="lg" radius="md" key={i}>
                <Group gap="sm">
                    <Skeleton height={40} circle />
                    <div style={{ flex: 1 }}>
                        <Skeleton height={20} width="80%" mb="xs" />
                        <Skeleton height={15} width="40%" />
                    </div>
                </Group>
            </Card>
        ))}
    </Stack>
); 