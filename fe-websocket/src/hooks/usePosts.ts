import { useInfiniteQuery } from '@tanstack/react-query';
import { postService } from '@/services/postService';

const LIMIT = 10;

export const usePosts = (userId?: string) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['posts', userId],
    queryFn: async ({ pageParam = 1 }) => {
      let response;
      if (userId) {
        response = await postService.getUserPosts(userId, pageParam, LIMIT);
      } else {
        response = await postService.getPosts(pageParam, LIMIT);
      }
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.pagination.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];
  const loading = isFetching || isFetchingNextPage;

  return {
    posts,
    loading,
    error: error as Error | null,
    hasMore: hasNextPage,
    loadMore: fetchNextPage,
    refreshPosts: refetch,
  };
}; 