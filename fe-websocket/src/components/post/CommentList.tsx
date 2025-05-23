'use client';

import React, { useState, useEffect } from 'react';
import { Button, Loader } from '@mantine/core';
import { Comment } from '@/types/post';
import { getPostComments } from '@/services/postService';
import CommentItem from './CommentItem';
import { notifications } from '@mantine/notifications';

interface CommentListProps {
  postId: string;
  initialComments?: Comment[];
  onCommentCountChange?: (count: number) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  postId,
  initialComments = [],
  onCommentCountChange,
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchComments = async (pageNum: number, isLoadMore = false) => {
    try {
      const response = await getPostComments(postId, pageNum);
      const newComments = response.data.comments;
      
      if (isLoadMore) {
        setComments(prev => [...prev, ...newComments]);
      } else {
        setComments(newComments);
      }

      setHasMore(pageNum < response.data.pagination.pages);
      onCommentCountChange?.(response.data.pagination.total);
    } catch {
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể tải bình luận',
        color: 'red',
      });
    }
  };

  useEffect(() => {
    if (!initialComments.length) {
      setIsLoading(true);
      fetchComments(1).finally(() => setIsLoading(false));
    }
  }, [postId]);

  const handleLoadMore = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    await fetchComments(nextPage, true);
    setPage(nextPage);
    setIsLoadingMore(false);
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    onCommentCountChange?.(comments.length - 1);
  };

  const handleCommentEdited = (commentId: string, newContent: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, content: newContent, updatedAt: new Date().toISOString() }
          : comment
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader size="sm" />
      </div>
    );
  }

  if (!comments.length) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        Chưa có bình luận nào
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onCommentDeleted={handleCommentDeleted}
          onCommentEdited={handleCommentEdited}
        />
      ))}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="subtle"
            size="xs"
            loading={isLoadingMore}
            onClick={handleLoadMore}
          >
            Xem thêm bình luận
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentList; 