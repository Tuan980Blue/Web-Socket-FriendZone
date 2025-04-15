'use client';

import React, { useState, useEffect } from 'react';
import { useFollows } from '@/hooks/useFollows';
import {
    Container,
    Title,
    Tabs,
    Stack,
    Center,
    Text,
} from '@mantine/core';
import UserCard from './components/UserCard';
import LoadingSkeleton from './components/LoadingSkeleton';
import SuggestionsHeader from './components/SuggestionsHeader';

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
    } = useFollows();

    const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
    const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    useEffect(() => {
        if (activeTab === 'followers') {
            setIsLoadingFollowers(true);
            setTimeout(() => setIsLoadingFollowers(false), 500);
        } else if (activeTab === 'following') {
            setIsLoadingFollowing(true);
            setTimeout(() => setIsLoadingFollowing(false), 500);
        } else if (activeTab === 'suggestions') {
            setIsLoadingSuggestions(true);
            setTimeout(() => setIsLoadingSuggestions(false), 500);
        }
    }, [activeTab]);

    return (
        <Container size="md" py="xl">
            <Title order={2} mb="xl" className="text-primary">
                Quan hệ
            </Title>
            <Tabs 
                value={activeTab} 
                onChange={(value) => {
                    if (value === 'followers' || value === 'following' || value === 'suggestions') {
                        setActiveTab(value);
                    }
                }}
                className="bg-white rounded-lg shadow-sm"
            >
                <Tabs.List grow mb="md" className="border-b border-gray-200">
                    <Tabs.Tab 
                        value="followers"
                        className="hover:bg-gray-50 transition-colors duration-200"
                    >
                        Người theo dõi ({followers?.length || 0})
                    </Tabs.Tab>
                    <Tabs.Tab 
                        value="following"
                        className="hover:bg-gray-50 transition-colors duration-200"
                    >
                        Đang theo dõi ({following?.length || 0})
                    </Tabs.Tab>
                    <Tabs.Tab 
                        value="suggestions"
                        className="hover:bg-gray-50 transition-colors duration-200"
                    >
                        Gợi ý ({suggestions?.length || 0})
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="followers">
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
                                />
                            ))}
                            {followers?.length === 0 && (
                                <Center py="xl">
                                    <Text c="dimmed" ta="center">
                                        Chưa có người theo dõi
                                    </Text>
                                </Center>
                            )}
                        </Stack>
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="following">
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
                                />
                            ))}
                            {following?.length === 0 && (
                                <Center py="xl">
                                    <Text c="dimmed" ta="center">
                                        Chưa theo dõi ai
                                    </Text>
                                </Center>
                            )}
                        </Stack>
                    )}
                </Tabs.Panel>

                <Tabs.Panel value="suggestions">
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