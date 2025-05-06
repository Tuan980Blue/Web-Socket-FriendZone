'use client'

import React, { useState } from 'react';
import { usePosts } from '@/hooks/usePosts';
import {
    Table,
    Text,
    Group,
    Button,
    Stack,
    Badge,
    ActionIcon,
    Modal,
    TextInput,
    Select,
    NumberInput,
    Paper,
    Title,
    Grid,
    Box,
    ScrollArea,
    Avatar,
    Tooltip,
} from '@mantine/core';
import {
    IconEye,
    IconTrash,
    IconSearch,
    IconBan,
    IconAlertTriangle,
    IconCalendar,
    IconUser,
    IconFlag,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Post } from '@/types/post';
import { DateInput } from '@mantine/dates';
import Image from 'next/image';

// Types
type PostStatus = 'public' | 'hidden' | 'violation' | 'deleted';
type FilterDate = { from: Date | null; to: Date | null };

interface PostWithAdmin extends Post {
    status: PostStatus;
    reportCount: number;
    reports?: {
        userId: string;
        reason: string;
        createdAt: string;
    }[];
}

// Components
const PostTable = ({ posts, onAction }: { posts: PostWithAdmin[]; onAction: (action: string, post: PostWithAdmin) => void }) => {
    return (
        <ScrollArea>
            <Table striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Người đăng</Table.Th>
                        <Table.Th>Trích nội dung</Table.Th>
                        <Table.Th>Trạng thái</Table.Th>
                        <Table.Th>Số lượt báo cáo</Table.Th>
                        <Table.Th>Ngày đăng</Table.Th>
                        <Table.Th>Hành động</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {posts.map((post) => (
                        <Table.Tr key={post.id}>
                            <Table.Td>#{post.id.slice(-6)}</Table.Td>
                            <Table.Td>
                                <Group gap="xs">
                                    <Avatar src={post.author.avatar} size="sm" radius="xl" />
                                    <Text size="sm">{post.author.username}</Text>
                                </Group>
                            </Table.Td>
                            <Table.Td>
                                <Text lineClamp={2} size="sm">
                                    {post.content}
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Badge
                                    color={
                                        post.status === 'public'
                                            ? 'green'
                                            : post.status === 'hidden'
                                            ? 'yellow'
                                            : post.status === 'violation'
                                            ? 'red'
                                            : 'gray'
                                    }
                                >
                                    {post.status === 'public'
                                        ? 'Công khai'
                                        : post.status === 'hidden'
                                        ? 'Bị ẩn'
                                        : post.status === 'violation'
                                        ? 'Vi phạm'
                                        : 'Đã xóa'}
                                </Badge>
                            </Table.Td>
                            <Table.Td>{post.reportCount}</Table.Td>
                            <Table.Td>{new Date(post.createdAt).toLocaleDateString()}</Table.Td>
                            <Table.Td>
                                <Group gap="xs">
                                    <Tooltip label="Xem chi tiết">
                                        <ActionIcon
                                            variant="light"
                                            color="blue"
                                            onClick={() => onAction('view', post)}
                                        >
                                            <IconEye size={16} />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label="Xóa bài viết">
                                        <ActionIcon
                                            variant="light"
                                            color="red"
                                            onClick={() => onAction('delete', post)}
                                        >
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label="Ẩn bài viết">
                                        <ActionIcon
                                            variant="light"
                                            color="yellow"
                                            onClick={() => onAction('hide', post)}
                                        >
                                            <IconBan size={16} />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label="Cảnh báo user">
                                        <ActionIcon
                                            variant="light"
                                            color="orange"
                                            onClick={() => onAction('warn', post)}
                                        >
                                            <IconAlertTriangle size={16} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </ScrollArea>
    );
};

const AdvancedFilters = ({
    filters,
    onFilterChange,
}: {
    filters: {
        username: string;
        keyword: string;
        status: string | null;
        reportCount: number | null;
        dateRange: FilterDate;
    };
    onFilterChange: (key: string, value: any) => void;
}) => {
    return (
        <Paper p="md" withBorder>
            <Title order={3} mb="md">
                Bộ lọc nâng cao
            </Title>
            <Grid>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <TextInput
                        label="Username"
                        placeholder="Tìm theo username"
                        value={filters.username}
                        onChange={(e) => onFilterChange('username', e.target.value)}
                        leftSection={<IconUser size={16} />}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <TextInput
                        label="Từ khóa"
                        placeholder="Tìm trong nội dung"
                        value={filters.keyword}
                        onChange={(e) => onFilterChange('keyword', e.target.value)}
                        leftSection={<IconSearch size={16} />}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Select
                        label="Trạng thái"
                        placeholder="Chọn trạng thái"
                        value={filters.status}
                        onChange={(value) => onFilterChange('status', value)}
                        data={[
                            { value: 'public', label: 'Công khai' },
                            { value: 'hidden', label: 'Bị ẩn' },
                            { value: 'violation', label: 'Vi phạm' },
                            { value: 'deleted', label: 'Đã xóa' },
                        ]}
                        leftSection={<IconFlag size={16} />}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <NumberInput
                        label="Số lượt báo cáo tối thiểu"
                        placeholder="Nhập số lượt"
                        value={filters.reportCount || undefined}
                        onChange={(value) => onFilterChange('reportCount', value)}
                        leftSection={<IconAlertTriangle size={16} />}
                        min={0}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <DateInput
                        label="Từ ngày"
                        placeholder="Chọn ngày"
                        value={filters.dateRange.from}
                        onChange={(date) => onFilterChange('dateRange', { ...filters.dateRange, from: date })}
                        leftSection={<IconCalendar size={16} />}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <DateInput
                        label="Đến ngày"
                        placeholder="Chọn ngày"
                        value={filters.dateRange.to}
                        onChange={(date) => onFilterChange('dateRange', { ...filters.dateRange, to: date })}
                        leftSection={<IconCalendar size={16} />}
                    />
                </Grid.Col>
            </Grid>
        </Paper>
    );
};

const PostDetailModal = ({
    post,
    opened,
    onClose,
    onAction,
}: {
    post: PostWithAdmin | null;
    opened: boolean;
    onClose: () => void;
    onAction: (action: string, post: PostWithAdmin) => void;
}) => {
    if (!post) return null;

    return (
        <Modal opened={opened} onClose={onClose} size="xl" title="Chi tiết bài viết">
            <Stack gap="md">
                <Group justify="space-between">
                    <Group>
                        <Avatar src={post.author.avatar} size="md" radius="xl" />
                        <div>
                            <Text fw={500}>{post.author.fullName}</Text>
                            <Text size="sm" c="dimmed">
                                @{post.author.username}
                            </Text>
                        </div>
                    </Group>
                    <Badge
                        color={
                            post.status === 'public'
                                ? 'green'
                                : post.status === 'hidden'
                                ? 'yellow'
                                : post.status === 'violation'
                                ? 'red'
                                : 'gray'
                        }
                    >
                        {post.status === 'public'
                            ? 'Công khai'
                            : post.status === 'hidden'
                            ? 'Bị ẩn'
                            : post.status === 'violation'
                            ? 'Vi phạm'
                            : 'Đã xóa'}
                    </Badge>
                </Group>

                <Text>{post.content}</Text>

                {post.images && post.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                        {post.images.map((image, index) => (
                            <div key={index} className="relative aspect-square">
                                <Image
                                    src={image}
                                    alt={`Post image ${index + 1}`}
                                    width={400}
                                    height={400}
                                    className="object-cover rounded-md"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {post.reports && post.reports.length > 0 && (
                    <Box>
                        <Title order={4} mb="md">
                            Danh sách báo cáo ({post.reports.length})
                        </Title>
                        <Stack gap="sm">
                            {post.reports.map((report, index) => (
                                <Paper key={index} p="sm" withBorder>
                                    <Group justify="space-between">
                                        <Text size="sm">User ID: {report.userId}</Text>
                                        <Text size="sm" c="dimmed">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </Text>
                                    </Group>
                                    <Text size="sm" mt="xs">
                                        Lý do: {report.reason}
                                    </Text>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                )}

                <Group justify="flex-end" mt="md">
                    <Button variant="light" onClick={onClose}>
                        Đóng
                    </Button>
                    <Button
                        color="yellow"
                        onClick={() => onAction('hide', post)}
                        leftSection={<IconBan size={16} />}
                    >
                        Ẩn bài viết
                    </Button>
                    <Button
                        color="red"
                        onClick={() => onAction('delete', post)}
                        leftSection={<IconTrash size={16} />}
                    >
                        Xóa bài viết
                    </Button>
                    <Button
                        color="orange"
                        onClick={() => onAction('warn', post)}
                        leftSection={<IconAlertTriangle size={16} />}
                    >
                        Cảnh cáo user
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

const Page = () => {
    const { posts, loading, error, hasMore, loadMore, deletePost, isDeleting } = usePosts();
    const [selectedPost, setSelectedPost] = useState<PostWithAdmin | null>(null);
    const [detailOpened, { open: openDetail, close: closeDetail }] = useDisclosure(false);
    const [filters, setFilters] = useState({
        username: '',
        keyword: '',
        status: null as string | null,
        reportCount: null as number | null,
        dateRange: { from: null as Date | null, to: null as Date | null },
    });

    // Mock data for demonstration
    const mockPosts: PostWithAdmin[] = posts.map((post) => ({
        ...post,
        status: 'public' as PostStatus,
        reportCount: Math.floor(Math.random() * 5),
        reports: Math.random() > 0.7
            ? [
                  {
                      userId: 'user123',
                      reason: 'Nội dung không phù hợp',
                      createdAt: new Date().toISOString(),
                  },
              ]
            : undefined,
    }));

    const filteredPosts = mockPosts.filter((post) => {
        const matchesUsername = !filters.username || post.author.username.toLowerCase().includes(filters.username.toLowerCase());
        const matchesKeyword = !filters.keyword || post.content.toLowerCase().includes(filters.keyword.toLowerCase());
        const matchesStatus = !filters.status || post.status === filters.status;
        const matchesReportCount = !filters.reportCount || post.reportCount >= filters.reportCount;
        const matchesDateRange =
            (!filters.dateRange.from || new Date(post.createdAt) >= filters.dateRange.from) &&
            (!filters.dateRange.to || new Date(post.createdAt) <= filters.dateRange.to);

        return matchesUsername && matchesKeyword && matchesStatus && matchesReportCount && matchesDateRange;
    });

    const handleAction = (action: string, post: PostWithAdmin) => {
        switch (action) {
            case 'view':
                setSelectedPost(post);
                openDetail();
                break;
            case 'delete':
                if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
                    deletePost(post.id);
                }
                break;
            case 'hide':
                // Implement hide post logic
                notifications.show({
                    title: 'Thành công',
                    message: 'Bài viết đã được ẩn',
                    color: 'yellow',
                });
                break;
            case 'warn':
                // Implement warn user logic
                notifications.show({
                    title: 'Thành công',
                    message: 'Đã gửi cảnh báo đến người dùng',
                    color: 'orange',
                });
                break;
        }
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
            <Title order={2} mb="xl">
                Quản lý bài viết
            </Title>

            <Stack gap="xl">
                <AdvancedFilters filters={filters} onFilterChange={(key, value) => setFilters({ ...filters, [key]: value })} />
                
                <Paper withBorder>
                    <PostTable posts={filteredPosts} onAction={handleAction} />
                </Paper>

                {hasMore && (
                    <div className="text-center">
                        <Button onClick={() => loadMore()} variant="light" loading={loading}>
                            Tải thêm
                        </Button>
                    </div>
                )}
            </Stack>

            <PostDetailModal
                post={selectedPost}
                opened={detailOpened}
                onClose={closeDetail}
                onAction={handleAction}
            />
        </div>
    );
};

export default Page;