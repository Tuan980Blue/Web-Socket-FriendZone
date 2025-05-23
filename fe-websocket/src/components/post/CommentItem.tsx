'use client';

import React, { useState } from 'react';
import { Avatar, Menu, TextInput, Button } from '@mantine/core';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Comment } from '@/types/post';
import { useUserData } from '@/hooks/useUserData';
import { editComment, deleteComment } from '@/services/postService';
import { notifications } from '@mantine/notifications';
import { Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

interface CommentItemProps {
  comment: Comment;
  onCommentDeleted: (commentId: string) => void;
  onCommentEdited: (commentId: string, newContent: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onCommentDeleted, onCommentEdited }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUserData();

  const isAuthor = user?.id === comment.author.id;

  const handleEdit = async () => {
    if (!editContent.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await editComment(comment.id, { content: editContent });
      onCommentEdited(comment.id, response.data.content);
      setIsEditing(false);
      notifications.show({
        title: 'Thành công',
        message: 'Bình luận đã được cập nhật',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể cập nhật bình luận',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComment(comment.id);
      onCommentDeleted(comment.id);
      notifications.show({
        title: 'Thành công',
        message: 'Bình luận đã được xóa',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể xóa bình luận',
        color: 'red',
      });
    }
  };

  return (
    <div className="flex space-x-3 py-2">
      <Link href={`/profile/${comment.author.id}`}>
        <Avatar
          src={comment.author.avatar || '/image-person.png'}
          radius="xl"
          size="sm"
          className="cursor-pointer"
        />
      </Link>
      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2">
          {isEditing ? (
            <div className="space-y-2">
              <TextInput
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Chỉnh sửa bình luận..."
                className="w-full"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="subtle"
                  color="gray"
                  size="xs"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                >
                  Hủy
                </Button>
                <Button
                  size="xs"
                  loading={isSubmitting}
                  onClick={handleEdit}
                >
                  Lưu
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <Link
                  href={`/profile/${comment.author.id}`}
                  className="font-semibold text-sm hover:underline"
                >
                  {comment.author.username}
                </Link>
                {isAuthor && (
                  <Menu position="bottom-end" shadow="md" width={200}>
                    <Menu.Target>
                      <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <MoreHorizontal size={16} />
                      </button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<Pencil size={16} />}
                        onClick={() => setIsEditing(true)}
                      >
                        Chỉnh sửa
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        leftSection={<Trash2 size={16} />}
                        onClick={handleDelete}
                      >
                        Xóa
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                )}
              </div>
              <p className="text-sm text-gray-900 dark:text-gray-100">{comment.content}</p>
            </>
          )}
        </div>
        <div className="flex items-center space-x-3 mt-1 px-3">
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
              locale: vi,
            })}
          </span>
          {comment.updatedAt !== comment.createdAt && (
            <span className="text-xs text-gray-500">(đã chỉnh sửa)</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem; 