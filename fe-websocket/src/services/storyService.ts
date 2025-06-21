import axios, { AxiosError } from 'axios';
import { 
  Story, 
  CreateStoryData,
  Highlight,
  CreateHighlightData,
  StoryFeedItem,
  User,
  UserStoriesResponse,
  StoryLikesResponse,
  StoryViewsResponse,
  MyStoryView,
  MyStoryViewsResponse,
} from '@/types/story';
import { notifications } from '@mantine/notifications';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error response interface
interface ErrorResponse {
  success: false;
  error: string;
}

export const storyService = {
  // Create a new story
  createStory: async (data: CreateStoryData): Promise<Story> => {
    try {
      const response = await api.post<{ success: true; data: Story }>(`${API_URL}/stories`, data);
      notifications.show({
        title: 'Tạo story thành công',
        message: 'Story của bạn đã được đăng!',
        color: 'green',
      });
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Đã có lỗi xảy ra khi tạo story.';
      notifications.show({
        title: 'Tạo story thất bại',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Get stories feed (from followed users)
  getStoriesFeed: async (): Promise<StoryFeedItem[]> => {
    try {
      const response = await api.get<{ success: true; data: StoryFeedItem[] }>(`${API_URL}/stories/feed`);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Không thể tải stories feed.';
      notifications.show({
        title: 'Lỗi',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Get user's own stories
  getMyStories: async (): Promise<Story[]> => {
    try {
      const response = await api.get<{ success: true; data: Story[] }>(`${API_URL}/stories/my`);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Không thể tải stories.';
      notifications.show({
        title: 'Lỗi',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Get stories by specific user
  getUserStories: async (userId: string): Promise<{ author: User; stories: Story[] }> => {
    try {
      const response = await api.get<UserStoriesResponse>(`${API_URL}/stories/user/${userId}`);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Không thể tải stories của user.';
      notifications.show({
        title: 'Lỗi',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Get story by ID
  getStoryById: async (id: string): Promise<Story> => {
    try {
      const response = await api.get<{ success: true; data: Story }>(`${API_URL}/stories/${id}`);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Không thể tải story.';
      notifications.show({
        title: 'Lỗi',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Delete story
  deleteStory: async (id: string): Promise<void> => {
    try {
      await api.delete(`${API_URL}/stories/${id}`);
      notifications.show({
        title: 'Xóa story thành công',
        message: 'Story đã được xóa!',
        color: 'green',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Không thể xóa story.';
      notifications.show({
        title: 'Xóa story thất bại',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Create highlight
  createHighlight: async (data: CreateHighlightData): Promise<Highlight> => {
    try {
      const response = await api.post<{ success: true; data: Highlight }>(`${API_URL}/stories/highlights`, data);
      notifications.show({
        title: 'Tạo highlight thành công',
        message: 'Highlight đã được tạo!',
        color: 'green',
      });
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Không thể tạo highlight.';
      notifications.show({
        title: 'Tạo highlight thất bại',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Get user's highlights
  getUserHighlights: async (userId: string): Promise<Highlight[]> => {
    try {
      const response = await api.get<{ success: true; data: Highlight[] }>(`${API_URL}/stories/highlights/${userId}`);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Không thể tải highlights.';
      notifications.show({
        title: 'Lỗi',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Delete highlight
  deleteHighlight: async (id: string): Promise<void> => {
    try {
      await api.delete(`${API_URL}/stories/highlights/${id}`);
      notifications.show({
        title: 'Xóa highlight thành công',
        message: 'Highlight đã được xóa!',
        color: 'green',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Không thể xóa highlight.';
      notifications.show({
        title: 'Xóa highlight thất bại',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Add stories to existing highlight
  addStoriesToHighlight: async (highlightId: string, storyIds: string[]): Promise<Highlight> => {
    try {
      const response = await api.post<{ success: true; data: Highlight }>(`${API_URL}/stories/highlights/${highlightId}/add-stories`, {
        storyIds,
      });
      notifications.show({
        title: 'Thêm story thành công',
        message: 'Stories đã được thêm vào highlight!',
        color: 'green',
      });
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Không thể thêm stories vào highlight.';
      notifications.show({
        title: 'Thêm story thất bại',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Remove stories from highlight
  removeStoriesFromHighlight: async (highlightId: string, storyIds: string[]): Promise<Highlight> => {
    try {
      const response = await api.post<{ success: true; data: Highlight }>(`${API_URL}/stories/highlights/${highlightId}/remove-stories`, {
        storyIds,
      });
      notifications.show({
        title: 'Xóa story thành công',
        message: 'Stories đã được xóa khỏi highlight!',
        color: 'green',
      });
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Không thể xóa stories khỏi highlight.';
      notifications.show({
        title: 'Xóa story thất bại',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Update highlight information
  updateHighlight: async (highlightId: string, data: { name?: string; coverImage?: string }): Promise<Highlight> => {
    try {
      const response = await api.put<{ success: true; data: Highlight }>(`${API_URL}/stories/highlights/${highlightId}`, data);
      notifications.show({
        title: 'Cập nhật highlight thành công',
        message: 'Highlight đã được cập nhật!',
        color: 'green',
      });
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Không thể cập nhật highlight.';
      notifications.show({
        title: 'Cập nhật highlight thất bại',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Get highlight by ID
  getHighlightById: async (highlightId: string): Promise<Highlight> => {
    try {
      const response = await api.get<{ success: true; data: Highlight }>(`${API_URL}/stories/highlights/detail/${highlightId}`);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Không thể tải thông tin highlight.';
      notifications.show({
        title: 'Lỗi',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Like a story
  likeStory: async (storyId: string): Promise<void> => {
    try {
      await api.post(`${API_URL}/stories/${storyId}/like`);
      notifications.show({
        title: 'Đã like story',
        message: 'Story đã được like!',
        color: 'green',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Không thể like story.';
      notifications.show({
        title: 'Like story thất bại',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Unlike a story
  unlikeStory: async (storyId: string): Promise<void> => {
    try {
      await api.delete(`${API_URL}/stories/${storyId}/like`);
      notifications.show({
        title: 'Đã unlike story',
        message: 'Story đã được unlike!',
        color: 'green',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Không thể unlike story.';
      notifications.show({
        title: 'Unlike story thất bại',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Get story likes
  getStoryLikes: async (storyId: string): Promise<{ count: number; likes: Array<{ id: string; userId: string; storyId: string; createdAt: string; user: User }> }> => {
    try {
      const response = await api.get<StoryLikesResponse>(`${API_URL}/stories/${storyId}/likes`);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Không thể tải danh sách likes.';
      notifications.show({
        title: 'Lỗi',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Get story views
  getStoryViews: async (storyId: string): Promise<{ story: { id: string; author: User }; count: number; views: Array<{ id: string; userId: string; storyId: string; createdAt: string; user: User }> }> => {
    try {
      const response = await api.get<StoryViewsResponse>(`${API_URL}/stories/${storyId}/views`);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Không thể tải danh sách views.';
      notifications.show({
        title: 'Lỗi',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Get my story views
  getMyStoryViews: async (): Promise<MyStoryView[]> => {
    try {
      const response = await api.get<{ success: true; data: MyStoryView[] }>(`${API_URL}/stories/my/views`);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.error || 'Không thể tải story views.';
      notifications.show({
        title: 'Lỗi',
        message: errorMessage,
        color: 'red',
      });
      throw error;
    }
  },

  // Record story view (when user views a story)
  recordStoryView: async (storyId: string): Promise<void> => {
    try {
      await api.post(`${API_URL}/stories/${storyId}/view`);
      // No notification needed for this action as it's automatic
    } catch (error) {
      // Don't show error notification for view recording as it's not critical
      console.error('Error recording story view:', error);
      // Only throw error if it's not a 404 (story not found)
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.status !== 404) {
        throw error;
      }
    }
  },
}; 