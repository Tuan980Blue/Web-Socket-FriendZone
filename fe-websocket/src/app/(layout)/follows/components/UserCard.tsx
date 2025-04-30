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
    UnstyledButton,
} from '@mantine/core';
import { IconUserPlus, IconClock, IconUserCheck } from '@tabler/icons-react';
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
    isMobile?: boolean;
}

const UserCard = ({ 
    user, 
    onFollow, 
    onUnfollow, 
    isLoading,
    variant = 'default',
    isMobile = false
}: UserCardProps) => {
    const isSuggestion = variant === 'suggestion';
    const cardPadding = isMobile ? 'xs' : (isSuggestion ? 'sm' : 'md');
    const avatarSize = isMobile ? 'sm' : (isSuggestion ? 'md' : 'lg');
    const nameSize = isMobile ? 'sm' : (isSuggestion ? 'md' : 'lg');
    const buttonSize = isMobile ? 'compact-xs' : 'xs';

    return (
        <Card 
            withBorder 
            padding={cardPadding} 
            radius="md"
            className="hover:shadow-sm transition-all duration-200 bg-white dark:bg-[#121212] border-[#DBDBDB] dark:border-[#262626]"
        >
            <Group justify="space-between" align="center" gap="sm" wrap="nowrap">
                <UserHoverCard user={user}>
                    <Group gap="sm" className="flex-1" wrap="nowrap">
                        <Link href={`/profile/${user.id}`} className="hover:opacity-80 transition-opacity">
                            <UnstyledButton>
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                                    <div className="relative p-0.5 rounded-full bg-white dark:bg-[#121212]">
                                        <Avatar
                                            src={user.avatar || '/image-person.png'}
                                            alt={user.username || undefined}
                                            size={avatarSize}
                                            radius="xl"
                                            className="border-2 border-white dark:border-[#121212]"
                                        />
                                    </div>
                                </div>
                            </UnstyledButton>
                        </Link>
                        <Stack gap={2} className="flex-1 min-w-0">
                            <Link href={`/profile/${user.id}`} className="hover:opacity-80 transition-opacity">
                                <Text
                                    fw={600}
                                    size={nameSize}
                                    className="text-[#262626] dark:text-white truncate"
                                >
                                    {user.fullName || user.username}
                                </Text>
                                <Text size={isMobile ? "xs" : "sm"} className="text-[#8E8E8E] dark:text-[#A0A0A0] truncate">
                                    @{user.username}
                                </Text>
                            </Link>
                            <Group gap="xs" wrap="wrap">
                                <Badge
                                    variant="light"
                                    color={user.status === 'ONLINE' ? 'green' : 'gray'}
                                    className="bg-opacity-20"
                                    size={isMobile ? "xs" : "sm"}
                                >
                                    {user.status}
                                </Badge>
                                <Group gap={2}>
                                    <IconClock size={isMobile ? 10 : 12} className="text-[#8E8E8E]" />
                                    <Text size={isMobile ? "xs" : "sm"} className="text-[#8E8E8E]">
                                        {formatDistanceToNow(new Date(user.lastSeen), {
                                            addSuffix: true,
                                            locale: vi,
                                        })}
                                    </Text>
                                </Group>
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
                            variant="outline"
                            color="gray"
                            size={buttonSize}
                            radius="xl"
                            onClick={() => onUnfollow(user.id)}
                            loading={isLoading}
                            leftSection={<IconUserCheck size={isMobile ? 12 : 14} />}
                            className="transition-all duration-200 border-[#DBDBDB] dark:border-[#262626] hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700"
                            styles={{
                                root: {
                                    backgroundColor: 'transparent',
                                    '&:hover': {
                                        backgroundColor: 'var(--mantine-color-gray-0)',
                                    },
                                },
                                inner: {
                                    fontWeight: 700,
                                    letterSpacing: '0.3px',
                                },
                                label: {
                                    color: 'var(--mantine-color-gray-7)',
                                    '&:hover': {
                                        color: 'var(--mantine-color-gray-8)',
                                    },
                                },
                            }}
                        >
                            {isMobile ? 'Following' : 'Đang theo dõi'}
                        </Button>
                    ) : (
                        <Button
                            variant="filled"
                            color="blue"
                            size={buttonSize}
                            radius="xl"
                            onClick={() => onFollow(user.id)}
                            loading={isLoading}
                            leftSection={<IconUserPlus size={isMobile ? 12 : 14} />}
                            className="transition-all duration-200 hover:bg-blue-600"
                            styles={{
                                root: {
                                    backgroundColor: 'var(--mantine-color-blue-6)',
                                    '&:hover': {
                                        backgroundColor: 'var(--mantine-color-blue-7)',
                                    },
                                },
                                inner: {
                                    fontWeight: 700,
                                    letterSpacing: '0.3px',
                                },
                                label: {
                                    color: 'white',
                                },
                            }}
                        >
                            {isMobile ? 'Follow' : 'Theo dõi'}
                        </Button>
                    )}
                </Tooltip>
            </Group>
        </Card>
    );
};

export default UserCard; 