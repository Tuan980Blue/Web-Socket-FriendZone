'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { usePosts } from '@/hooks/usePosts';
import PostCard from '@/components/post/PostCard';
import PostSkeleton from '@/components/post/PostSkeleton';

interface ProfilePostsProps {
  userId?: string;
}

const ProfilePosts = ({ userId }: ProfilePostsProps) => {
  const { ref, inView } = useInView();
  const { posts, loading, error, hasMore, loadMore } = usePosts(userId);

  React.useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);

  if (loading && posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-4 space-y-4">
          {[...Array(3)].map((_, index) => (
            <PostSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mt-4 space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {/* Loading more indicator */}
        {loading && posts.length > 0 && (
          <div className="space-y-4">
            {[...Array(2)].map((_, index) => (
              <PostSkeleton key={index} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 py-4">
            {error.message || 'Failed to fetch posts'}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {userId ? 'Người dùng này chưa có bài viết nào' : 'Bạn chưa có bài viết nào'}
          </div>
        )}

        <div ref={ref} className="h-4" />
      </div>
    </div>
  );
};

export default ProfilePosts; 