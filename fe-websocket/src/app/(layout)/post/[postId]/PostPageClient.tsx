'use client';

import React from 'react';
import PostCard from "@/components/post/PostCard";
import { useQuery } from '@tanstack/react-query';
import { postService } from '@/services/postService';
import { Loader, Center, Text, Container } from '@mantine/core';
import { notifications } from '@mantine/notifications';
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
        notifications.show({
            title: 'Lỗi',
            message: 'Không thể tải bài viết. Vui lòng thử lại sau.',
            color: 'red',
        });
        return (
            <Center h="100vh">
                <Text c="red" size="lg">Đã xảy ra lỗi khi tải bài viết</Text>
            </Center>
        );
    }

    if (!post) {
        return (
            <Center h="100vh">
                <Text size="lg">Không tìm thấy bài viết</Text>
            </Center>
        );
    }

    return (
        <Container size="sm" py="xl">
            <PostCard post={post} />
        </Container>
    );
};

export default PostPageClient;