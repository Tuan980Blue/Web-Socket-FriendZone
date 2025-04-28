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
    Paper,
    Badge,
    ActionIcon,
    useMantineTheme,
    useMantineColorScheme,
} from '@mantine/core';
import {
    IconCheck,
    IconRefresh,
    IconAlertCircle,
    IconBell,
} from '@tabler/icons-react';
import { NotificationCard } from './components/NotificationCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@mantine/hooks';

const NotificationsPage = () => {
    const [page, setPage] = useState(1);
    const limit = 20;
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

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
            <Container size="sm" py="xl" px={isMobile ? 'xs' : 'md'}>
                <LoadingSkeleton />
            </Container>
        );
    }

    if (error) {
        return (
            <Container size="sm" py="xl" px={isMobile ? 'xs' : 'md'}>
                <Alert
                    icon={<IconAlertCircle size={isMobile ? 16 : 20} />}
                    title="Lỗi"
                    color="red"
                    variant="filled"
                    radius="md"
                >
                    Đã có lỗi xảy ra khi tải thông báo. Vui lòng thử lại sau.
                </Alert>
            </Container>
        );
    }

    return (
        <Container size="lg" py="lg" px={isMobile ? 'xs' : 'md'}>
            <Paper 
                shadow="sm" 
                p={isMobile ? 'sm' : 'md'} 
                radius="md" 
                mb="xl" 
                withBorder
                style={{
                    backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                }}
            >
                <Group justify="space-between" align="center" wrap="nowrap">
                    <Group gap="xs" wrap="nowrap">
                        <IconBell size={isMobile ? 20 : 24} />
                        <Title order={2} size={isMobile ? "h4" : "h3"}>Thông báo</Title>
                        {unreadCount > 0 && (
                            <Badge 
                                color="blue" 
                                variant="light" 
                                size={isMobile ? "sm" : "lg"}
                            >
                                {unreadCount}
                            </Badge>
                        )}
                    </Group>
                    <Group gap="xs">
                        {unreadCount > 0 && (
                            <Button
                                variant="subtle"
                                leftSection={<IconCheck size={isMobile ? 16 : 20} />}
                                onClick={handleMarkAllAsReadClick}
                                size={isMobile ? "xs" : "sm"}
                                px={isMobile ? "xs" : "sm"}
                            >
                                {isMobile ? "Đánh dấu" : "Đánh dấu tất cả đã đọc"}
                            </Button>
                        )}
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            size={isMobile ? "md" : "lg"}
                            onClick={refreshNotifications}
                        >
                            <IconRefresh size={isMobile ? 16 : 20} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Paper>

            {notifications.length === 0 ? (
                <Center py="xl">
                    <Alert
                        icon={<IconAlertCircle size={isMobile ? 16 : 20} />}
                        title="Không có thông báo"
                        color="blue"
                        variant="light"
                        radius="md"
                        w="100%"
                    >
                        Bạn chưa có thông báo nào. Hãy quay lại sau!
                    </Alert>
                </Center>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Stack gap="xs" mb="xl">
                        {notifications.map((notification, index) => (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <NotificationCard
                                    notification={notification}
                                    onMarkAsRead={handleMarkAsRead}
                                    isMobile={isMobile}
                                />
                            </motion.div>
                        ))}
                    </Stack>

                    {totalPages > 1 && (
                        <Group justify="center" mt="xl" gap="md" wrap="wrap">
                            <Pagination
                                value={page}
                                onChange={handlePageChange}
                                total={totalPages}
                                withEdges
                                radius="md"
                                size={isMobile ? "xs" : "sm"}
                            />
                            <Text size={isMobile ? "xs" : "sm"} c="dimmed" ta="center">
                                Hiển thị {notifications.length} trong tổng số {total} thông báo
                            </Text>
                        </Group>
                    )}
                </motion.div>
            )}
        </Container>
    );
};

export default NotificationsPage;