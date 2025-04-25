export interface Post {
  id: string;
  content: string;
  images: string[];
  location?: string;
  isArchived: boolean;
  isHighlighted: boolean;
  filter?: string;
  tags: string[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
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