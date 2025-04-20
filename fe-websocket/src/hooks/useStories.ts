import { useCallback } from 'react';
import { generateMockStories, groupStoriesByUser, filterExpiredStories } from '@/data/mockStories';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface StoryItem {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  mediaUrl: string;
  type: 'image' | 'video';
  createdAt: Date;
  expiresAt: Date;
  hasViewed?: boolean;
  reactions?: {
    userId: string;
    emoji: string;
    timestamp: Date;
  }[];
  replies?: {
    userId: string;
    username: string;
    avatarUrl: string;
    content: string;
    timestamp: Date;
  }[];
  viewers?: {
    userId: string;
    username: string;
    avatarUrl: string;
    viewedAt: Date;
  }[];
  isHighlighted?: boolean;
  isTrending?: boolean;
  isCloseFriend?: boolean;
}

export interface StoryGroup {
  userId: string;
  username: string;
  avatarUrl: string;
  stories: StoryItem[];
  isHighlighted?: boolean;
  isTrending?: boolean;
  isCloseFriend?: boolean;
}

// Query keys
const STORIES_QUERY_KEY = 'stories';
const GROUPED_STORIES_QUERY_KEY = 'groupedStories';

// Fetch stories function
const fetchStoriesData = async () => {
  // In a real app, this would be an API call
  // const response = await fetch('/api/stories');
  // const data = await response.json();
  
  const mockStories = generateMockStories();
  const validStories = filterExpiredStories(mockStories);
  return validStories;
};

// Fetch grouped stories function
const fetchGroupedStoriesData = async () => {
  const stories = await fetchStoriesData();
  return groupStoriesByUser(stories);
};

