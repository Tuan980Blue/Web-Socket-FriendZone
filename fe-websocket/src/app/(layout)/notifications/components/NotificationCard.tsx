import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Card,
    Avatar,
    Text,
    Group,
    Badge,
    ActionIcon,
    Tooltip,
    useMantineTheme,
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
import { useMantineColorScheme } from '@mantine/core';

interface NotificationCardProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    isMobile?: boolean;
}

const getNotificationIcon = (type: Notification['type'], isMobile?: boolean) => {
    const size = isMobile ? 12 : 14;
    switch (type) {
        case 'LIKE':
            return <IconHeart size={size} color="red" />;
        case 'COMMENT':
            return <IconMessageCircle size={size} color="blue" />;
        case 'FOLLOW':
            return <IconUserPlus size={size} color="green" />;
        case 'MENTION':
            return <IconAt size={size} color="purple" />;
        case 'TAG':
            return <IconHash size={size} color="orange" />;
        case 'STORY_VIEW':
            return <IconEye size={size} color="cyan" />;
        case 'STORY_REACTION':
            return <IconMoodSmile size={size} color="yellow" />;
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

export const NotificationCard = ({ notification, onMarkAsRead, isMobile }: NotificationCardProps) => {
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();
    const router = useRouter();

    const handleMarkAsRead = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click when clicking the mark as read button
        onMarkAsRead(notification.id);
    };

    const handleCardClick = () => {
        // Mark as read when clicking the card
        if (!notification.isRead) {
            onMarkAsRead(notification.id);
        }

        // Navigate based on notification type
        switch (notification.type) {
            case 'COMMENT':
            case 'LIKE':
                if (notification.data.postId) {
                    router.push(`/posts/${notification.data.postId}`);
                }
                break;
            case 'FOLLOW':
                if (notification.data.followerId) {
                    router.push(`/profile/${notification.data.followerId}`);
                }
                break;
            // Add other cases as needed
            default:
                break;
        }
    };

    return (
        <Card 
            withBorder 
            padding={isMobile ? "sm" : "md"} 
            radius="md"
            style={{
                backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows.md,
                },
            }}
            onClick={handleCardClick}
        >
            <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Group gap={isMobile ? "xs" : "sm"} wrap="nowrap">
                    <Avatar
                        src={getAvatarUrl(notification) || '/image-person.png'}
                        alt="Avatar"
                        radius="xl"
                        size={isMobile ? "sm" : "md"}
                    />
                    <div style={{ flex: 1 }}>
                        <Text 
                            size={isMobile ? "xs" : "sm"} 
                            fw={500}
                            lineClamp={2}
                        >
                            {notification.content}
                        </Text>
                        <Text size={isMobile ? "10px" : "xs"} c="dimmed">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: vi,
                            })}
                        </Text>
                    </div>
                </Group>

                <Group gap="xs" wrap="nowrap">
                    <Badge
                        color={getNotificationColor(notification.type)}
                        variant="light"
                        leftSection={getNotificationIcon(notification.type, isMobile)}
                        size={isMobile ? "xs" : "sm"}
                    >
                        {notification.type}
                    </Badge>
                    {!notification.isRead && (
                        <Tooltip label="Đánh dấu đã đọc">
                            <ActionIcon
                                variant="light"
                                color="blue"
                                onClick={handleMarkAsRead}
                                size={isMobile ? "xs" : "sm"}
                            >
                                <IconCheck size={isMobile ? 14 : 16} />
                            </ActionIcon>
                        </Tooltip>
                    )}
                </Group>
            </Group>
        </Card>
    );
}; 