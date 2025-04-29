'use client';

import React, {useState} from 'react';
import {Avatar, Modal, Button, Group, Menu} from '@mantine/core';
import {Heart, MessageCircle, Send, Bookmark, MoreHorizontal, MapPin, Trash2, Flag, Share2, Copy} from 'lucide-react';
import {Post} from '@/types/post';
import {formatDistanceToNow} from 'date-fns';
import {vi} from 'date-fns/locale';
import Image from 'next/image';
import Link from "next/link";
import {useUserData} from '@/hooks/useUserData';
import {usePosts} from '@/hooks/usePosts';
import {notifications} from '@mantine/notifications';

interface PostCardProps {
    post: Post;
    onPostDeleted?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({post, onPostDeleted}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const {user} = useUserData();
    const {deletePost, isDeleting} = usePosts();

    const isAuthor = user?.id === post.author.id;

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
    };

    const handleComment = () => {
        setShowComments(!showComments);
    };

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            // TODO: Handle comment submission
            setCommentText('');
        }
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
        const postLink = `${window.location.origin}/post/${post.id}`;
        navigator.clipboard.writeText(postLink);
        notifications.show({
            title: 'Đã sao chép liên kết',
            message: 'Liên kết bài viết đã được sao chép vào clipboard!',
            color: 'green',
        });
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
                    <div className="relative w-full max-h-[400px] overflow-hidden bg-gray-100 dark:bg-gray-900">
                        <div
                            className="aspect-square w-full max-w-xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-center">
                            <Image
                                src={post.images[currentImageIndex]}
                                alt="Post image"
                                width={500}
                                height={300}
                                className="w-full h-full object-contain rounded-lg"
                            />
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
                            className={`p-1 rounded-full ${isLiked ? 'text-red-500' : 'text-[#262626] dark:text-[#FAFAFA]'}`}
                            onClick={handleLike}
                        >
                            <Heart size={24} fill={isLiked ? 'currentColor' : 'none'}/>
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
                        className={`p-1 rounded-full ${isSaved ? 'text-[#262626] dark:text-[#FAFAFA]' : 'text-[#262626] dark:text-[#FAFAFA]'}`}
                        onClick={handleSave}
                    >
                        <Bookmark size={24} fill={isSaved ? 'currentColor' : 'none'}/>
                    </button>
                </div>

                {/* Post Stats */}
                <div className="text-sm font-semibold text-[#262626] dark:text-[#FAFAFA] mb-2">
                    1,234 likes
                </div>

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
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-4">
                        <h3 className="font-semibold mb-2">Comments</h3>
                        {/* TODO: Add comments list */}
                        <form onSubmit={handleSubmitComment} className="flex items-center mt-4">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DD2A7B]"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="ml-2 text-[#DD2A7B] font-semibold text-sm"
                                disabled={!commentText.trim()}
                            >
                                Post
                            </button>
                        </form>
                    </div>
                )}

                {/* Post Time */}
                <div className="text-xs text-[#8E8E8E] mt-2">
                    {formatDistanceToNow(new Date(post.createdAt), {addSuffix: true, locale: vi})}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                opened={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Xác nhận xóa bài viết"
                centered
            >
                <div className="text-center">
                    <p className="mb-4">Bạn có chắc chắn muốn xóa bài viết này?</p>
                    <Group justify="center" gap="md">
                        <Button
                            variant="light"
                            color="gray"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            color="red"
                            loading={isDeleting}
                            onClick={handleDelete}
                        >
                            Xóa
                        </Button>
                    </Group>
                </div>
            </Modal>
        </div>
    );
};

export default PostCard; 