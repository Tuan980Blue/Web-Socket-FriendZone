import { useState, useEffect } from 'react';
import { Post, PostResponse } from '@/types/post';
import { postService } from '@/services/postService';

export const usePosts = (userId?: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchPosts = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      let response: PostResponse;
      if (userId) {
        response = await postService.getUserPosts(userId, pageNum, limit);
      } else {
        response = await postService.getPosts(pageNum, limit);
      }

      if (pageNum === 1) {
        setPosts(response.posts);
      } else {
        setPosts(prev => [...prev, ...response.posts]);
      }

      setHasMore(pageNum < response.pagination.totalPages);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const refreshPosts = () => {
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page, userId]);

  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    refreshPosts
  };
}; 