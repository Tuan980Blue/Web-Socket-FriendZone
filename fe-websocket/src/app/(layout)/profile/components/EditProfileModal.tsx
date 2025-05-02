import { Modal, TextInput, Textarea, Button, Stack, Group, Avatar, Text, Divider } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCamera } from '@tabler/icons-react';
import { useState, useRef } from 'react';
import { User } from '@/types/user';
import { useUserData } from '@/hooks/useUserData';
import { userService } from '@/services/userService';
import { notifications } from '@mantine/notifications';

interface EditProfileModalProps {
    opened: boolean;
    onClose: () => void;
    user: User;
    onUpdateUser: (updatedUser: User) => void;
}

export default function EditProfileModal({ opened, onClose, user, onUpdateUser }: EditProfileModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { setUser } = useUserData();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        initialValues: {
            fullName: user.fullName || '',
            username: user.username || '',
            bio: user.bio || '',
            website: user.website || '',
            location: user.location || '',
            phoneNumber: user.phoneNumber || '',
            gender: user.gender || '',
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            setIsLoading(true);
            const updatedUser = await userService.updateProfile(user.id, values);
            onUpdateUser(updatedUser);
            setUser(updatedUser);
            notifications.show({
                title: 'Success',
                message: 'Profile updated successfully',
                color: 'green',
            });
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            notifications.show({
                title: 'Error',
                message: 'Failed to update profile',
                color: 'red',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);

        try {
            const updatedUser = await userService.uploadAvatar(user.id, file);
            onUpdateUser(updatedUser);
            setUser(updatedUser);
            notifications.show({
                title: 'Success',
                message: 'Profile photo updated successfully',
                color: 'green',
            });
        } catch (error) {
            console.error('Error uploading avatar:', error);
            notifications.show({
                title: 'Error',
                message: 'Failed to upload profile photo',
                color: 'red',
            });
            setPreviewImage(null);
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Edit Profile"
            size="md"
            centered
            radius="lg"
            classNames={{
                header: "border-b border-gray-200 dark:border-gray-700",
                body: "p-4",
            }}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="xl">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar
                                src={previewImage || user.avatar || '/image-person.png'}
                                alt={user.username}
                                size={80}
                                radius="xl"
                                className="border border-gray-200 dark:border-gray-700"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-1 rounded-full shadow-md border border-gray-200 dark:border-gray-700"
                            >
                                <IconCamera size={16} className="text-gray-700 dark:text-gray-300" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        <div>
                            <Text size="lg" fw={500}>{user.username}</Text>
                            <Button
                                variant="subtle"
                                color="blue"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Change Profile Photo
                            </Button>
                        </div>
                    </div>

                    <Divider />

                    {/* Form Fields */}
                    <Stack gap="md">
                        <TextInput
                            label="Full Name"
                            placeholder="Enter your full name"
                            {...form.getInputProps('fullName')}
                            classNames={{
                                label: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                input: "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500",
                            }}
                        />

                        <TextInput
                            label="Username"
                            placeholder="Enter your username"
                            {...form.getInputProps('username')}
                            classNames={{
                                label: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                input: "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500",
                            }}
                        />

                        <Textarea
                            label="Bio"
                            placeholder="Write something about yourself"
                            autosize
                            minRows={3}
                            maxRows={5}
                            {...form.getInputProps('bio')}
                            classNames={{
                                label: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                input: "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500",
                            }}
                        />

                        <TextInput
                            label="Website"
                            placeholder="Add your website"
                            {...form.getInputProps('website')}
                            classNames={{
                                label: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                input: "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500",
                            }}
                        />

                        <TextInput
                            label="Location"
                            placeholder="Add your location"
                            {...form.getInputProps('location')}
                            classNames={{
                                label: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                input: "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500",
                            }}
                        />

                        <TextInput
                            label="Phone Number"
                            placeholder="Add your phone number"
                            {...form.getInputProps('phoneNumber')}
                            classNames={{
                                label: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                input: "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500",
                            }}
                        />

                        <TextInput
                            label="Gender"
                            placeholder="Add your gender"
                            {...form.getInputProps('gender')}
                            classNames={{
                                label: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                input: "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500",
                            }}
                        />
                    </Stack>

                    {/* Action Buttons */}
                    <Group justify="flex-end" gap="sm">
                        <Button
                            variant="default"
                            onClick={onClose}
                            radius="md"
                            className="border border-gray-300 dark:border-gray-600"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            radius="md"
                            className="bg-blue-500 text-white hover:bg-blue-600"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
} 