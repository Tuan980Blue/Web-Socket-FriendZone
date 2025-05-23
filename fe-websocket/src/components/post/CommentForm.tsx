'use client';

import React, { useState } from 'react';
import { TextInput, Button, Avatar } from '@mantine/core';
import { useUserData } from '@/hooks/useUserData';
import { addComment } from '@/services/postService';
import { notifications } from '@mantine/notifications';
import { Comment } from '@/types/post';

interface CommentFormProps {
  postId: string;
  onCommentAdded: (comment: Comment) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUserData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await addComment(postId, { content });
      onCommentAdded(response.data);
      setContent('');
      notifications.show({
        title: 'Thành công',
        message: 'Bình luận đã được thêm',
        color: 'green',
      });
    } catch {
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể thêm bình luận',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="flex items-start space-x-3 p-4 border-t dark:border-gray-800">
      <Avatar
        src={user.avatar || '/image-person.png'}
        radius="xl"
        size="sm"
      />
      <div className="flex-1 flex space-x-2">
        <TextInput
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Thêm bình luận..."
          className="flex-1"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          loading={isSubmitting}
        >
          Đăng
        </Button>
      </div>
    </form>
  );
};

export default CommentForm; 