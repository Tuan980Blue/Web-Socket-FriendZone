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

interface Notification {
    id: string;
    userId: string;
    type: string;
    data: {
        followerId: string;
        followerUsername: string;
        followerFullName: string;
        followerAvatar: string;
        timestamp: string;
    };
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
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

const getNotificationMessage = (type: string, data: Notification['data']) => {
    switch (type) {
        case 'LIKE':
            return `${data.followerFullName} đã thích bài viết của bạn`;
        case 'COMMENT':
            return `${data.followerFullName} đã bình luận về bài viết của bạn`;
        case 'FOLLOW':
            return `${data.followerFullName} đã theo dõi bạn`;
        case 'MENTION':
            return `${data.followerFullName} đã nhắc đến bạn trong một bình luận`;
        case 'TAG':
            return `${data.followerFullName} đã gắn thẻ bạn trong một bài viết`;
        case 'STORY_VIEW':
            return `${data.followerFullName} đã xem story của bạn`;
        case 'STORY_REACTION':
            return `${data.followerFullName} đã phản ứng với story của bạn`;
        default:
            return 'Bạn có một thông báo mới';
    }
};

export const NotificationCard = ({ notification, onMarkAsRead }: NotificationCardProps) => {
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
                        src={notification.data.followerAvatar || '/image-person.png'}
                        alt={notification.data.followerFullName}
                        size="md"
                        radius="xl"
                    />
                    <div>
                        <Text size="sm" lineClamp={2}>
                            {getNotificationMessage(notification.type, notification.data)}
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