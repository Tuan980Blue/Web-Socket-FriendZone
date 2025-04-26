import Image from 'next/image';
import {User} from '@/types/user';
import {Button, Modal, Group, Stack, Image as MantineImage, Avatar} from "@mantine/core";
import {IconCamera, IconUserPlus, IconEdit} from "@tabler/icons-react";
import {RiUserFollowLine} from "react-icons/ri";
import {IoMdMore} from "react-icons/io";
import {AiOutlineMessage} from "react-icons/ai";
import React, {useRef, useState} from "react";
import {useRouter} from 'next/navigation';
import {useAvatarUpload} from '@/hooks/useAvatarUpload';
import {IconX} from '@tabler/icons-react';
import { useUserData } from '@/hooks/useUserData';

interface ProfileHeroProps {
    user: User;
    isCurrentUser: boolean;
    onUpdateUser?: (updatedUser: User) => void;
    onFollow?: () => Promise<void>;
    onUnfollow?: () => Promise<void>;
    isFollowingLoading?: boolean;
}

const renderBio = (bio: string | null | undefined) => {
    if (!bio || bio.trim() === '') {
        return <span className="text-gray-400">No bio yet</span>;
    }

    return bio.split('\n').map((line, index) => (
        <p key={index} className="text-gray-800 dark:text-gray-200 leading-relaxed">
            {line}
        </p>
    ));
};

export default function ProfileHero({user, isCurrentUser, onUpdateUser, onFollow, onUnfollow, isFollowingLoading = false}: ProfileHeroProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { setUser } = useUserData();
    const { uploadAvatar } = useAvatarUpload({
        userId: user.id,
        onSuccess: (updatedUser) => {
            if (onUpdateUser) {
                onUpdateUser(updatedUser);
            }
            setUser(updatedUser);
        }
    });

    const handleMessageClick = () => {
        router.push(`/messages?userId=${user.id}`);
    };

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset the input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        setIsPreviewModalOpen(true);
        setIsAvatarModalOpen(false);
    };

    const handleConfirmUpload = async () => {
        if (!previewImage) return;

        try {
            setIsUploading(true);
            const response = await fetch(previewImage);
            const blob = await response.blob();
            const file = new File([blob], 'avatar.jpg', {type: blob.type});
            await uploadAvatar(file);
        } catch (error) {
            console.error('Error handling file upload:', error);
        } finally {
            setIsUploading(false);
            setIsPreviewModalOpen(false);
            setPreviewImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleAvatarClick = () => {
        setIsAvatarModalOpen(true);
    };

    return (
        <div className="">
            {/* Profile Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 py-8">
                    {/* Avatar Section */}
                    <div className="relative w-fit group">
                        <Avatar
                            src={user.avatar || '/image-person.png'}
                            alt={user.username}
                            className="object-cover rounded-full ring-2 ring-gray-300 dark:ring-gray-600 transition-all duration-300"
                            size={120}
                            onClick={handleAvatarClick}
                        />

                        {isCurrentUser && (
                            <>
                                <button
                                    onClick={handleCameraClick}
                                    className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 p-1 rounded-full shadow-md transition-all duration-200 "
                                >
                                    <IconCamera size={22} className="text-gray-700 dark:text-gray-300" />
                                </button>

                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </>
                        )}
                    </div>
                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <h1 className="text-2xl font-light">{user.username}</h1>
                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                {isCurrentUser ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        radius="md"
                                        className="border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                        leftSection={<IconEdit size={16}/>}
                                    >
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <>
                                        {user.isFollowing ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                radius="md"
                                                className="border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                                leftSection={<RiUserFollowLine size={16}/>}
                                                onClick={onUnfollow}
                                                loading={isFollowingLoading}
                                                disabled={isFollowingLoading}
                                            >
                                                Following
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="filled"
                                                size="sm"
                                                radius="md"
                                                className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                                                leftSection={<IconUserPlus size={16}/>}
                                                onClick={onFollow}
                                                loading={isFollowingLoading}
                                                disabled={isFollowingLoading}
                                            >
                                                Follow
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            radius="md"
                                            className="border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                            leftSection={<AiOutlineMessage size={16}/>}
                                            onClick={handleMessageClick}
                                        >
                                            Message
                                        </Button>
                                    </>
                                )}
                                <Button
                                    variant="subtle"
                                    size="sm"
                                    radius="md"
                                    className="text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                >
                                    <IoMdMore size={24}/>
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-6 text-sm">
                            <div className="flex items-center gap-1">
                                <span className="font-semibold">{user.postsCount || 0}</span>
                                <span className="text-gray-600 dark:text-gray-400">posts</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="font-semibold">{user.followersCount || 0}</span>
                                <span className="text-gray-600 dark:text-gray-400">followers</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="font-semibold">{user.followingCount || 0}</span>
                                <span className="text-gray-600 dark:text-gray-400">following</span>
                            </div>
                        </div>

                        <div className="text-left">
                            <p className="font-semibold">{user.fullName}</p>
                            <div className="mt-1 text-gray-800 dark:text-gray-200">
                                {renderBio(user.bio)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            <Modal
                opened={isPreviewModalOpen}
                onClose={() => {
                    setIsPreviewModalOpen(false);
                    setPreviewImage(null);
                }}
                title="Preview Profile Picture"
                size="md"
                centered
                radius="lg"
                classNames={{
                    header: "border-b border-gray-200 dark:border-gray-700",
                    body: "p-4",
                }}
            >
                <Stack gap="md">
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                        {previewImage && (
                            <MantineImage
                                src={previewImage}
                                alt="Preview"
                                fit="cover"
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>
                    <Group justify="flex-end" gap="sm">
                        <Button
                            variant="default"
                            onClick={() => {
                                setIsPreviewModalOpen(false);
                                setPreviewImage(null);
                            }}
                            radius="md"
                            className="border border-gray-300 dark:border-gray-600"
                            disabled={isUploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmUpload}
                            radius="md"
                            className="bg-blue-500 text-white hover:bg-blue-600"
                            loading={isUploading}
                            disabled={isUploading}
                        >
                            {isUploading ? 'Uploading...' : 'Confirm'}
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            {/* Full Size Avatar Modal */}
            <Modal
                opened={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
                size="md"
                centered
                withCloseButton={false}
                padding={0}
                radius="lg"
                closeOnClickOutside={true}
                closeOnEscape={true}
                classNames={{
                    body: "p-0",
                    content: "bg-transparent",
                }}
            >
                <div className="relative">
                    <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                        <Image
                            src={user.avatar || '/image-person.png'}
                            alt={user.username}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                        {isCurrentUser && (
                            <button
                                onClick={handleCameraClick}
                                className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors duration-200"
                            >
                                <IconCamera size={24} className="text-white"/>
                            </button>
                        )}
                        <button
                            onClick={() => setIsAvatarModalOpen(false)}
                            className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors duration-200"
                        >
                            <IconX size={24} className="text-white"/>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
