import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { followService } from '../services/followService';
import { User } from '@/types/user';

// Query keys
const QUERY_KEYS = {
    FOLLOWERS: 'followers',
    FOLLOWING: 'following',
    SUGGESTIONS: 'suggestions'
};

export const useFollows = () => {
    const [activeTab, setActiveTab] = useState<'followers' | 'following' | 'suggestions'>('followers');
    const queryClient = useQueryClient();

    // Fetch followers
    const { data: followers = [], isLoading: isLoadingFollowers } = useQuery({
        queryKey: [QUERY_KEYS.FOLLOWERS],
        queryFn: async () => {
            const data = await followService.getFollowers();
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Fetch following
    const { data: following = [], isLoading: isLoadingFollowing } = useQuery({
        queryKey: [QUERY_KEYS.FOLLOWING],
        queryFn: async () => {
            const data = await followService.getFollowing();
            return data.map(user => ({ ...user, isFollowing: true }));
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Fetch suggestions
    const { data: suggestions = [], isLoading: isLoadingSuggestions } = useQuery({
        queryKey: [QUERY_KEYS.SUGGESTIONS],
        queryFn: async () => {
            const data = await followService.getSuggestions();
            const suggestionsWithStatus = await Promise.all(
                data.map(async (user) => {
                    const isFollowing = await followService.checkFollowStatus(user.id);
                    return { ...user, isFollowing };
                })
            );
            return suggestionsWithStatus;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Follow mutation
    const followMutation = useMutation({
        mutationFn: followService.followUser,
        onMutate: async (userId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.FOLLOWERS] });
            await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.SUGGESTIONS] });

            // Snapshot the previous value
            const previousFollowers = queryClient.getQueryData<User[]>([QUERY_KEYS.FOLLOWERS]);
            const previousSuggestions = queryClient.getQueryData<User[]>([QUERY_KEYS.SUGGESTIONS]);

            // Optimistically update followers
            if (previousFollowers) {
                queryClient.setQueryData<User[]>([QUERY_KEYS.FOLLOWERS], (old) =>
                    old?.map(user => 
                        user.id === userId 
                            ? { ...user, isFollowing: true }
                            : user
                    )
                );
            }

            // Optimistically update suggestions
            if (previousSuggestions) {
                queryClient.setQueryData<User[]>([QUERY_KEYS.SUGGESTIONS], (old) =>
                    old?.map(user => 
                        user.id === userId 
                            ? { ...user, isFollowing: true }
                            : user
                    )
                );
            }

            return { previousFollowers, previousSuggestions };
        },
        onError: (err, userId, context) => {
            // Revert optimistic updates on error
            if (context?.previousFollowers) {
                queryClient.setQueryData([QUERY_KEYS.FOLLOWERS], context.previousFollowers);
            }
            if (context?.previousSuggestions) {
                queryClient.setQueryData([QUERY_KEYS.SUGGESTIONS], context.previousSuggestions);
            }
        },
        onSettled: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLLOWERS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLLOWING] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUGGESTIONS] });
        },
    });

    // Unfollow mutation
    const unfollowMutation = useMutation({
        mutationFn: followService.unfollowUser,
        onMutate: async (userId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.FOLLOWERS] });
            await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.FOLLOWING] });
            await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.SUGGESTIONS] });

            // Snapshot the previous values
            const previousFollowers = queryClient.getQueryData<User[]>([QUERY_KEYS.FOLLOWERS]);
            const previousFollowing = queryClient.getQueryData<User[]>([QUERY_KEYS.FOLLOWING]);
            const previousSuggestions = queryClient.getQueryData<User[]>([QUERY_KEYS.SUGGESTIONS]);

            // Optimistically update followers
            if (previousFollowers) {
                queryClient.setQueryData<User[]>([QUERY_KEYS.FOLLOWERS], (old) =>
                    old?.map(user => 
                        user.id === userId 
                            ? { ...user, isFollowing: false }
                            : user
                    )
                );
            }

            // Optimistically update following
            if (previousFollowing) {
                queryClient.setQueryData<User[]>([QUERY_KEYS.FOLLOWING], (old) =>
                    old?.filter(user => user.id !== userId)
                );
            }

            // Optimistically update suggestions
            if (previousSuggestions) {
                queryClient.setQueryData<User[]>([QUERY_KEYS.SUGGESTIONS], (old) =>
                    old?.map(user => 
                        user.id === userId 
                            ? { ...user, isFollowing: false }
                            : user
                    )
                );
            }

            return { previousFollowers, previousFollowing, previousSuggestions };
        },
        onError: (err, userId, context) => {
            // Revert optimistic updates on error
            if (context?.previousFollowers) {
                queryClient.setQueryData([QUERY_KEYS.FOLLOWERS], context.previousFollowers);
            }
            if (context?.previousFollowing) {
                queryClient.setQueryData([QUERY_KEYS.FOLLOWING], context.previousFollowing);
            }
            if (context?.previousSuggestions) {
                queryClient.setQueryData([QUERY_KEYS.SUGGESTIONS], context.previousSuggestions);
            }
        },
        onSettled: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLLOWERS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLLOWING] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUGGESTIONS] });
        },
    });

    // Handle follow/unfollow
    const handleFollow = useCallback(async (userId: string) => {
        await followMutation.mutateAsync(userId);
    }, [followMutation]);

    const handleUnfollow = useCallback(async (userId: string) => {
        await unfollowMutation.mutateAsync(userId);
    }, [unfollowMutation]);

    // Handle tab change
    const handleTabChange = useCallback((tab: 'followers' | 'following' | 'suggestions') => {
        setActiveTab(tab);
    }, []);

    return {
        followers,
        following,
        suggestions,
        activeTab,
        setActiveTab: handleTabChange,
        isLoadingFollowers,
        isLoadingFollowing,
        isLoadingSuggestions,
        handleFollow,
        handleUnfollow,
        refreshSuggestions: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUGGESTIONS] })
    };
}; 