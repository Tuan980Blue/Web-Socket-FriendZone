import {motion} from 'framer-motion';
import Image from 'next/image';
import {User} from '@/types/user';
import {Button, Modal, Group, Stack, Image as MantineImage, Avatar} from "@mantine/core";
import {IconCamera, IconUserPlus} from "@tabler/icons-react";
import {RiUserFollowLine} from "react-icons/ri";
import {IoMdMore} from "react-icons/io";
import {AiOutlineMessage} from "react-icons/ai";
import React, {useRef, useState} from "react";
import {useRouter} from 'next/navigation';
import {useAvatarUpload} from '@/hooks/useAvatarUpload';
import {IconX} from '@tabler/icons-react';

interface ProfileHeroProps {
    user: User;
    isCurrentUser: boolean;
    onUpdateUser?: (updatedUser: User) => void;
}

const renderBio = (bio: string | null | undefined) => {
    if (!bio || bio.trim() === '') {
        return <span className="italic text-gray-400">Chưa có mô tả cá nhân.</span>;
    }

    return bio.split('\n').map((line, index) => (
        <p key={index} className="text-gray-800 leading-relaxed">
            {line}
        </p>
    ));
};

export default function ProfileHero({user, isCurrentUser, onUpdateUser}: ProfileHeroProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const {uploadAvatar} = useAvatarUpload({
        userId: user.id,
        onSuccess: onUpdateUser
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

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        setIsPreviewModalOpen(true);
        setIsAvatarModalOpen(false);
    };

    const handleConfirmUpload = async () => {
        if (!previewImage) return;

        try {
            const response = await fetch(previewImage);
            const blob = await response.blob();
            const file = new File([blob], 'avatar.jpg', {type: blob.type});
            await uploadAvatar(file);
            setIsPreviewModalOpen(false);
            setPreviewImage(null);
        } catch (error) {
            console.error('Error handling file upload:', error);
        }
    };

    const handleAvatarClick = () => {
        setIsAvatarModalOpen(true);
    };

    return (
        <div className="relative">
            {/* Profile Content */}
            <div className="max-w-7xl mx-auto px-4 sm:p-6 lg:p-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                    {/* Avatar */}
                    <div className="relative">
                        <Avatar
                            src={user.avatar || '/image-person.png'}
                            alt={user.username}
                            className="object-cover"
                            size={120}
                            onClick={handleAvatarClick}
                        />
                        {isCurrentUser && (
                            <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-1">
                                <button
                                    onClick={handleCameraClick}
                                    className="flex items-center justify-center"
                                >
                                    <IconCamera size={20} className="text-gray-700 dark:text-gray-300"/>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-primery">{user.fullName}</h1>
                        <p className="text-gray-600 mt-1">@{user.username}</p>
                        <div className="mt-1 italic max-w-md space-y-1">
                            {renderBio(user.bio)}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4 md:mt-0">
                        {isCurrentUser ? (
                            <Button
                                className="px-6 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#262626] text-[#262626] dark:text-[#FAFAFA] hover:bg-[#FAFAFA] dark:hover:bg-[#121212] transition-colors duration-200"
                            >
                                Chỉnh sửa trang cá nhân
                            </Button>
                        ) : (
                            <>
                                {user.isFollowing ? (
                                    <Button
                                        variant="light"
                                        size="sm"
                                        radius="md"
                                        className="transition-all duration-200 bg-[#FAFAFA] dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] text-[#262626] dark:text-[#FAFAFA] hover:bg-[#FAFAFA] dark:hover:bg-[#121212]"
                                        leftSection={<RiUserFollowLine size={14}
                                                                       className="text-[#262626] dark:text-[#FAFAFA]"/>}
                                    >
                                        Đang theo dõi
                                    </Button>
                                ) : (
                                    <Button
                                        variant="filled"
                                        size="sm"
                                        radius="md"
                                        className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white hover:opacity-90 transition-all duration-200"
                                        leftSection={<IconUserPlus size={14}/>}
                                    >
                                        Theo dõi
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    radius="md"
                                    className="border border-[#DBDBDB] dark:border-[#262626] text-[#262626] dark:text-[#FAFAFA] hover:bg-[#FAFAFA] dark:hover:bg-[#121212] transition-all duration-200"
                                    leftSection={<AiOutlineMessage size={14}/>}
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
                            className="text-[#262626] dark:text-[#FAFAFA] hover:bg-[#FAFAFA] dark:hover:bg-[#121212] transition-all duration-200"
                        >
                            <IoMdMore size={24}/>
                        </Button>
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
                title="Xem trước ảnh đại diện"
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
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleConfirmUpload}
                            radius="md"
                            className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white hover:opacity-90"
                        >
                            Xác nhận
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
                            priority
                        />
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                            variant="subtle"
                            color="dark"
                            radius="xl"
                            size="lg"
                            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-800/90"
                            onClick={() => setIsAvatarModalOpen(false)}
                        >
                            <IconX size={24} />
                        </Button>
                        {isCurrentUser && (
                            <Button
                                variant="subtle"
                                color="dark"
                                radius="xl"
                                size="lg"
                                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-800/90"
                                onClick={handleCameraClick}
                            >
                                <IconCamera size={24} />
                            </Button>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
