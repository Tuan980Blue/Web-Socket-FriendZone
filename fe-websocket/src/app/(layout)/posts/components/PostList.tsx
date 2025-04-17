'use client';

import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import PostSkeleton from './PostSkeleton';
import EmptyPosts from './EmptyPosts';
import { Post } from '@/data/mockPosts';
import { mockPosts } from '@/data/mockPosts';

interface PostListProps {
  initialPosts?: Post[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  onRefresh?: () => void;
}

const PostList: React.FC<PostListProps> = ({ 
  initialPosts = mockPosts,
  onLoadMore,
  hasMore = false,
  onRefresh
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setPosts(initialPosts);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [initialPosts]);

  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              stats: {
                ...post.stats,
                likes: post.isLiked ? post.stats.likes - 1 : post.stats.likes + 1
              }
            } 
          : post
      )
    );
  };

  const handleSave = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, isSaved: !post.isSaved } 
          : post
      )
    );
  };

  const handleShare = (postId: string) => {
    // In a real app, this would open a share dialog
    console.log('Sharing post:', postId);
  };

  const handleComment = (postId: string) => {
    // In a real app, this would focus the comment input
    console.log('Commenting on post:', postId);
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      if (onLoadMore) {
        await onLoadMore();
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return <EmptyPosts onRefresh={handleRefresh} />;
  }

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onSave={handleSave}
          onShare={handleShare}
          onComment={handleComment}
        />
      ))}
      
      {loadingMore && (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <PostSkeleton key={`loading-${i}`} />
          ))}
        </div>
      )}
      
      {hasMore && !loadingMore && (
        <div className="flex justify-center py-4">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList; 