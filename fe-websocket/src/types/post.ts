export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  isFollowing?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  postId: string;
}

export interface Like {
  id: string;
  createdAt: string;
  user: User;
  postId: string;
}

export interface Post {
  id: string;
  content: string;
  images: string[];
  location?: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  isHighlighted: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  tags: string[];
  filter?: string;
  author: User;
  comments?: Comment[];
  likes?: Like[];
}

export interface CommentFormData {
  content: string;
}

export interface CommentResponse {
  success: boolean;
  data: Comment;
}

export interface CommentsResponse {
  success: boolean;
  data: {
    comments: Comment[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface LikeResponse {
  success: boolean;
  data: {
    liked: boolean;
  };
}

export interface LikesResponse {
  success: boolean;
  data: {
    likes: Like[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface PostPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PostResponse {
  posts: Post[];
  pagination: PostPagination;
}

export interface CreatePostData {
  content: string;
  images: string[];
  location?: string;
  isArchived?: boolean;
  isHighlighted?: boolean;
  filter?: string;
  tags?: string[];
} 