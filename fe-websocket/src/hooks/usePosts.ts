import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/services/postService';
import { notifications } from '@mantine/notifications';

const LIMIT = 9;

export const usePosts = (userId?: string) => {
  const queryClient = useQueryClient();

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

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => postService.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['posts', userId] });
      }
      notifications.show({
        title: 'Xóa bài viết thành công',
        message: 'Bài viết đã được xóa!',
        color: 'green',
      });
    },
    onError: () => {
      notifications.show({
        title: 'Xóa bài viết thất bại',
        message: 'Đã có lỗi xảy ra khi xóa bài viết.',
        color: 'red',
      });
    },
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
    deletePost: deletePostMutation.mutate,
    isDeleting: deletePostMutation.isPending,
  };
}; 