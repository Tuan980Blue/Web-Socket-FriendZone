'use client';

import React from 'react';
import { useFollows } from '@/hooks/useFollows';
import {
    Container,
    Title,
    Tabs,
    Card,
    Avatar,
    Text,
    Group,
    Button,
    Skeleton,
    Stack,
    Badge,
    ActionIcon,
    Tooltip,
    Divider,
    Center,
    rem,
} from '@mantine/core';
import { IconUserPlus, IconUserMinus, IconClock, IconRefresh } from '@tabler/icons-react';
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
}

const UserCard = ({ user, onFollow, onUnfollow, isLoading, showMutualFollowers = false }: UserCardProps) => {
    return (
        <Card withBorder padding="lg" radius="md">
            <Group justify="space-between" align="flex-start">
                <Group gap="sm">
                    <Avatar
                        src={user.avatar}
                        alt={user.username}
                        size="lg"
                        radius="xl"
                    />
                    <div>
                        <Text fw={500} size="lg">
                            {user.fullName}
                        </Text>
                        <Text size="sm" c="dimmed">
                            @{user.username}
                        </Text>
                        {user.bio && (
                            <Text size="sm" mt="xs" lineClamp={2}>
                                {user.bio}
                            </Text>
                        )}
                        <Group gap="xs" mt="xs">
                            <Badge
                                variant="light"
                                color={user.status === 'ONLINE' ? 'green' : 'gray'}
                            >
                                {user.status}
                            </Badge>
                            <Group gap={4}>
                                <IconClock size={14} />
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
                        color={user.isFollowing ? 'red' : 'blue'}
                        size="lg"
                        radius="xl"
                        onClick={() =>
                            user.isFollowing ? onUnfollow(user.id) : onFollow(user.id)
                        }
                        loading={isLoading}
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

const SuggestionCard = ({ user, onFollow, isLoading }: UserCardProps) => {
    return (
        <Card withBorder padding="md" radius="md">
            <Group justify="space-between" align="center">
                <Group gap="sm">
                    <Avatar
                        src={user.avatar}
                        alt={user.username}
                        size="md"
                        radius="xl"
                    />
                    <div>
                        <Text fw={500} size="sm">
                            {user.fullName}
                        </Text>
                        <Text size="xs" c="dimmed">
                            @{user.username}
                        </Text>
                        {user.mutualFollowersCount && user.mutualFollowersCount > 0 && (
                            <Text size="xs" c="dimmed" mt={2}>
                                {user.mutualFollowersCount} bạn chung
                            </Text>
                        )}
                    </div>
                </Group>
                <Button
                    variant="light"
                    color="blue"
                    size="xs"
                    radius="xl"
                    leftSection={<IconUserPlus size={14} />}
                    onClick={() => onFollow(user.id)}
                    loading={isLoading}
                >
                    Theo dõi
                </Button>
            </Group>
        </Card>
    );
};

const LoadingSkeleton = () => (
    <Stack gap="md">
        {[1, 2, 3].map((i) => (
            <Card withBorder padding="lg" radius="md" key={i}>
                <Group gap="sm">
                    <Skeleton height={50} circle />
                    <div style={{ flex: 1 }}>
                        <Skeleton height={20} width="40%" mb="xs" />
                        <Skeleton height={15} width="20%" />
                    </div>
                </Group>
            </Card>
        ))}
    </Stack>
);

const SuggestionLoadingSkeleton = () => (
    <Stack gap="md">
        {[1, 2, 3, 4, 5].map((i) => (
            <Card withBorder padding="md" radius="md" key={i}>
                <Group gap="sm">
                    <Skeleton height={40} circle />
                    <div style={{ flex: 1 }}>
                        <Skeleton height={16} width="30%" mb="xs" />
                        <Skeleton height={12} width="20%" />
                    </div>
                    <Skeleton height={24} width={80} radius="xl" />
                </Group>
            </Card>
        ))}
    </Stack>
);

const FollowsPage = () => {
    const {
        followers,
        following,
        suggestions,
        activeTab,
        setActiveTab,
        isLoadingFollowers,
        isLoadingFollowing,
        isLoadingSuggestions,
        handleFollow,
        handleUnfollow,
        isFollowing,
        isUnfollowing,
        refreshSuggestions,
    } = useFollows();

    return (
        <Container size="md" py="xl">
            <Title order={2} mb="xl">
                Quan hệ
            </Title>
            <Tabs 
                value={activeTab} 
                onChange={(value) => {
                    if (value === 'followers' || value === 'following' || value === 'suggestions') {
                        setActiveTab(value);
                    }
                }}
            >
                <Tabs.List grow mb="md">
                    <Tabs.Tab value="followers">
                        Người theo dõi ({followers?.length || 0})
                    </Tabs.Tab>
                    <Tabs.Tab value="following">
                        Đang theo dõi ({following?.length || 0})
                    </Tabs.Tab>
                    <Tabs.Tab value="suggestions">
                        Gợi ý ({suggestions?.length || 0})
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="followers">
                    {isLoadingFollowers ? (
                        <LoadingSkeleton />
                    ) : (
                        <Stack gap="md">
                            {followers?.map((user: User) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    onFollow={handleFollow}
                                    onUnfollow={handleUnfollow}
                                    isLoading={isFollowing || isUnfollowing}
                                />
                            ))}
                            {followers?.length === 0 && (
                                <Text c="dimmed" ta="center" py="xl">
                                    Chưa có người theo dõi
                                </Text>
                            )}
                        </Stack>
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="following">
                    {isLoadingFollowing ? (
                        <LoadingSkeleton />
                    ) : (
                        <Stack gap="md">
                            {following?.map((user: User) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    onFollow={handleFollow}
                                    onUnfollow={handleUnfollow}
                                    isLoading={isFollowing || isUnfollowing}
                                />
                            ))}
                            {following?.length === 0 && (
                                <Text c="dimmed" ta="center" py="xl">
                                    Chưa theo dõi ai
                                </Text>
                            )}
                        </Stack>
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="suggestions">
                    <Stack gap="md">
                        <Group justify="space-between" align="center">
                            <Text fw={500} size="lg">
                                Gợi ý cho bạn
                            </Text>
                            <Button
                                variant="subtle"
                                color="gray"
                                size="xs"
                                leftSection={<IconRefresh size={14} />}
                                onClick={refreshSuggestions}
                                loading={isLoadingSuggestions}
                            >
                                Làm mới
                            </Button>
                        </Group>
                        <Divider />
                        {isLoadingSuggestions ? (
                            <SuggestionLoadingSkeleton />
                        ) : (
                            <Stack gap="md">
                                {suggestions?.map((user: User) => (
                                    <SuggestionCard
                                        key={user.id}
                                        user={user}
                                        onFollow={handleFollow}
                                        onUnfollow={handleUnfollow}
                                        isLoading={isFollowing || isUnfollowing}
                                        showMutualFollowers
                                    />
                                ))}
                                {suggestions?.length === 0 && (
                                    <Center py="xl">
                                        <Text c="dimmed" ta="center">
                                            Không có gợi ý nào
                                        </Text>
                                    </Center>
                                )}
                            </Stack>
                        )}
                    </Stack>
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
};

export default FollowsPage;