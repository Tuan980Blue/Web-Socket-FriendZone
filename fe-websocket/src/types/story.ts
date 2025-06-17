export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
}

export interface Mention {
  id: string;
  user: User;
}

export interface Hashtag {
  id: string;
  name: string;
}

export interface Story {
  id: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'AUDIO';
  location?: string;
  filter?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  isLikedByCurrentUser: boolean;
  isHighlighted: boolean;
  highlightId?: string;
  authorId: string;
  author: User;
  mentions: Mention[];
  hashtags: Hashtag[];
}

// Enhanced Story type for better type safety
export interface StoryWithAuthor extends Omit<Story, 'author'> {
  author: User;
}

// Story without author for my stories
export interface MyStory extends Omit<Story, 'author'> {
  authorId: string;
}

export interface CreateStoryData {
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'AUDIO';
  location?: string;
  filter?: string;
  mentions?: string[];
  hashtags?: string[];
}

export interface StoryFeedItem {
  author: User;
  stories: Story[];
}

export interface StoryResponse {
  success: boolean;
  data: Story;
  error?: string;
}

export interface StoriesFeedResponse {
  success: boolean;
  data: StoryFeedItem[];
  error?: string;
}

export interface StoriesResponse {
  success: boolean;
  data: Story[];
  error?: string;
}

export interface UserStoriesResponse {
  success: boolean;
  data: {
    author: User;
    stories: Story[];
  };
  error?: string;
}

// Highlight types
export interface Highlight {
  id: string;
  name: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: User;
  stories: Story[];
}

export interface CreateHighlightData {
  name: string;
  coverImage: string;
  storyIds: string[];
}

export interface HighlightResponse {
  success: boolean;
  data: Highlight;
  error?: string;
}

export interface HighlightsResponse {
  success: boolean;
  data: Highlight[];
  error?: string;
}

// Story Like types
export interface StoryLike {
  id: string;
  userId: string;
  storyId: string;
  createdAt: string;
  user: User;
}

export interface StoryLikesResponse {
  success: boolean;
  data: {
    count: number;
    likes: StoryLike[];
  };
  error?: string;
}

// Story View types
export interface StoryView {
  id: string;
  userId: string;
  storyId: string;
  createdAt: string;
  user: User;
}

export interface StoryViewsResponse {
  success: boolean;
  data: {
    story: {
      id: string;
      author: User;
    };
    count: number;
    views: StoryView[];
  };
  error?: string;
}

export interface MyStoryView {
  id: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'AUDIO';
  createdAt: string;
  viewCount: number;
  views: StoryView[];
}

export interface MyStoryViewsResponse {
  success: boolean;
  data: MyStoryView[];
  error?: string;
}

// File upload types
export interface FileUploadProgress {
  progress: number;
  isUploading: boolean;
  error?: string;
}

export interface FileValidation {
  isValid: boolean;
  error?: string;
}

// Story viewer types
export interface StoryViewerState {
  currentIndex: number;
  progress: number;
  isPaused: boolean;
  isLoading: boolean;
  mediaError: boolean;
} 