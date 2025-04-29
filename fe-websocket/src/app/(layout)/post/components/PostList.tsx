'use client';

import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import PostCard from '@/components/post/PostCard';
import PostSkeleton from '@/components/post/PostSkeleton';
import { usePosts } from '@/hooks/usePosts';

const PostList: React.FC = () => {
    const { ref, inView } = useInView();
    const { posts, loading, error, hasMore, loadMore, refreshPosts } = usePosts();

    useEffect(() => {
        if (inView && hasMore && !loading) {
            loadMore();
        }
    }, [inView, hasMore, loading, loadMore]);

    const handlePostDeleted = async () => {
        await refreshPosts();
    };

    if (loading && posts.length === 0) {
        return (
            <div className="space-y-6">
                {[...Array(3)].map((_, index) => (
                    <PostSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-[#8E8E8E]">Không có bài viết nào</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <PostCard 
                    key={post.id} 
                    post={post} 
                    onPostDeleted={handlePostDeleted}
                />
            ))}

            {/* Loading more indicator */}
            {loading && posts.length > 0 && (
                <div className="space-y-6">
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

            {/* Infinite scroll trigger */}
            <div ref={ref} className="h-4" />
        </div>
    );
};

export default PostList;