import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { toggleLike, getPostLikes } from '@/services/postService';
import { Like, Comment } from '@/types/post';

interface UsePostInteractionsProps {
  postId: string;
  initialLikeCount: number;
  initialCommentCount: number;
  initialLikes?: Like[];
  onLikeCountChange?: (count: number) => void;
  onCommentCountChange?: (count: number) => void;
}

export const usePostInteractions = ({
  postId,
  initialLikeCount,
  initialCommentCount,
  initialLikes = [],
  onLikeCountChange,
  onCommentCountChange,
}: UsePostInteractionsProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [isLiking, setIsLiking] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likes, setLikes] = useState<Like[]>(initialLikes);

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      const response = await toggleLike(postId);
      setIsLiked(response.data.liked);
      const newLikeCount = response.data.liked ? likeCount + 1 : likeCount - 1;
      setLikeCount(newLikeCount);
      onLikeCountChange?.(newLikeCount);
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể thực hiện thao tác like',
        color: 'red',
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentAdded = (comment: Comment) => {
    const newCommentCount = commentCount + 1;
    setCommentCount(newCommentCount);
    onCommentCountChange?.(newCommentCount);
  };

  const handleCommentDeleted = () => {
    const newCommentCount = commentCount - 1;
    setCommentCount(newCommentCount);
    onCommentCountChange?.(newCommentCount);
  };

  const handleCommentEdited = () => {
    // Comment count doesn't change when editing
  };

  return {
    // Like states and handlers
    isLiked,
    likeCount,
    isLiking,
    showLikesModal,
    likes,
    handleLike,
    setShowLikesModal,

    // Comment states and handlers
    commentCount,
    handleCommentAdded,
    handleCommentDeleted,
    handleCommentEdited,
  };
}; 