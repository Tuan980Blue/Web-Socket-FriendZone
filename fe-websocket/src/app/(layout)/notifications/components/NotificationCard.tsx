import React from 'react';
import {
    Card,
    Avatar,
    Text,
    Group,
    Badge,
    ActionIcon,
    Tooltip,
} from '@mantine/core';
import {
    IconHeart,
    IconMessageCircle,
    IconUserPlus,
    IconMoodSmile,
    IconCheck,
    IconAt,
    IconHash,
    IconEye,
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Notification } from '@/services/notificationService';

interface NotificationCardProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
}

const getNotificationIcon = (type: Notification['type']) => {
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

const getNotificationColor = (type: Notification['type']) => {
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

const getAvatarUrl = (notification: Notification) => {
    const data = notification.data;
    switch (notification.type) {
        case 'FOLLOW':
            return data.followerAvatar;
        case 'LIKE':
            return data.likerAvatar;
        case 'COMMENT':
            return data.commenterAvatar;
        case 'MENTION':
            return data.mentionerAvatar;
        case 'TAG':
            return data.taggerAvatar;
        case 'STORY_VIEW':
            return data.viewerAvatar;
        case 'STORY_REACTION':
            return data.reactorAvatar;
        default:
            return '/image-person.png';
    }
};

export const NotificationCard = ({ notification, onMarkAsRead }: NotificationCardProps) => {
    const handleMarkAsRead = () => {
        onMarkAsRead(notification.id);
    };

    return (
        <Card withBorder padding="lg" radius="md">
            <Group justify="space-between" align="flex-start">
                <Group gap="sm">
                    <Avatar
                        src={getAvatarUrl(notification)}
                        alt="Avatar"
                        radius="xl"
                        size="md"
                    />
                    <div>
                        <Text size="sm" fw={500}>
                            {notification.content}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: vi,
                            })}
                        </Text>
                    </div>
                </Group>

                <Group gap="xs">
                    <Badge
                        color={getNotificationColor(notification.type)}
                        variant="light"
                        leftSection={getNotificationIcon(notification.type)}
                    >
                        {notification.type}
                    </Badge>
                    {!notification.isRead && (
                        <Tooltip label="Đánh dấu đã đọc">
                            <ActionIcon
                                variant="light"
                                color="blue"
                                onClick={handleMarkAsRead}
                            >
                                <IconCheck size={16} />
                            </ActionIcon>
                        </Tooltip>
                    )}
                </Group>
            </Group>
        </Card>
    );
}; 