'use client'

import React from 'react';
import { usePosts } from '@/hooks/usePosts';
import { Card, Text, Group, Button, Stack, Badge, ActionIcon, Modal, TextInput, Textarea, Select, Avatar, Checkbox } from '@mantine/core';
import { IconEdit, IconTrash, IconSearch, IconFilter, IconMapPin } from '@tabler/icons-react';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Post } from '@/types/post';
import Image from 'next/image';

const Page = () => {
    const { posts, loading, error, hasMore, loadMore, deletePost, isDeleting } = usePosts();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [filterStatus, setFilterStatus] = useState<string | null>(null);

    const filteredPosts = posts?.filter(post => {
        if (!post?.content) return false;
        
        const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !filterStatus || 
            (filterStatus === 'archived' && post.isArchived) ||
            (filterStatus === 'highlighted' && post.isHighlighted);
        return matchesSearch && matchesStatus;
    }) ?? [];

    const handleDelete = (postId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            deletePost(postId);
        }
    };

    const handleEdit = (post: Post) => {
        setSelectedPost(post);
        open();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error: {error.message}
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Quản lý bài viết</h1>
                <div className="flex gap-4 mb-6">
                    <TextInput
                        placeholder="Tìm kiếm bài viết..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftSection={<IconSearch size={16} />}
                        className="flex-1"
                    />
                    <Select
                        placeholder="Lọc theo trạng thái"
                        value={filterStatus}
                        onChange={setFilterStatus}
                        data={[
                            { value: 'highlighted', label: 'Bài viết nổi bật' },
                            { value: 'archived', label: 'Đã lưu trữ' },
                        ]}
                        leftSection={<IconFilter size={16} />}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                    <Card key={post.id} shadow="sm" padding="lg" radius="md" withBorder>
                        <Stack>
                            <Group justify="space-between">
                                <Group>
                                    <Avatar src={post.author.avatar} size="sm" radius="xl" />
                                    <Text size="sm" fw={500}>{post.author.fullName}</Text>
                                </Group>
                                <Group>
                                    {post.isHighlighted && (
                                        <Badge color="yellow">Nổi bật</Badge>
                                    )}
                                    {post.isArchived && (
                                        <Badge color="gray">Đã lưu trữ</Badge>
                                    )}
                                </Group>
                            </Group>
                            
                            <Text size="sm" c="dimmed" lineClamp={3}>
                                {post.content}
                            </Text>

                            {post.images && post.images.length > 0 && (
                                <div className="relative aspect-square w-full">
                                    <Image
                                        src={post.images[0]}
                                        alt="Post image"
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>
                            )}

                            {post.location && (
                                <Group gap="xs">
                                    <IconMapPin size={16} />
                                    <Text size="sm" c="dimmed">{post.location}</Text>
                                </Group>
                            )}

                            <Group justify="space-between" mt="md">
                                <Text size="sm" c="dimmed">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </Text>
                                <Group>
                                    <ActionIcon
                                        variant="light"
                                        color="blue"
                                        onClick={() => handleEdit(post)}
                                    >
                                        <IconEdit size={16} />
                                    </ActionIcon>
                                    <ActionIcon
                                        variant="light"
                                        color="red"
                                        onClick={() => handleDelete(post.id)}
                                        loading={isDeleting}
                                    >
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            </Group>
                        </Stack>
                    </Card>
                ))}
            </div>

            {hasMore && (
                <div className="mt-8 text-center">
                    <Button
                        onClick={() => loadMore()}
                        variant="light"
                        loading={loading}
                    >
                        Tải thêm
                    </Button>
                </div>
            )}

            <Modal
                opened={opened}
                onClose={close}
                title="Chỉnh sửa bài viết"
                size="lg"
            >
                {selectedPost && (
                    <Stack>
                        <Textarea
                            label="Nội dung"
                            value={selectedPost.content}
                            onChange={(e) => setSelectedPost({ ...selectedPost, content: e.target.value })}
                            minRows={4}
                        />
                        <TextInput
                            label="Vị trí"
                            value={selectedPost.location || ''}
                            onChange={(e) => setSelectedPost({ ...selectedPost, location: e.target.value })}
                        />
                        <Group>
                            <Checkbox
                                label="Bài viết nổi bật"
                                checked={selectedPost.isHighlighted}
                                onChange={(e) => setSelectedPost({ ...selectedPost, isHighlighted: e.target.checked })}
                            />
                            <Checkbox
                                label="Đã lưu trữ"
                                checked={selectedPost.isArchived}
                                onChange={(e) => setSelectedPost({ ...selectedPost, isArchived: e.target.checked })}
                            />
                        </Group>
                        <Group justify="flex-end" mt="md">
                            <Button variant="light" onClick={close}>
                                Hủy
                            </Button>
                            <Button
                                onClick={() => {
                                    // Implement save logic here
                                    notifications.show({
                                        title: 'Thành công',
                                        message: 'Bài viết đã được cập nhật',
                                        color: 'green',
                                    });
                                    close();
                                }}
                            >
                                Lưu thay đổi
                            </Button>
                        </Group>
                    </Stack>
                )}
            </Modal>
        </div>
    );
};

export default Page;