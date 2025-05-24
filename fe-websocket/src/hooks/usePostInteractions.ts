import { useState, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { toggleLike, getPostLikes } from '@/services/postService';
import { Like } from '@/types/post';

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
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      const response = await toggleLike(postId);
      setIsLiked(response.data.liked);
      const newLikeCount = response.data.liked ? likeCount + 1 : likeCount - 1;
      setLikeCount(newLikeCount);
      onLikeCountChange?.(newLikeCount);
    } catch {
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể thực hiện thao tác like',
        color: 'red',
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleShowLikesModal = useCallback(async () => {
    setShowLikesModal(true);
    try {
      setIsLoadingLikes(true);
      const response = await getPostLikes(postId);
      if (response.success && response.data) {
        setLikes(response.data.likes);
      }
    } catch {
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể tải danh sách likes',
        color: 'red',
      });
    } finally {
      setIsLoadingLikes(false);
    }
  }, [postId]);

  const handleCommentAdded = () => {
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
    isLoadingLikes,
    handleLike,
    setShowLikesModal,
    handleShowLikesModal,

    // Comment states and handlers
    commentCount,
    handleCommentAdded,
    handleCommentDeleted,
    handleCommentEdited,
  };
}; 