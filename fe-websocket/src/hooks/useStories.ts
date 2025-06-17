
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storyService } from '@/services/storyService';
import { CreateStoryData, CreateHighlightData } from '@/types/story';

// Query keys
const STORIES_FEED_QUERY_KEY = 'storiesFeed';
const MY_STORIES_QUERY_KEY = 'myStories';
const USER_HIGHLIGHTS_QUERY_KEY = 'userHighlights';
const STORY_LIKES_QUERY_KEY = 'storyLikes';
const STORY_VIEWS_QUERY_KEY = 'storyViews';
const MY_STORY_VIEWS_QUERY_KEY = 'myStoryViews';

export const useStories = () => {
  const queryClient = useQueryClient();

  // Get stories feed (from followed users)
  const {
    data: storiesFeed = [],
    isLoading: storiesFeedLoading,
    error: storiesFeedError,
    refetch: refetchStoriesFeed
  } = useQuery({
    queryKey: [STORIES_FEED_QUERY_KEY],
    queryFn: storyService.getStoriesFeed,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Get user's own stories
  const {
    data: myStories = [],
    isLoading: myStoriesLoading,
    error: myStoriesError,
    refetch: refetchMyStories
  } = useQuery({
    queryKey: [MY_STORIES_QUERY_KEY],
    queryFn: storyService.getMyStories,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  // Create story mutation
  const createStoryMutation = useMutation({
    mutationFn: (data: CreateStoryData) => storyService.createStory(data),
    onSuccess: () => {
      // Invalidate and refetch stories
      queryClient.invalidateQueries({ queryKey: [STORIES_FEED_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MY_STORIES_QUERY_KEY] });
    },
  });

  // Delete story mutation
  const deleteStoryMutation = useMutation({
    mutationFn: (storyId: string) => storyService.deleteStory(storyId),
    onSuccess: () => {
      // Invalidate and refetch stories
      queryClient.invalidateQueries({ queryKey: [STORIES_FEED_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MY_STORIES_QUERY_KEY] });
    },
  });

  return {
    // Data
    storiesFeed,
    myStories,
    
    // Loading states
    storiesFeedLoading,
    myStoriesLoading,
    loading: storiesFeedLoading || myStoriesLoading,
    
    // Error states
    storiesFeedError,
    myStoriesError,
    error: storiesFeedError || myStoriesError,
    
    // Mutations
    createStory: createStoryMutation.mutate,
    createStoryAsync: createStoryMutation.mutateAsync,
    deleteStory: deleteStoryMutation.mutate,
    deleteStoryAsync: deleteStoryMutation.mutateAsync,
    
    // Loading states for mutations
    isCreatingStory: createStoryMutation.isPending,
    isDeletingStory: deleteStoryMutation.isPending,
    
    // Refetch functions
    refetchStoriesFeed,
    refetchMyStories,
  };
};

// Hook for highlights
export const useHighlights = (userId: string) => {
  const queryClient = useQueryClient();

  const {
    data: highlights = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [USER_HIGHLIGHTS_QUERY_KEY, userId],
    queryFn: () => storyService.getUserHighlights(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  // Create highlight mutation
  const createHighlightMutation = useMutation({
    mutationFn: (data: CreateHighlightData) => storyService.createHighlight(data),
    onSuccess: () => {
      // Invalidate and refetch highlights
      queryClient.invalidateQueries({ queryKey: [USER_HIGHLIGHTS_QUERY_KEY, userId] });
    },
  });

  // Delete highlight mutation
  const deleteHighlightMutation = useMutation({
    mutationFn: (highlightId: string) => storyService.deleteHighlight(highlightId),
    onSuccess: () => {
      // Invalidate and refetch highlights
      queryClient.invalidateQueries({ queryKey: [USER_HIGHLIGHTS_QUERY_KEY, userId] });
    },
  });

  return {
    highlights,
    loading: isLoading,
    error,
    refetch,
    createHighlight: createHighlightMutation.mutate,
    createHighlightAsync: createHighlightMutation.mutateAsync,
    deleteHighlight: deleteHighlightMutation.mutate,
    deleteHighlightAsync: deleteHighlightMutation.mutateAsync,
    isCreatingHighlight: createHighlightMutation.isPending,
    isDeletingHighlight: deleteHighlightMutation.isPending,
  };
};

// Hook for story likes
export const useStoryLikes = (storyId: string) => {
  const queryClient = useQueryClient();

  const {
    data: likesData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [STORY_LIKES_QUERY_KEY, storyId],
    queryFn: () => storyService.getStoryLikes(storyId),
    enabled: !!storyId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Like story mutation
  const likeStoryMutation = useMutation({
    mutationFn: (storyId: string) => storyService.likeStory(storyId),
    onSuccess: () => {
      // Invalidate and refetch story likes
      queryClient.invalidateQueries({ queryKey: [STORY_LIKES_QUERY_KEY, storyId] });
      // Also invalidate stories feed and my stories to update like counts
      queryClient.invalidateQueries({ queryKey: [STORIES_FEED_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MY_STORIES_QUERY_KEY] });
    },
  });

  // Unlike story mutation
  const unlikeStoryMutation = useMutation({
    mutationFn: (storyId: string) => storyService.unlikeStory(storyId),
    onSuccess: () => {
      // Invalidate and refetch story likes
      queryClient.invalidateQueries({ queryKey: [STORY_LIKES_QUERY_KEY, storyId] });
      // Also invalidate stories feed and my stories to update like counts
      queryClient.invalidateQueries({ queryKey: [STORIES_FEED_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MY_STORIES_QUERY_KEY] });
    },
  });

  return {
    likesData,
    loading: isLoading,
    error,
    refetch,
    likeStory: likeStoryMutation.mutate,
    likeStoryAsync: likeStoryMutation.mutateAsync,
    unlikeStory: unlikeStoryMutation.mutate,
    unlikeStoryAsync: unlikeStoryMutation.mutateAsync,
    isLikingStory: likeStoryMutation.isPending,
    isUnlikingStory: unlikeStoryMutation.isPending,
  };
};

// Hook for story views
export const useStoryViews = (storyId: string) => {
  const {
    data: viewsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [STORY_VIEWS_QUERY_KEY, storyId],
    queryFn: () => storyService.getStoryViews(storyId),
    enabled: !!storyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    viewsData,
    loading: isLoading,
    error,
    refetch,
  };
};

// Hook for my story views
export const useMyStoryViews = () => {
  const {
    data: myStoryViews = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [MY_STORY_VIEWS_QUERY_KEY],
    queryFn: storyService.getMyStoryViews,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return {
    myStoryViews,
    loading: isLoading,
    error,
    refetch,
  };
};

// Hook for recording story views
export const useRecordStoryView = () => {
  const queryClient = useQueryClient();

  const recordViewMutation = useMutation({
    mutationFn: (storyId: string) => storyService.recordStoryView(storyId),
    onSuccess: (_, storyId) => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: [STORY_VIEWS_QUERY_KEY, storyId] });
      queryClient.invalidateQueries({ queryKey: [MY_STORY_VIEWS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STORIES_FEED_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MY_STORIES_QUERY_KEY] });
    },
  });

  return {
    recordStoryView: recordViewMutation.mutate,
    recordStoryViewAsync: recordViewMutation.mutateAsync,
    isRecordingView: recordViewMutation.isPending,
  };
}; 