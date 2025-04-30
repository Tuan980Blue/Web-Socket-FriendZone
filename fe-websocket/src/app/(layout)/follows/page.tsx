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
    Avatar,
    UnstyledButton,
} from '@mantine/core';
import { IconUsers, IconUserPlus, IconUserCheck } from '@tabler/icons-react';
import UserCard from './components/UserCard';
import LoadingSkeleton from './components/LoadingSkeleton';
import SuggestionsHeader from './components/SuggestionsHeader';
import {useUserData} from "@/hooks/useUserData";
import { useMediaQuery } from '@mantine/hooks';

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
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <Container size="lg" px={isMobile ? "0" : "md"} py={isMobile ? "xs" : "xl"}>
            <Paper 
                radius="md" 
                p={isMobile ? "md" : "xl"}
                className="bg-white dark:bg-[#121212]"
            >
                <Stack gap="xl">
                    {/* Profile Header */}
                    <Group justify="space-between" align="center" wrap="nowrap">
                        {isLoading ? (
                            <LoadingSkeleton variant="default" count={1} />
                        ) : (
                            <Group gap={isMobile ? "sm" : "xl"} wrap="nowrap">
                                <UnstyledButton>
                                    <Avatar
                                        size={isMobile ? 60 : 80}
                                        radius="xl"
                                        src={user?.avatar || '/image-person.png'}
                                        alt={user?.username || 'User avatar'}
                                        className="border-2 border-[#DBDBDB] dark:border-[#262626]"
                                    />
                                </UnstyledButton>
                                <Stack gap={4} style={{ minWidth: 0 }}>
                                    <Text
                                        size={isMobile ? "md" : "xl"}
                                        fw={600}
                                        className="text-black dark:text-white truncate"
                                    >
                                        {user?.username}
                                    </Text>
                                    <Text size={isMobile ? "xs" : "sm"} c="dimmed" className="truncate">
                                        {user?.fullName || 'Chưa cập nhật tên'}
                                    </Text>
                                </Stack>
                            </Group>
                        )}
                        <Group  gap="xs"
                                wrap="wrap"
                                className="max-md:flex-col max-md:items-start">
                            <Badge 
                                size={isMobile ? "sm" : "lg"}
                                variant="light" 
                                className="bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-[#DBDBDB] dark:border-[#262626]"
                                leftSection={<IconUsers size={isMobile ? 12 : 14} />}
                            >
                                {followers?.length || 0} người theo dõi
                            </Badge>
                            <Badge 
                                size={isMobile ? "sm" : "lg"}
                                variant="light"
                                className="bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-[#DBDBDB] dark:border-[#262626]"
                                leftSection={<IconUserCheck size={isMobile ? 12 : 14} />}
                            >
                                {following?.length || 0} đang theo dõi
                            </Badge>
                        </Group>
                    </Group>

                    {/* Tabs Section */}
                    <Tabs 
                        value={activeTab} 
                        onChange={(value) => {
                            if (value === 'followers' || value === 'following' || value === 'suggestions') {
                                setActiveTab(value);
                            }
                        }}
                        className="bg-transparent"
                    >
                        <Tabs.List grow className="border-b border-[#DBDBDB] dark:border-[#262626]">
                            <Tabs.Tab 
                                value="followers"
                                leftSection={<IconUsers size={isMobile ? 14 : 16} />}
                                className={`hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition-colors duration-200 ${
                                    activeTab === 'followers' ? 'text-black dark:text-white' : 'text-[#8E8E8E]'
                                }`}
                            >
                                {isMobile ? 'Followers' : 'Người theo dõi'}
                            </Tabs.Tab>
                            <Tabs.Tab 
                                value="following"
                                leftSection={<IconUserCheck size={isMobile ? 14 : 16} />}
                                className={`hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition-colors duration-200 ${
                                    activeTab === 'following' ? 'text-black dark:text-white' : 'text-[#8E8E8E]'
                                }`}
                            >
                                {isMobile ? 'Following' : 'Đang theo dõi'}
                            </Tabs.Tab>
                            <Tabs.Tab 
                                value="suggestions"
                                leftSection={<IconUserPlus size={isMobile ? 14 : 16} />}
                                className={`hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition-colors duration-200 ${
                                    activeTab === 'suggestions' ? 'text-black dark:text-white' : 'text-[#8E8E8E]'
                                }`}
                            >
                                {isMobile ? 'Suggestions' : 'Gợi ý'}
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="followers" pt="xl">
                            {isLoadingFollowers ? (
                                <LoadingSkeleton />
                            ) : (
                                <Stack gap="xs">
                                    {followers?.map((user) => (
                                        <UserCard
                                            key={user.id}
                                            user={user}
                                            onFollow={handleFollow}
                                            onUnfollow={handleUnfollow}
                                            isLoading={isLoadingFollowers}
                                            showFollowButton={!user.isFollowing}
                                            showUnfollowButton={user.isFollowing}
                                            isMobile={isMobile}
                                        />
                                    ))}
                                    {followers?.length === 0 && (
                                        <Center py="xl">
                                            <Text className="text-[#8E8E8E] dark:text-[#A0A0A0]" ta="center" size={isMobile ? "sm" : "lg"}>
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
                                <Stack gap="xs">
                                    {following?.map((user) => (
                                        <UserCard
                                            key={user.id}
                                            user={user}
                                            onFollow={handleFollow}
                                            onUnfollow={handleUnfollow}
                                            isLoading={isLoadingFollowing}
                                            showFollowButton={false}
                                            showUnfollowButton={true}
                                            isMobile={isMobile}
                                        />
                                    ))}
                                    {following?.length === 0 && (
                                        <Center py="xl">
                                            <Text className="text-[#8E8E8E] dark:text-[#A0A0A0]" ta="center" size={isMobile ? "sm" : "lg"}>
                                                Chưa theo dõi ai
                                            </Text>
                                        </Center>
                                    )}
                                </Stack>
                            )}
                        </Tabs.Panel>

                        <Tabs.Panel value="suggestions" pt="xl">
                            <Stack gap="xs">
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
                                                isMobile={isMobile}
                                            />
                                        ))}
                                        {suggestions?.length === 0 && (
                                            <Center py="xl">
                                                <Text className="text-[#8E8E8E] dark:text-[#A0A0A0]" ta="center" size={isMobile ? "sm" : "lg"}>
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