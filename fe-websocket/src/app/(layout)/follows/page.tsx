'use client';

import React from 'react';
import { useFollows } from '@/hooks/useFollows';
import {
    Container,
    Tabs,
    Stack,
    Center,
    Text,
    Paper,
    Group,
    Badge,
} from '@mantine/core';
import { IconUsers, IconUserPlus, IconUserCheck } from '@tabler/icons-react';
import UserCard from './components/UserCard';
import LoadingSkeleton from './components/LoadingSkeleton';
import SuggestionsHeader from './components/SuggestionsHeader';
import {useUserData} from "@/hooks/useUserData";
import Image from 'next/image';

const FollowsPage = () => {
    const {
        followers,
        following,
        suggestions,
        activeTab,
        setActiveTab,
        handleFollow,
        handleUnfollow,
        refreshSuggestions,
        isLoadingFollowers,
        isLoadingFollowing,
        isLoadingSuggestions
    } = useFollows();

    const { user, isLoading } = useUserData();

    return (
        <Container size="lg">
            <Paper 
                radius="lg" 
                p="xl"
                className="bg-[#FAFAFA] dark:bg-[#121212] shadow-sm border border-[#DBDBDB] dark:border-[#262626]"
            >
                <Stack gap="xl">
                    <Group justify="space-between" align="center">
                        {isLoading ? (
                            <LoadingSkeleton variant="default" count={1} />
                        ) : (
                            <Group gap="xl">
                                <Group gap="md">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] p-[2px]">
                                            <div className="w-full h-full rounded-full bg-white dark:bg-[#121212] p-[2px]">
                                                <Image 
                                                    src={user?.avatar || '/default-avatar.png'}
                                                    alt={user?.username || 'User avatar'}
                                                    width={40}
                                                    height={40}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Stack gap={4}>
                                        <Text
                                            size="xl"
                                            fw={600}
                                            className="text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]"
                                        >
                                            {user?.username}
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                            {user?.fullName || 'Chưa cập nhật tên'}
                                        </Text>
                                    </Stack>
                                </Group>
                            </Group>
                        )}
                        <Group gap="xs">
                            <Badge 
                                size="lg" 
                                variant="light" 
                                className="bg-gradient-to-r from-[#F58529]/10 via-[#DD2A7B]/10 to-[#515BD4]/10 border-0"
                                leftSection={<IconUsers size={14} className="text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]" />}
                            >
                                {followers?.length || 0} người theo dõi
                            </Badge>
                            <Badge 
                                size="lg" 
                                variant="light"
                                className="bg-gradient-to-r from-[#F58529]/10 via-[#DD2A7B]/10 to-[#515BD4]/10 border-0"
                                leftSection={<IconUserCheck size={14} className="text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]" />}
                            >
                                {following?.length || 0} đang theo dõi
                            </Badge>
                        </Group>
                    </Group>

                    <Tabs 
                        value={activeTab} 
                        onChange={(value) => {
                            if (value === 'followers' || value === 'following' || value === 'suggestions') {
                                setActiveTab(value);
                            }
                        }}
                        className="bg-transparent"
                    >
                        <Tabs.List className="border-b border-[#DBDBDB] dark:border-[#262626]">
                            <Tabs.Tab 
                                value="followers"
                                leftSection={<IconUsers size={16} className="text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]" />}
                                className={`hover:bg-[#FAFAFA] dark:hover:bg-[#121212] transition-colors duration-200 ${
                                    activeTab === 'followers' ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]' : 'text-[#8E8E8E]'
                                }`}
                            >
                                Người theo dõi ({followers?.length || 0})
                            </Tabs.Tab>
                            <Tabs.Tab 
                                value="following"
                                leftSection={<IconUserCheck size={16} className="text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]" />}
                                className={`hover:bg-[#FAFAFA] dark:hover:bg-[#121212] transition-colors duration-200 ${
                                    activeTab === 'following' ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]' : 'text-[#8E8E8E]'
                                }`}
                            >
                                Đang theo dõi ({following?.length || 0})
                            </Tabs.Tab>
                            <Tabs.Tab 
                                value="suggestions"
                                leftSection={<IconUserPlus size={16} className="text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]" />}
                                className={`hover:bg-[#FAFAFA] dark:hover:bg-[#121212] transition-colors duration-200 ${
                                    activeTab === 'suggestions' ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4]' : 'text-[#8E8E8E]'
                                }`}
                            >
                                Gợi ý ({suggestions?.length || 0})
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="followers" pt="xl">
                            {isLoadingFollowers ? (
                                <LoadingSkeleton />
                            ) : (
                                <Stack gap="md">
                                    {followers?.map((user) => (
                                        <UserCard
                                            key={user.id}
                                            user={user}
                                            onFollow={handleFollow}
                                            onUnfollow={handleUnfollow}
                                            isLoading={isLoadingFollowers}
                                            showFollowButton={!user.isFollowing}
                                            showUnfollowButton={user.isFollowing}
                                        />
                                    ))}
                                    {followers?.length === 0 && (
                                        <Center py="xl">
                                            <Text className="text-[#8E8E8E] dark:text-[#A0A0A0]" ta="center" size="lg">
                                                Chưa có người theo dõi
                                            </Text>
                                        </Center>
                                    )}
                                </Stack>
                            )}
                        </Tabs.Panel>

                        <Tabs.Panel value="following" pt="xl">
                            {isLoadingFollowing ? (
                                <LoadingSkeleton />
                            ) : (
                                <Stack gap="md">
                                    {following?.map((user) => (
                                        <UserCard
                                            key={user.id}
                                            user={user}
                                            onFollow={handleFollow}
                                            onUnfollow={handleUnfollow}
                                            isLoading={isLoadingFollowing}
                                            showFollowButton={false}
                                            showUnfollowButton={true}
                                        />
                                    ))}
                                    {following?.length === 0 && (
                                        <Center py="xl">
                                            <Text className="text-[#8E8E8E] dark:text-[#A0A0A0]" ta="center" size="lg">
                                                Chưa theo dõi ai
                                            </Text>
                                        </Center>
                                    )}
                                </Stack>
                            )}
                        </Tabs.Panel>

                        <Tabs.Panel value="suggestions" pt="xl">
                            <Stack gap="md">
                                <SuggestionsHeader 
                                    onRefresh={refreshSuggestions}
                                    isLoading={isLoadingSuggestions}
                                />
                                {isLoadingSuggestions ? (
                                    <LoadingSkeleton variant="suggestion" count={5} />
                                ) : (
                                    <Stack gap="md">
                                        {suggestions?.map((user) => (
                                            <UserCard
                                                key={user.id}
                                                user={user}
                                                onFollow={handleFollow}
                                                onUnfollow={handleUnfollow}
                                                isLoading={isLoadingSuggestions}
                                                variant="suggestion"
                                                showMutualFollowers
                                                showFollowButton={!user.isFollowing}
                                                showUnfollowButton={user.isFollowing}
                                            />
                                        ))}
                                        {suggestions?.length === 0 && (
                                            <Center py="xl">
                                                <Text className="text-[#8E8E8E] dark:text-[#A0A0A0]" ta="center" size="lg">
                                                    Không có gợi ý nào
                                                </Text>
                                            </Center>
                                        )}
                                    </Stack>
                                )}
                            </Stack>
                        </Tabs.Panel>
                    </Tabs>
                </Stack>
            </Paper>
        </Container>
    );
};

export default FollowsPage;