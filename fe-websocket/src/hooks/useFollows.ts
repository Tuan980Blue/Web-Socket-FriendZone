import { useState, useCallback } from 'react';
import { followService } from '../services/followService';
import { User } from '@/types/user';

export const useFollows = () => {
    const [activeTab, setActiveTab] = useState<'followers' | 'following' | 'suggestions'>('followers');
    const [followers, setFollowers] = useState<User[]>([]);
    const [following, setFollowing] = useState<User[]>([]);
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
        followers: false,
        following: false,
        suggestions: false
    });

    // Fetch data only when needed
    const fetchFollowers = useCallback(async () => {
        setIsLoading(prev => ({ ...prev, followers: true }));
        try {
            const data = await followService.getFollowers();

            setFollowers(data);
        } catch (error) {
            console.error('Error fetching followers:', error);
        } finally {
            setIsLoading(prev => ({ ...prev, followers: false }));
        }
    }, []);

    const fetchFollowing = useCallback(async () => {
        setIsLoading(prev => ({ ...prev, following: true }));
        try {
            const data = await followService.getFollowing();
            // All users in following list are being followed
            const followingWithStatus = data.map(user => ({ ...user, isFollowing: true }));
            setFollowing(followingWithStatus);
        } catch (error) {
            console.error('Error fetching following:', error);
        } finally {
            setIsLoading(prev => ({ ...prev, following: false }));
        }
    }, []);

    const fetchSuggestions = useCallback(async () => {
        setIsLoading(prev => ({ ...prev, suggestions: true }));
        try {
            const data = await followService.getSuggestions();
            // Check follow status for each suggestion
            const suggestionsWithStatus = await Promise.all(
                data.map(async (user) => {
                    const isFollowing = await followService.checkFollowStatus(user.id);
                    return { ...user, isFollowing };
                })
            );
            setSuggestions(suggestionsWithStatus);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setIsLoading(prev => ({ ...prev, suggestions: false }));
        }
    }, []);

    // Handle follow/unfollow with optimistic updates
    const handleFollow = useCallback(async (userId: string) => {
        try {
            // Optimistic update for all lists
            setFollowers(prev => 
                prev.map(user => 
                    user.id === userId 
                        ? { ...user, isFollowing: true }
                        : user
                )
            );
            setSuggestions(prev => 
                prev.map(user => 
                    user.id === userId 
                        ? { ...user, isFollowing: true }
                        : user
                )
            );

            await followService.followUser(userId);

            // Refresh lists to ensure consistency
            if (activeTab === 'followers') {
                fetchFollowers();
            } else if (activeTab === 'suggestions') {
                fetchSuggestions();
            }
        } catch (error) {
            console.error('Error following user:', error);
            // Revert optimistic updates on error
            setFollowers(prev =>
                prev.map(user =>
                    user.id === userId
                        ? { ...user, isFollowing: false }
                        : user
                )
            );
            setSuggestions(prev =>
                prev.map(user =>
                    user.id === userId
                        ? { ...user, isFollowing: false }
                        : user
                )
            );
        }
    }, [activeTab, fetchFollowers, fetchSuggestions]);

    const handleUnfollow = useCallback(async (userId: string) => {
        try {
            // Optimistic update for all lists
            setFollowers(prev => 
                prev.map(user => 
                    user.id === userId 
                        ? { ...user, isFollowing: false }
                        : user
                )
            );
            setFollowing(prev =>
                prev.filter(user => user.id !== userId)
            );
            setSuggestions(prev => 
                prev.map(user => 
                    user.id === userId 
                        ? { ...user, isFollowing: false }
                        : user
                )
            );

            await followService.unfollowUser(userId);

            // Refresh lists to ensure consistency
            if (activeTab === 'followers') {
                fetchFollowers();
            } else if (activeTab === 'following') {
                fetchFollowing();
            } else if (activeTab === 'suggestions') {
                fetchSuggestions();
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
            // Revert optimistic updates on error
            fetchFollowers();
            fetchFollowing();
            fetchSuggestions();
        }
    }, [activeTab, fetchFollowers, fetchFollowing, fetchSuggestions]);

    // Load data based on active tab
    const loadDataForTab = useCallback((tab: 'followers' | 'following' | 'suggestions') => {
        switch (tab) {
            case 'followers':
                fetchFollowers();
                break;
            case 'following':
                fetchFollowing();
                break;
            case 'suggestions':
                fetchSuggestions();
                break;
        }
    }, [fetchFollowers, fetchFollowing, fetchSuggestions]);

    // Handle tab change
    const handleTabChange = useCallback((tab: 'followers' | 'following' | 'suggestions') => {
        setActiveTab(tab);
        loadDataForTab(tab);
    }, [loadDataForTab]);

    return {
        followers,
        following,
        suggestions,
        activeTab,
        setActiveTab: handleTabChange,
        isLoadingFollowers: isLoading.followers,
        isLoadingFollowing: isLoading.following,
        isLoadingSuggestions: isLoading.suggestions,
        handleFollow,
        handleUnfollow,
        refreshSuggestions: fetchSuggestions
    };
}; 