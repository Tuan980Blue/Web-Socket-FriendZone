'use client';

import React, {useState} from 'react';
import {Avatar, Modal, Menu, Button, Text, Group, Stack, Divider, Badge} from '@mantine/core';
import {
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    MoreHorizontal,
    MapPin,
    Trash2,
    Flag,
    Share2,
    Copy,
    UserPlus,
    UserMinus,
    Clock,
    EditIcon
} from 'lucide-react';
import {Post} from '@/types/post';
import {formatDistanceToNow} from 'date-fns';
import {vi} from 'date-fns/locale';
import Image from 'next/image';
import Link from "next/link";
import {useUserData} from '@/hooks/useUserData';
import {usePosts} from '@/hooks/usePosts';
import {notifications} from '@mantine/notifications';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import {usePostInteractions} from '@/hooks/usePostInteractions';
import {useFollows} from '@/hooks/useFollows';
import {postService} from '@/services/postService';

interface PostCardProps {
    post: Post;
    onPostDeleted?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({post, onPostDeleted}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [isUpdating, setIsUpdating] = useState(false);
    const {user} = useUserData();
    const {deletePost, isDeleting} = usePosts();
    const {handleFollow, handleUnfollow} = useFollows();

    const {
        isLiked,
        likeCount,
        isLiking,
        showLikesModal,
        likes,
        isLoadingLikes,
        handleLike,
        setShowLikesModal,
        handleShowLikesModal,
        commentCount,
        handleCommentAdded,
        handleCommentDeleted,
    } = usePostInteractions({
        postId: post.id,
        initialLikeCount: post.likeCount,
        initialCommentCount: post.commentCount,
        initialLikes: post.likes,
    });

    const isAuthor = user?.id === post.author.id;

    const handleSave = () => {
        setIsSaved(!isSaved);
    };

    const handleComment = () => {
        setShowComments(!showComments);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
    };

    const handleDelete = async () => {
        try {
            await deletePost(post.id);
            setShowDeleteModal(false);
            onPostDeleted?.(post.id);
        } catch {
            // Error handling is already done in usePosts hook
        }
    };

    const handleCopyLink = () => {
        const postLink = `${window.location.origin}/posts/${post.id}`;
        navigator.clipboard.writeText(postLink);
        notifications.show({
            title: 'Đã sao chép liên kết',
            message: 'Liên kết bài viết đã được sao chép vào clipboard!',
            color: 'green',
        });
    };

    const handleEdit = () => {
        setEditContent(post.content);
        setShowEditModal(true);
    };
    const handleUpdatePost = async () => {
        setIsUpdating(true);
        try {
            await postService.updatePost(post.id, editContent);
            setShowEditModal(false);
            // Cập nhật UI: có thể gọi onPostUpdated nếu truyền vào, hoặc cập nhật trực tiếp nếu dùng state cha
            // Ở đây cập nhật tạm thời bằng cách reload trang hoặc bạn có thể truyền thêm prop onPostUpdated
            window.location.reload();
        } catch {
            // error đã được thông báo ở service
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div
            className="bg-white dark:bg-[#121212] rounded-xl shadow-md overflow-hidden mb-6 border border-gray-200 dark:border-gray-800">
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
                <Link href={`/profile/${post.author.id}`} className="flex items-center space-x-3 group">
                    <div
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] p-[2px] shadow-lg">
                        <div
                            className="w-full h-full bg-white dark:bg-black rounded-full flex items-center justify-center">
                            <Avatar src={post.author.avatar || '/image-person.png'} radius="xl" size="md"/>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-[#262626] dark:text-[#FAFAFA]">
                            {post.author.fullName}
                        </span>
                        <span className="flex items-center text-xs text-[#8E8E8E]">
                            <MapPin size={12} className="mr-1"/>
                            {post.location || 'Ho Chi Minh City'}
                        </span>
                    </div>
                </Link>
                <Menu position="bottom-end" shadow="md" width={200}>
                    <Menu.Target>
                        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                            <MoreHorizontal size={20} className="text-[#262626] dark:text-[#FAFAFA]"/>
                        </button>
                    </Menu.Target>

                    <Menu.Dropdown>
                        {isAuthor && (
                            <Menu.Item
                                leftSection={<EditIcon size={16}/>} // cần import EditIcon
                                onClick={handleEdit}
                            >
                                Chỉnh sửa bài viết
                            </Menu.Item>
                        )}
                        {isAuthor && (
                            <Menu.Item
                                color="red"
                                leftSection={<Trash2 size={16}/>}
                                onClick={() => setShowDeleteModal(true)}
                            >
                                Xóa bài viết
                            </Menu.Item>
                        )}
                        <Menu.Item
                            leftSection={<Share2 size={16}/>}
                            onClick={handleCopyLink}
                        >
                            Chia sẻ
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<Copy size={16}/>}
                            onClick={handleCopyLink}
                        >
                            Sao chép liên kết
                        </Menu.Item>
                        {!isAuthor && (
                            <Menu.Item
                                color="red"
                                leftSection={<Flag size={16}/>}
                            >
                                Báo cáo
                            </Menu.Item>
                        )}
                    </Menu.Dropdown>
                </Menu>
            </div>

            {/* Post Images */}
            {post.images.length > 0 && (
                <div className="relative">
                    <div className="relative w-full bg-gray-100 dark:bg-gray-900">
                        <div className="w-full max-w-xl mx-auto">
                            <div className="relative w-full" style={{paddingBottom: '100%'}}>
                                <Image
                                    src={post.images[currentImageIndex]}
                                    alt="Post image"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover"
                                    priority={currentImageIndex === 0}
                                />
                            </div>
                        </div>

                        {/* Image Navigation Dots */}
                        {post.images.length > 1 && (
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
                                {post.images.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            index === currentImageIndex
                                                ? 'bg-white scale-125'
                                                : 'bg-white/50 hover:bg-white/70'
                                        }`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Image Navigation Arrows */}
                        {post.images.length > 1 && (
                            <>
                                <button
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-10"
                                    onClick={prevImage}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </button>
                                <button
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-10"
                                    onClick={nextImage}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Post Actions */}
            <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-4">
                        <button
                            className={`p-1 rounded-full transition-colors duration-200 ${
                                isLiked ? 'text-red-500' : 'text-[#262626] dark:text-[#FAFAFA]'
                            }`}
                            onClick={handleLike}
                            disabled={isLiking}
                        >
                            <Heart
                                size={24}
                                fill={isLiked ? 'currentColor' : 'none'}
                                className={isLiked ? 'animate-like' : ''}
                            />
                        </button>
                        <button
                            className="p-1 rounded-full text-[#262626] dark:text-[#FAFAFA]"
                            onClick={handleComment}
                        >
                            <MessageCircle size={24}/>
                        </button>
                        <button className="p-1 rounded-full text-[#262626] dark:text-[#FAFAFA]">
                            <Send size={24}/>
                        </button>
                    </div>
                    <button
                        className={`p-1 rounded-full transition-colors duration-200 ${
                            isSaved ? 'text-[#262626] dark:text-[#FAFAFA]' : 'text-[#262626] dark:text-[#FAFAFA]'
                        }`}
                        onClick={handleSave}
                    >
                        <Bookmark size={24} fill={isSaved ? 'currentColor' : 'none'}/>
                    </button>
                </div>

                {/* Post Stats */}
                <div className="space-y-2">
                    {likeCount > 0 && (
                        <button
                            onClick={handleShowLikesModal}
                            className="text-sm font-semibold text-[#262626] dark:text-[#FAFAFA] hover:underline"
                        >
                            {likeCount.toLocaleString()} lượt thích
                        </button>
                    )}

                    {/* Post Content */}
                    <div className="mb-2">
                        <span className="font-semibold mr-2">{post.author.username}</span>
                        <span className="text-[#262626] dark:text-[#FAFAFA]">{post.content}</span>
                    </div>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-blue-500 text-sm"
                                >
                #{tag}
              </span>
                            ))}
                        </div>
                    )}

                    {/* Comments Section */}
                    {showComments && (
                        <div className="mt-4 space-y-4">
                            <CommentList
                                postId={post.id}
                                initialComments={post.comments}
                                onCommentCountChange={handleCommentDeleted}
                            />
                            <CommentForm
                                postId={post.id}
                                onCommentAdded={handleCommentAdded}
                            />
                        </div>
                    )}

                    {/* View Comments Button */}
                    {commentCount > 0 && !showComments && (
                        <button
                            onClick={handleComment}
                            className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
                        >
                            Xem tất cả {commentCount} bình luận
                        </button>
                    )}
                </div>

                {/* Post Time */}
                <div className="text-xs text-[#8E8E8E] mt-2">
                    {formatDistanceToNow(new Date(post.createdAt), {addSuffix: true, locale: vi})}
                </div>
            </div>

            {/* Likes Modal */}
            <Modal
                opened={showLikesModal}
                onClose={() => setShowLikesModal(false)}
                size="sm"
                radius="md"
                padding={0}
                styles={{
                    header: {
                        padding: '16px 20px',
                        borderBottom: '1px solid var(--mantine-color-gray-3)',
                        backgroundColor: 'var(--mantine-color-body)',
                    },
                    body: {
                        padding: 0,
                    },
                }}
            >
                <div className="flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <Text size="lg" fw={600} ta="center">
                            Lượt thích
                        </Text>
                        <Text size="sm" c="dimmed" ta="center" mt={4}>
                            {likeCount.toLocaleString()} người đã thích bài viết này
                        </Text>
                    </div>

                    {/* Likes List */}
                    <div className="max-h-[60vh] overflow-y-auto">
                        {isLoadingLikes ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div
                                    className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                                <Text size="sm" c="dimmed" mt={4}>
                                    Đang tải danh sách...
                                </Text>
                            </div>
                        ) : likes.length > 0 ? (
                            <Stack gap={0}>
                                {likes.map((like, index) => (
                                    <div key={like.id}>
                                        <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                            <Group justify="space-between" wrap="nowrap">
                                                <Group gap="sm" wrap="nowrap">
                                                    <div className="relative">
                                                        <div
                                                            className="w-12 h-12 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] p-[2px]">
                                                            <div
                                                                className="w-full h-full bg-white dark:bg-black rounded-full flex items-center justify-center">
                                                                <Avatar
                                                                    src={like.user.avatar || '/image-person.png'}
                                                                    radius="xl"
                                                                    size="md"
                                                                />
                                                            </div>
                                                        </div>
                                                        {like.user.id === user?.id && (
                                                            <Badge
                                                                size="xs"
                                                                variant="filled"
                                                                color="blue"
                                                                className="absolute -top-1 -right-1"
                                                            >
                                                                Bạn
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <Group gap={4} wrap="nowrap">
                                                            <Link
                                                                href={`/profile/${like.user.id}`}
                                                                className="font-semibold hover:underline truncate"
                                                            >
                                                                {like.user.username}
                                                            </Link>
                                                            {like.user.id === post.author.id && (
                                                                <Badge size="xs" variant="light" color="blue">
                                                                    Tác giả
                                                                </Badge>
                                                            )}
                                                        </Group>
                                                        <Text size="xs" c="dimmed" className="flex items-center gap-1">
                                                            <Clock size={12}/>
                                                            {formatDistanceToNow(new Date(like.createdAt), {
                                                                addSuffix: true,
                                                                locale: vi
                                                            })}
                                                        </Text>
                                                    </div>
                                                </Group>
                                                {like.user.id !== user?.id && (
                                                    <Button
                                                        variant="subtle"
                                                        size="xs"
                                                        radius="xl"
                                                        onClick={() => {
                                                            const isFollowing = like.user.isFollowing ?? false;
                                                            if (isFollowing) {
                                                                handleUnfollow(like.user.id);
                                                            } else {
                                                                handleFollow(like.user.id);
                                                            }
                                                        }}
                                                        leftSection={
                                                            (like.user.isFollowing ?? false) ? (
                                                                <UserMinus size={14}/>
                                                            ) : (
                                                                <UserPlus size={14}/>
                                                            )
                                                        }
                                                    >
                                                        {(like.user.isFollowing ?? false) ? 'Bỏ theo dõi' : 'Theo dõi'}
                                                    </Button>
                                                )}
                                            </Group>
                                        </div>
                                        {index < likes.length - 1 && (
                                            <Divider/>
                                        )}
                                    </div>
                                ))}
                            </Stack>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 px-4">
                                <div
                                    className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                    <Heart size={24} className="text-gray-400"/>
                                </div>
                                <Text size="lg" fw={500} ta="center">
                                    Chưa có lượt thích nào
                                </Text>
                                <Text size="sm" c="dimmed" ta="center" mt={4}>
                                    Hãy là người đầu tiên thích bài viết này
                                </Text>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                opened={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                centered
                withCloseButton={false}
                size="xs"
                radius="md"
                padding={0}
                styles={{
                    body: {
                        padding: 0,
                    },
                }}
            >
                <div className="flex flex-col items-center">
                    <div className="w-full p-6 text-center">
                        <Trash2 size={48} className="mx-auto mb-4 text-red-500"/>
                        <h3 className="text-xl font-semibold mb-2">Xóa bài viết?</h3>
                        <p className="text-gray-500 mb-6">Bạn có chắc chắn muốn xóa bài viết này? Hành động này không
                            thể hoàn tác.</p>
                    </div>
                    <div className="w-full border-t border-gray-200 dark:border-gray-800">
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="w-full py-4 text-red-500 font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                        >
                            {isDeleting ? 'Đang xóa...' : 'Xóa'}
                        </button>
                        <div className="w-full border-t border-gray-200 dark:border-gray-800">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="w-full py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Edit Post Modal */}
            <Modal
                opened={showEditModal}
                onClose={() => setShowEditModal(false)}
                centered
                withCloseButton
                size="sm"
                radius="md"
                title="Chỉnh sửa nội dung bài viết"
            >
                <textarea
                    className="w-full border rounded p-2 min-h-[80px]"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    disabled={isUpdating}
                />
                <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="default" onClick={() => setShowEditModal(false)} disabled={isUpdating}>Hủy</Button>
                    <Button onClick={handleUpdatePost} loading={isUpdating} disabled={editContent.trim() === '' || isUpdating}>
                        Lưu
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default PostCard; 