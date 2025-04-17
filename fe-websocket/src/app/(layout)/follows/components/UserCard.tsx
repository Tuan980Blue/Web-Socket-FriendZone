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
import UserHoverCard from "@/components/UserHoverCard";

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
    const cardPadding = isSuggestion ? 'sm' : 'md';
    const avatarSize = isSuggestion ? 'sm' : 'md';
    const nameSize = isSuggestion ? 'sm' : 'md';

    return (
        <Card 
            withBorder 
            padding={cardPadding} 
            radius="md"
            className="hover:shadow-md transition-all duration-200 bg-white dark:bg-[#121212] border-[#DBDBDB] dark:border-[#262626]"
        >
            <Group justify="space-between" align="center" gap="sm">
                <UserHoverCard user={user}>
                <Group gap="sm" className="flex-1">
                        <Link href={`/profile/${user.id}`} className="hover:opacity-80 transition-opacity">
                            <div className="relative">
                                    <div
                                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                                    <div className="relative p-0.5 rounded-full bg-white dark:bg-[#121212]">
                                        <Avatar
                                            src={user.avatar}
                                            alt={user.username}
                                            size={avatarSize}
                                            radius="xl"
                                            className="border-2 border-white dark:border-[#121212]"
                                        />
                                    </div>
                            </div>
                        </Link>
                        <Stack gap={2} className="flex-1">
                            <Link href={`/profile/${user.id}`} className="hover:opacity-80 transition-opacity">
                                <Text
                                    fw={500}
                                    size={nameSize}
                                    className="text-[#262626] dark:text-white"
                                >
                                    {user.fullName || user.username}
                                </Text>
                                <Text size="xs" className="text-[#8E8E8E] dark:text-[#A0A0A0]">
                                    @{user.username}
                                </Text>
                            </Link>
                            <Group gap="xs" wrap="wrap">
                                <Badge
                                    variant="light"
                                    color={user.status === 'ONLINE' ? 'green' : 'gray'}
                                    className="bg-opacity-20"
                                    size="xs"
                                >
                                    {user.status}
                                </Badge>
                                <Group gap={2}>
                                    <IconClock size={12} className="text-[#8E8E8E]" />
                                    <Text size="xs" className="text-[#8E8E8E]">
                                        {formatDistanceToNow(new Date(user.lastSeen), {
                                            addSuffix: true,
                                            locale: vi,
                                        })}
                                    </Text>
                                </Group>
                                {showMutualFollowers && user.mutualFollowersCount && user.mutualFollowersCount > 0 && (
                                    <Group gap={2}>
                                        <IconUsers size={12} className="text-[#8E8E8E]" />
                                        <Text size="xs" className="text-[#8E8E8E]">
                                            {user.mutualFollowersCount} bạn chung
                                        </Text>
                                    </Group>
                                )}
                                <Text size="xs" className="text-[#8E8E8E]">
                                    {user.followersCount} người theo dõi
                                </Text>
                            </Group>
                        </Stack>
                </Group>
            </UserHoverCard>
                <Tooltip
                    label={user.isFollowing ? 'Hủy theo dõi' : 'Theo dõi'}
                    position="left"
                >
                    {user.isFollowing ? (
                        <Button
                            variant="light"
                            color="red"
                            size="xs"
                            radius="xl"
                            onClick={() => onUnfollow(user.id)}
                            loading={isLoading}
                            className="transition-transform duration-200 bg-red-50 dark:bg-red-900/20"
                        >
                            Đang theo dõi
                        </Button>
                    ) : (
                        <Button
                            variant="filled"
                            size="xs"
                            radius="xl"
                            onClick={() => onFollow(user.id)}
                            loading={isLoading}
                            leftSection={<IconUserPlus size={12} />}
                            className="bg-[#0095F6] hover:bg-[#1877F2]"
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