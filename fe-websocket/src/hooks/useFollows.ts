import { useState, useCallback } from 'react';
import { followService, User } from '../services/followService';

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
        if (followers.length === 0) {
            setIsLoading(prev => ({ ...prev, followers: true }));
            try {
                const data = await followService.getFollowers();
                setFollowers(data);
            } catch (error) {
                console.error('Error fetching followers:', error);
            } finally {
                setIsLoading(prev => ({ ...prev, followers: false }));
            }
        }
    }, [followers.length]);

    const fetchFollowing = useCallback(async () => {
        if (following.length === 0) {
            setIsLoading(prev => ({ ...prev, following: true }));
            try {
                const data = await followService.getFollowing();
                setFollowing(data);
            } catch (error) {
                console.error('Error fetching following:', error);
            } finally {
                setIsLoading(prev => ({ ...prev, following: false }));
            }
        }
    }, [following.length]);

    const fetchSuggestions = useCallback(async () => {
        if (suggestions.length === 0) {
            setIsLoading(prev => ({ ...prev, suggestions: true }));
            try {
                const data = await followService.getSuggestions();
                setSuggestions(data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            } finally {
                setIsLoading(prev => ({ ...prev, suggestions: false }));
            }
        }
    }, [suggestions.length]);

    // Handle follow/unfollow with optimistic updates
    const handleFollow = useCallback(async (userId: string) => {
        try {
            // Optimistic update for suggestions
            setSuggestions(prev => 
                prev.map(user => 
                    user.id === userId 
                        ? { ...user, isFollowing: true }
                        : user
                )
            );

            await followService.followUser(userId);

            // Update followers count for the target user
            setSuggestions(prev =>
                prev.map(user =>
                    user.id === userId
                        ? { ...user, followersCount: user.followersCount + 1 }
                        : user
                )
            );
        } catch (error) {
            console.error('Error following user:', error);
            // Revert optimistic update on error
            setSuggestions(prev =>
                prev.map(user =>
                    user.id === userId
                        ? { ...user, isFollowing: false }
                        : user
                )
            );
        }
    }, []);

    const handleUnfollow = useCallback(async (userId: string) => {
        try {
            // Optimistic update
            setFollowing(prev =>
                prev.filter(user => user.id !== userId)
            );

            await followService.unfollowUser(userId);
        } catch (error) {
            console.error('Error unfollowing user:', error);
            // Revert optimistic update on error
            fetchFollowing();
        }
    }, [fetchFollowing]);

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