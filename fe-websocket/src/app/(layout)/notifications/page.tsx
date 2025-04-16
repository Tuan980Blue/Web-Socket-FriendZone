'use client';

import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import {
    Container,
    Title,
    Group,
    Button,
    Alert,
    Center,
    Stack,
} from '@mantine/core';
import {
    IconCheck,
    IconRefresh,
    IconAlertCircle,
} from '@tabler/icons-react';
import { NotificationCard } from './components/NotificationCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';

const NotificationsPage = () => {
    const {
        notifications,
        isLoading,
        unreadCount,
        handleMarkAsRead,
        handleMarkAllAsRead,
        refreshNotifications
    } = useNotifications();

    const handleMarkAllAsReadClick = () => {
        handleMarkAllAsRead();
    };

    if (isLoading) {
        return (
            <Container size="md" py="xl">
                <LoadingSkeleton />
            </Container>
        );
    }

    return (
        <Container size="md" py="xl">
            <Group justify="space-between" mb="xl">
                <Title order={2}>Thông báo</Title>
                <Group>
                    {unreadCount > 0 && (
                        <Button
                            variant="light"
                            leftSection={<IconCheck size={20} />}
                            onClick={handleMarkAllAsReadClick}
                        >
                            Đánh dấu tất cả đã đọc
                        </Button>
                    )}
                    <Button
                        variant="light"
                        leftSection={<IconRefresh size={20} />}
                        onClick={refreshNotifications}
                    >
                        Làm mới
                    </Button>
                </Group>
            </Group>

            {notifications.length === 0 ? (
                <Center py="xl">
                    <Alert
                        icon={<IconAlertCircle size={20} />}
                        title="Không có thông báo"
                        color="blue"
                        variant="light"
                    >
                        Bạn chưa có thông báo nào. Hãy quay lại sau!
                    </Alert>
                </Center>
            ) : (
                <Stack gap="md">
                    {notifications.map((notification) => (
                        <NotificationCard
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={handleMarkAsRead}
                        />
                    ))}
                </Stack>
            )}
        </Container>
    );
};

export default NotificationsPage;