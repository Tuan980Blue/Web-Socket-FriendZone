'use client';

import React, { useState, useCallback } from 'react';
import QuickPost from "@/components/quickPost/QuickPost";
import PostList from "@/app/(layout)/posts/components/PostList";
import PostFilter, { FilterType } from "@/app/(layout)/posts/components/PostFilter";
import { mockPosts } from "@/data/mockPosts";

const PostsPage = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [posts, setPosts] = useState(mockPosts);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    
    // In a real app, this would fetch filtered posts from the server
    // For now, we'll just simulate filtering
    if (filter === 'all') {
      setPosts(mockPosts);
    } else if (filter === 'trending') {
      setPosts([...mockPosts].sort((a, b) => b.stats.likes - a.stats.likes));
    } else if (filter === 'recent') {
      setPosts([...mockPosts].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } else if (filter === 'following') {
      // Simulate following filter - in a real app, this would fetch posts from followed users
      setPosts(mockPosts.filter(post => post.author.id === 'user1' || post.author.id === 'user2'));
    }
  };

  const handleLoadMore = async () => {
    // In a real app, this would fetch more posts from the server
    // For now, we'll just simulate loading more posts
    console.log('Loading more posts...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, we'll just set hasMore to false after "loading more"
    setHasMore(false);
  };

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would fetch fresh posts from the server
      // For now, we'll just reset to the initial posts
      setPosts(mockPosts);
      setHasMore(true);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  return (
    <div className="max-w-7xl mx-auto md:px-4 px-0 mb-6">
      {/* Quick Post Section */}
      <div>
        <QuickPost isCurrentUser={true} />
      </div>
      
      {/* Post Filter */}
      <PostFilter 
        activeFilter={activeFilter} 
        onFilterChange={handleFilterChange} 
      />
      
      {/* Posts List */}
      <PostList 
        initialPosts={posts}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default PostsPage;