export const useStories = () => {
  const queryClient = useQueryClient();
  
  // Fetch stories query
  const { 
    data: stories = [], 
    isLoading: storiesLoading, 
    error: storiesError 
  } = useQuery({
    queryKey: [STORIES_QUERY_KEY],
    queryFn: fetchStoriesData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
  
  // Fetch grouped stories query
  const { 
    data: groupedStories = [], 
    isLoading: groupedStoriesLoading, 
    error: groupedStoriesError 
  } = useQuery({
    queryKey: [GROUPED_STORIES_QUERY_KEY],
    queryFn: fetchGroupedStoriesData,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
  
  // Mark story as viewed mutation
  const markStoryAsViewedMutation = useMutation({
    mutationFn: (storyId: string) => {
      // In a real app, this would be an API call
      return Promise.resolve(storyId);
    },
    onSuccess: (storyId) => {
      // Update stories cache
      queryClient.setQueryData([STORIES_QUERY_KEY], (oldData: StoryItem[] = []) => 
        oldData.map(story => 
          story.id === storyId 
            ? { ...story, hasViewed: true } 
            : story
        )
      );
      
      // Update grouped stories cache
      queryClient.setQueryData([GROUPED_STORIES_QUERY_KEY], (oldData: StoryGroup[] = []) => 
        oldData.map(group => ({
          ...group,
          stories: group.stories.map(story => 
            story.id === storyId 
              ? { ...story, hasViewed: true } 
              : story
          )
        }))
      );
    }
  });
  
  // Add reaction mutation
  const addReactionMutation = useMutation({
    mutationFn: ({ storyId, userId, emoji }: { storyId: string; userId: string; emoji: string }) => {
      // In a real app, this would be an API call
      return Promise.resolve({ storyId, userId, emoji });
    },
    onSuccess: ({ storyId, userId, emoji }) => {
      // Update stories cache
      queryClient.setQueryData([STORIES_QUERY_KEY], (oldData: StoryItem[] = []) => 
        oldData.map(story => 
          story.id === storyId 
            ? { 
                ...story, 
                reactions: [
                  ...(story.reactions || []), 
                  { userId, emoji, timestamp: new Date() }
                ] 
              } 
            : story
        )
      );
      
      // Update grouped stories cache
      queryClient.setQueryData([GROUPED_STORIES_QUERY_KEY], (oldData: StoryGroup[] = []) => 
        oldData.map(group => ({
          ...group,
          stories: group.stories.map(story => 
            story.id === storyId 
              ? { 
                  ...story, 
                  reactions: [
                    ...(story.reactions || []), 
                    { userId, emoji, timestamp: new Date() }
                  ] 
                } 
              : story
          )
        }))
      );
    }
  });
  
  // Add reply mutation
  const addReplyMutation = useMutation({
    mutationFn: ({ 
      storyId, 
      userId, 
      username, 
      avatarUrl, 
      content 
    }: { 
      storyId: string; 
      userId: string; 
      username: string; 
      avatarUrl: string; 
      content: string 
    }) => {
      // In a real app, this would be an API call
      return Promise.resolve({ storyId, userId, username, avatarUrl, content });
    },
    onSuccess: ({ storyId, userId, username, avatarUrl, content }) => {
      // Update stories cache
      queryClient.setQueryData([STORIES_QUERY_KEY], (oldData: StoryItem[] = []) => 
        oldData.map(story => 
          story.id === storyId 
            ? { 
                ...story, 
                replies: [
                  ...(story.replies || []), 
                  { userId, username, avatarUrl, content, timestamp: new Date() }
                ] 
              } 
            : story
        )
      );
      
      // Update grouped stories cache
      queryClient.setQueryData([GROUPED_STORIES_QUERY_KEY], (oldData: StoryGroup[] = []) => 
        oldData.map(group => ({
          ...group,
          stories: group.stories.map(story => 
            story.id === storyId 
              ? { 
                  ...story, 
                  replies: [
                    ...(story.replies || []), 
                    { userId, username, avatarUrl, content, timestamp: new Date() }
                  ] 
                } 
              : story
          )
        }))
      );
    }
  });
  
  // Add viewer mutation
  const addViewerMutation = useMutation({
    mutationFn: ({ 
      storyId, 
      userId, 
      username, 
      avatarUrl 
    }: { 
      storyId: string; 
      userId: string; 
      username: string; 
      avatarUrl: string 
    }) => {
      // In a real app, this would be an API call
      return Promise.resolve({ storyId, userId, username, avatarUrl });
    },
    onSuccess: ({ storyId, userId, username, avatarUrl }) => {
      // Update stories cache
      queryClient.setQueryData([STORIES_QUERY_KEY], (oldData: StoryItem[] = []) => 
        oldData.map(story => 
          story.id === storyId 
            ? { 
                ...story, 
                viewers: [
                  ...(story.viewers || []), 
                  { userId, username, avatarUrl, viewedAt: new Date() }
                ] 
              } 
            : story
        )
      );
      
      // Update grouped stories cache
      queryClient.setQueryData([GROUPED_STORIES_QUERY_KEY], (oldData: StoryGroup[] = []) => 
        oldData.map(group => ({
          ...group,
          stories: group.stories.map(story => 
            story.id === storyId 
              ? { 
                  ...story, 
                  viewers: [
                    ...(story.viewers || []), 
                    { userId, username, avatarUrl, viewedAt: new Date() }
                  ] 
                } 
              : story
          )
        }))
      );
    }
  });
  
  // Add story mutation
  const addStoryMutation = useMutation({
    mutationFn: ({ 
      file, 
      userId, 
      username, 
      avatarUrl 
    }: { 
      file: File; 
      userId: string; 
      username: string; 
      avatarUrl: string 
    }) => {
      // In a real app, this would upload the file to a server
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      const createdAt = new Date();
      const expiresAt = new Date(createdAt);
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      const mediaUrl = URL.createObjectURL(file);
      
      const newStory: StoryItem = {
        id: `${userId}_story_${Date.now()}`,
        userId,
        username,
        avatarUrl,
        mediaUrl,
        type,
        createdAt,
        expiresAt,
        hasViewed: false,
        reactions: [],
        replies: [],
        viewers: [],
      };
      
      return Promise.resolve(newStory);
    },
    onSuccess: (newStory) => {
      // Update stories cache
      queryClient.setQueryData([STORIES_QUERY_KEY], (oldData: StoryItem[] = []) => 
        [newStory, ...oldData]
      );
      
      // Update grouped stories cache
      queryClient.setQueryData([GROUPED_STORIES_QUERY_KEY], (oldData: StoryGroup[] = []) => {
        const userGroupIndex = oldData.findIndex(group => group.userId === newStory.userId);
        
        if (userGroupIndex >= 0) {
          // User already has stories
          const updatedGroups = [...oldData];
          updatedGroups[userGroupIndex] = {
            ...updatedGroups[userGroupIndex],
            stories: [newStory, ...updatedGroups[userGroupIndex].stories],
          };
          return updatedGroups;
        } else {
          // New user group
          return [
            ...oldData,
            {
              userId: newStory.userId,
              username: newStory.username,
              avatarUrl: newStory.avatarUrl,
              stories: [newStory],
            },
          ];
        }
      });
    }
  });
  
  // Helper functions
  const getHighlightedStories = useCallback(() => {
    return groupedStories.filter(group => group.isHighlighted);
  }, [groupedStories]);
  
  const getTrendingStories = useCallback(() => {
    return groupedStories.filter(group => group.isTrending);
  }, [groupedStories]);
  
  const getCloseFriendsStories = useCallback(() => {
    return groupedStories.filter(group => group.isCloseFriend);
  }, [groupedStories]);
  
  return {
    stories,
    groupedStories,
    loading: storiesLoading || groupedStoriesLoading,
    error: storiesError || groupedStoriesError,
    markStoryAsViewed: markStoryAsViewedMutation.mutate,
    addReaction: addReactionMutation.mutate,
    addReply: addReplyMutation.mutate,
    addViewer: addViewerMutation.mutate,
    addStory: addStoryMutation.mutate,
    getHighlightedStories,
    getTrendingStories,
    getCloseFriendsStories,
  };
}; 