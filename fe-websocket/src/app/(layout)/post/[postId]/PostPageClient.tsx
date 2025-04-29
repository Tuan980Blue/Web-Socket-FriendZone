'use client';

import React from 'react';
import PostCard from "@/components/post/PostCard";
import PostNotFound from "@/components/post/PostNotFound";
import { useQuery } from '@tanstack/react-query';
import { postService } from '@/services/postService';
import { Loader, Center, Container } from '@mantine/core';
import { Post } from '@/types/post';

interface Props {
    postId: string;
}

const PostPageClient = ({postId}: Props) => {
    const { data: post, isLoading, error } = useQuery<Post>({
        queryKey: ['post', postId],
        queryFn: () => postService.getPostById(postId),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    if (isLoading) {
        return (
            <Center h="100vh">
                <Loader size="xl" />
            </Center>
        );
    }

    if (error) {
        return <PostNotFound type="error" />;
    }

    if (!post) {
        return <PostNotFound type="not-found" />;
    }

    return (
        <Container size="sm" py="xl">
            <PostCard post={post} />
        </Container>
    );
};

export default PostPageClient;