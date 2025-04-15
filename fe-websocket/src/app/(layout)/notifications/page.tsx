'use client';

import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import {
    Container,
    Title,
    Card,
    Avatar,
    Text,
    Group,
    Badge,
    ActionIcon,
    Tooltip,
    Skeleton,
    Stack,
    Center,
    Button,
} from '@mantine/core';
import {
    IconHeart,
    IconMessageCircle,
    IconUserPlus,
    IconMoodSmile,
    IconCheck,
    IconRefresh,
    IconAt,
    IconHash,
    IconEye,
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Notification {
    id: string;
    type: string;
    data: string;
    isRead: boolean;
    createdAt: string;
}

interface NotificationCardProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
}

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'LIKE':
            return <IconHeart size={20} color="red" />;
        case 'COMMENT':
            return <IconMessageCircle size={20} color="blue" />;
        case 'FOLLOW':
            return <IconUserPlus size={20} color="green" />;
        case 'MENTION':
            return <IconAt size={20} color="purple" />;
        case 'TAG':
            return <IconHash size={20} color="orange" />;
        case 'STORY_VIEW':
            return <IconEye size={20} color="cyan" />;
        case 'STORY_REACTION':
            return <IconMoodSmile size={20} color="yellow" />;
        default:
            return null;
    }
};

const getNotificationColor = (type: string) => {
    switch (type) {
        case 'LIKE':
            return 'red';
        case 'COMMENT':
            return 'blue';
        case 'FOLLOW':
            return 'green';
        case 'MENTION':
            return 'purple';
        case 'TAG':
            return 'orange';
        case 'STORY_VIEW':
            return 'cyan';
        case 'STORY_REACTION':
            return 'yellow';
        default:
            return 'gray';
    }
};

const NotificationCard = ({ notification, onMarkAsRead }: NotificationCardProps) => {
    const data = JSON.parse(notification.data);

    return (
        <Card
            withBorder
            padding="lg"
            radius="md"
            style={{
                opacity: notification.isRead ? 0.7 : 1,
            }}
        >
            <Group justify="space-between" align="flex-start">
                <Group gap="sm">
                    <Avatar
                        src={data.actorAvatar}
                        alt={data.actorName}
                        size="md"
                        radius="xl"
                    />
                    <div>
                        <Text size="sm" lineClamp={2}>
                            <Text component="span" fw={500}>
                                {data.actorName}
                            </Text>{' '}
                            {data.message}
                        </Text>
                        <Group gap="xs" mt="xs">
                            <Badge
                                variant="light"
                                color={getNotificationColor(notification.type)}
                            >
                                {getNotificationIcon(notification.type)}
                            </Badge>
                            <Text size="xs" c="dimmed">
                                {formatDistanceToNow(
                                    new Date(notification.createdAt),
                                    {
                                        addSuffix: true,
                                        locale: vi,
                                    }
                                )}
                            </Text>
                        </Group>
                    </div>
                </Group>
                {!notification.isRead && (
                    <Tooltip label="Đánh dấu đã đọc" position="left">
                        <ActionIcon
                            variant="light"
                            color="blue"
                            size="lg"
                            radius="xl"
                            onClick={() => onMarkAsRead(notification.id)}
                        >
                            <IconCheck size={20} />
                        </ActionIcon>
                    </Tooltip>
                )}
            </Group>
        </Card>
    );
};

const LoadingSkeleton = () => (
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

const NotificationsPage = () => {
    const {
        notifications,
        isLoading,
        unreadCount,
        handleMarkAsRead,
        handleMarkAllAsRead,
        refreshNotifications
    } = useNotifications();

    return (
        <Container size="md" py="xl">
            <Group justify="space-between" mb="xl">
                <Title order={2}>Thông báo</Title>
                <Group>
                    <Button
                        variant="light"
                        leftSection={<IconCheck size={20} />}
                        onClick={handleMarkAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        Đánh dấu tất cả đã đọc
                    </Button>
                    <Button
                        variant="light"
                        leftSection={<IconRefresh size={20} />}
                        onClick={refreshNotifications}
                    >
                        Làm mới
                    </Button>
                </Group>
            </Group>

            {isLoading ? (
                <LoadingSkeleton />
            ) : notifications.length === 0 ? (
                <Center py="xl">
                    <Text c="dimmed">Không có thông báo nào</Text>
                </Center>
            ) : (
                <Stack gap="md">
                    {notifications.map((notification) => (
                        <NotificationCard
                            key={notification.id}
                            notification={notification as unknown as Notification}
                            onMarkAsRead={handleMarkAsRead}
                        />
                    ))}
                </Stack>
            )}
        </Container>
    );
};

export default NotificationsPage;