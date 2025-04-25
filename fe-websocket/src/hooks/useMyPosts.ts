import { useState, useEffect } from 'react';
import { Post } from '@/types/post';
import { postService } from '@/services/postService';

export const useMyPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchMyPosts = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await postService.getMyPosts(pageNum, limit);

      if (pageNum === 1) {
        setPosts(response.posts);
      } else {
        setPosts(prev => [...prev, ...response.posts]);
      }

      setHasMore(pageNum < response.pagination.totalPages);
    } catch (err) {
      setError('Failed to fetch your posts');
      console.error('Error fetching your posts:', err);
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
    fetchMyPosts(1);
  };

  useEffect(() => {
    fetchMyPosts(page);
  }, [page]);

  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    refreshPosts
  };
}; 