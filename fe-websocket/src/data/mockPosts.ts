export interface Post {
  id: string;
  author: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  content: string;
  images: string[];
  location?: string;
  tags: string[];
  createdAt: string;
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  isLiked: boolean;
  isSaved: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

export const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      username: 'tuan21',
      fullName: 'Tuấn Anh 21',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    content: 'Vừa hoàn thành buổi tập sáng nay! 💪 Cảm thấy tràn đầy năng lượng và sẵn sàng cho cả ngày dài. #tập_luyện #lối_sống_khoẻ #động_lực',
    images: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?...',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?...',
    ],
    location: 'FPT Gym, TP. HCM',
    tags: ['tập_luyện', 'lối_sống_khoẻ', 'động_lực'],
    createdAt: '2023-06-15T08:30:00Z',
    stats: {
      likes: 1243,
      comments: 89,
      shares: 45,
      views: 5678,
    },
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    author: {
      id: 'user2',
      username: 'huanhoahong',
      fullName: 'Huấn Hoa Hồng',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    content: 'Hoàng hôn hôm nay thật tuyệt vời! 🌅 Thiên nhiên luôn biết cách khiến mình phải ngẩn ngơ. #hoàng_hôn #biển #thiên_nhiên #nhiếp_ảnh',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?...',
    ],
    location: 'Miami Beach, Florida',
    tags: ['hoàng_hôn', 'biển', 'thiên_nhiên', 'nhiếp_ảnh'],
    createdAt: '2023-06-14T19:15:00Z',
    stats: {
      likes: 2156,
      comments: 124,
      shares: 78,
      views: 8765,
    },
    isLiked: true,
    isSaved: true,
  },
  {
    id: '3',
    author: {
      id: 'user3',
      username: 'linhtran2k7',
      fullName: 'Linh Trần',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    content: 'Vừa khám phá được một quán Ý siêu ngon! Mì pasta đỉnh của chóp, không gian thì chill khỏi bàn. Chắc chắn sẽ quay lại! 🍝 #mê_ăn #ẩm_thực_ý #quán_ngon #bữa_tối',
    images: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?...',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?...',
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?...',
    ],
    location: 'Lê Văn Lương, Quận 7',
    tags: ['mê_ăn', 'ẩm_thực_ý', 'quán_ngon', 'bữa_tối'],
    createdAt: '2023-06-13T20:45:00Z',
    stats: {
      likes: 3421,
      comments: 256,
      shares: 123,
      views: 12456,
    },
    isLiked: false,
    isSaved: false,
  },
];
export const mockComments: Comment[] = [
  {
    id: 'comment1',
    postId: '1',
    author: {
      id: 'user4',
      username: 'fitness_fanatic',
      fullName: 'Mike Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    content: 'Làm tốt lắm! Tiếp tục cố gắng nhé! 💪',
    createdAt: '2023-06-15T09:00:00Z',
    likes: 12,
    isLiked: false,
  },
  {
    id: 'comment2',
    postId: '1',
    author: {
      id: 'user5',
      username: 'gym_rat',
      fullName: 'Alex Thompson',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    content: 'Bạn đang theo giáo án tập luyện nào vậy?',
    createdAt: '2023-06-15T09:15:00Z',
    likes: 5,
    isLiked: true,
    replies: [
      {
        id: 'reply1',
        postId: '1',
        author: {
          id: 'user1',
          username: 'johndoe',
          fullName: 'John Doe',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
        content: 'Mình đang theo giáo án PPL (Push, Pull, Legs) kết hợp thêm cardio nữa!',
        createdAt: '2023-06-15T09:30:00Z',
        likes: 3,
        isLiked: false,
      },
    ],
  },
  {
    id: 'comment3',
    postId: '2',
    author: {
      id: 'user6',
      username: 'nature_lover',
      fullName: 'Emily Davis',
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    },
    content: 'Cảnh này đẹp nao lòng luôn ấy! 😍',
    createdAt: '2023-06-14T20:00:00Z',
    likes: 18,
    isLiked: false,
  },
];
