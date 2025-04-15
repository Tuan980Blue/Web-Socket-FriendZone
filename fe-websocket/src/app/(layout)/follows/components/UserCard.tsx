import React from 'react';
import {
    Card,
    Avatar,
    Text,
    Group,
    Button,
    Tooltip,
    Badge,
    Stack,
} from '@mantine/core';
import { IconUserPlus, IconClock, IconUsers } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { User } from '@/types/user';
import Link from 'next/link';

export interface UserCardProps {
    user: User;
    onFollow: (userId: string) => Promise<void>;
    onUnfollow: (userId: string) => Promise<void>;
    isLoading?: boolean;
    variant?: 'default' | 'suggestion';
    showMutualFollowers?: boolean;
    showFollowButton?: boolean;
    showUnfollowButton?: boolean;
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
            radius="lg"
            className="hover:shadow-lg transition-all duration-300 bg-[#FAFAFA] dark:bg-[#121212] border-[#DBDBDB] dark:border-[#262626]"
        >
            <Group justify="space-between" align="flex-start">
                <Group gap="md" className="flex-1">
                    <Link href={`/profile/${user.id}`} className="hover:opacity-80 transition-opacity">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                            <div className="relative p-0.5 rounded-full bg-[#FAFAFA] dark:bg-[#121212]">
                                <Avatar
                                    src={user.avatar}
                                    alt={user.username}
                                    size={avatarSize}
                                    radius="xl"
                                    className="border-2 border-[#FAFAFA] dark:border-[#121212]"
                                />
                            </div>
                        </div>
                    </Link>
                    <Stack gap={4} className="flex-1">
                        <Link href={`/profile/${user.id}`} className="hover:opacity-80 transition-opacity">
                            <Text 
                                fw={600} 
                                size={nameSize} 
                                className="text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]"
                            >
                                {user.fullName}
                            </Text>
                            <Text size="sm" className="text-[#8E8E8E] dark:text-[#A0A0A0]">
                                @{user.username}
                            </Text>
                        </Link>
                        <Group wrap="wrap">
                            <Badge
                                variant="light"
                                color={user.status === 'ONLINE' ? 'green' : 'gray'}
                                className="bg-opacity-20"
                                size="sm"
                            >
                                {user.status}
                            </Badge>
                            <Group gap={4}>
                                <IconClock size={14} className="text-[#8E8E8E]" />
                                <Text size="xs" className="text-[#8E8E8E]">
                                    {formatDistanceToNow(new Date(user.lastSeen), {
                                        addSuffix: true,
                                        locale: vi,
                                    })}
                                </Text>
                            </Group>
                            {showMutualFollowers && user.mutualFollowersCount && user.mutualFollowersCount > 0 && (
                                <Group gap={4}>
                                    <IconUsers size={14} className="text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]" />
                                    <Text size="xs" className="text-[#8E8E8E]">
                                        {user.mutualFollowersCount} bạn chung
                                    </Text>
                                </Group>
                            )}
                            <Text size="xs" color={"pink"}>
                                {user.followersCount} người theo dõi
                            </Text>
                        </Group>
                    </Stack>
                </Group>
                <Tooltip
                    label={user.isFollowing ? 'Hủy theo dõi' : 'Theo dõi'}
                    position="left"
                >
                    {user.isFollowing ? (
                        <Button
                            variant="light"
                            color="red"
                            size="sm"
                            radius="xl"
                            onClick={() => onUnfollow(user.id)}
                            loading={isLoading}
                            className="transition-transform duration-200 bg-red-50 dark:bg-red-900/20"
                        >
                            Đang theo dõi
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size={"compact-sm"}
                            radius="md"
                            onClick={() => onFollow(user.id)}
                            loading={isLoading}
                            leftSection={<IconUserPlus size={14} />}
                        >
                            Theo dõi
                        </Button>
                    )}
                </Tooltip>
            </Group>
        </Card>
    );
};

export default UserCard; 