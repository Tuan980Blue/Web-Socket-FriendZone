import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { uploadService } from '@/services/uploadService';
import { User } from '@/types/user';

interface UseAvatarUploadProps {
  userId: string;
  onSuccess?: (updatedUser: User) => void;
}

export function useAvatarUpload({ userId, onSuccess }: UseAvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadAvatar = async (file: File) => {
    try {
      setIsUploading(true);

      // Upload image to Cloudinary
      const uploadResponse = await uploadService.uploadImage(file);

      // Update user avatar
      const updateResponse = await uploadService.updateUserAvatar(userId, uploadResponse.secure_url);

      if (onSuccess) {
        onSuccess(updateResponse.user);
      }

      notifications.show({
        title: 'Thành công',
        message: 'Ảnh đại diện đã được cập nhật',
        color: 'green',
      });

      return updateResponse.user;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể cập nhật ảnh đại diện',
        color: 'red',
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadAvatar,
  };
} 