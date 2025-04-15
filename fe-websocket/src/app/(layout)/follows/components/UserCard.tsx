import React from 'react';
import {
    Card,
    Avatar,
    Text,
    Group,
    ActionIcon,
    Tooltip,
    Badge,
} from '@mantine/core';
import { IconUserPlus, IconUserMinus, IconClock } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface User {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
    bio: string;
    status: string;
    lastSeen: string;
    followersCount: number;
    followingCount: number;
    mutualFollowersCount?: number;
    isFollowing?: boolean;
}

interface UserCardProps {
    user: User;
    onFollow: (userId: string) => void;
    onUnfollow: (userId: string) => void;
    isLoading: boolean;
    showMutualFollowers?: boolean;
    variant?: 'default' | 'suggestion';
}

const UserCard = ({ 
    user, 
    onFollow, 
    onUnfollow, 
    isLoading, 
    showMutualFollowers = false,
    variant = 'default'
}: UserCardProps) => {
    const isSuggestion = variant === 'suggestion';
    const cardPadding = isSuggestion ? 'md' : 'lg';
    const avatarSize = isSuggestion ? 'md' : 'lg';
    const nameSize = isSuggestion ? 'sm' : 'lg';

    return (
        <Card 
            withBorder 
            padding={cardPadding} 
            radius="md"
            className="hover:shadow-md transition-shadow duration-200"
        >
            <Group justify="space-between" align="flex-start">
                <Group gap="sm">
                    <Avatar
                        src={user.avatar}
                        alt={user.username}
                        size={avatarSize}
                        radius="xl"
                        className="border-2 border-primary"
                    />
                    <div>
                        <Text fw={500} size={nameSize} className="text-primary">
                            {user.fullName}
                        </Text>
                        <Text size="sm" c="dimmed">
                            @{user.username}
                        </Text>
                        {!isSuggestion && user.bio && (
                            <Text size="sm" mt="xs" lineClamp={2}>
                                {user.bio}
                            </Text>
                        )}
                        <Group gap="xs" mt="xs">
                            <Badge
                                variant="light"
                                color={user.status === 'ONLINE' ? 'green' : 'gray'}
                                className="bg-opacity-20"
                            >
                                {user.status}
                            </Badge>
                            <Group gap={4}>
                                <IconClock size={14} className="text-gray-500" />
                                <Text size="xs" c="dimmed">
                                    {formatDistanceToNow(new Date(user.lastSeen), {
                                        addSuffix: true,
                                        locale: vi,
                                    })}
                                </Text>
                            </Group>
                            {showMutualFollowers && user.mutualFollowersCount && user.mutualFollowersCount > 0 && (
                                <Text size="xs" c="dimmed">
                                    {user.mutualFollowersCount} bạn chung
                                </Text>
                            )}
                        </Group>
                    </div>
                </Group>
                <Tooltip
                    label={user.isFollowing ? 'Hủy theo dõi' : 'Theo dõi'}
                    position="left"
                >
                    <ActionIcon
                        variant={user.isFollowing ? 'light' : 'filled'}
                        color={user.isFollowing ? 'red' : 'primary'}
                        size="lg"
                        radius="xl"
                        onClick={() =>
                            user.isFollowing ? onUnfollow(user.id) : onFollow(user.id)
                        }
                        loading={isLoading}
                        className="hover:scale-110 transition-transform duration-200"
                    >
                        {user.isFollowing ? (
                            <IconUserMinus size={20} />
                        ) : (
                            <IconUserPlus size={20} />
                        )}
                    </ActionIcon>
                </Tooltip>
            </Group>
        </Card>
    );
};

export default UserCard; 