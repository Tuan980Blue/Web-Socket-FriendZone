'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import {
    Container,
    Title,
    Group,
    Button,
    Alert,
    Center,
    Stack,
    Pagination,
    Text,
} from '@mantine/core';
import {
    IconCheck,
    IconRefresh,
    IconAlertCircle,
} from '@tabler/icons-react';
import { NotificationCard } from './components/NotificationCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';

const NotificationsPage = () => {
    const [page, setPage] = useState(1);
    const limit = 20;

    const {
        notifications,
        total,
        totalPages,
        isLoading,
        error,
        unreadCount,
        handleMarkAsRead,
        handleMarkAllAsRead,
        refreshNotifications
    } = useNotifications(page, limit);

    const handleMarkAllAsReadClick = () => {
        handleMarkAllAsRead();
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    if (isLoading) {
        return (
            <Container size="md" py="xl">
                <LoadingSkeleton />
            </Container>
        );
    }

    if (error) {
        return (
            <Container size="md" py="xl">
                <Alert
                    icon={<IconAlertCircle size={20} />}
                    title="Lỗi"
                    color="red"
                    variant="filled"
                >
                    Đã có lỗi xảy ra khi tải thông báo. Vui lòng thử lại sau.
                </Alert>
            </Container>
        );
    }

    return (
        <Container size="md" py="lg">
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
                <>
                    <Stack gap="md" mb="xl">
                        {notifications.map((notification) => (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={handleMarkAsRead}
                            />
                        ))}
                    </Stack>

                    {totalPages > 1 && (
                        <Group justify="center" mt="xl">
                            <Pagination
                                value={page}
                                onChange={handlePageChange}
                                total={totalPages}
                                withEdges
                            />
                            <Text size="sm" c="dimmed">
                                Hiển thị {notifications.length} trong tổng số {total} thông báo
                            </Text>
                        </Group>
                    )}
                </>
            )}
        </Container>
    );
};

export default NotificationsPage;