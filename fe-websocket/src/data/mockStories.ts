import { StoryItem, StoryGroup } from '@/hooks/useStories';

// Mock data for stories
export const generateMockStories = (): StoryItem[] => {
  const users = [
    { id: 'user1', username: 'Nguyễn Văn', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
    { id: 'user2', username: 'Trần Thao', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
    { id: 'user3', username: 'Lê Tran', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
    { id: 'user4', username: 'Phạm Lam', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
    { id: 'user5', username: 'Hoàng Văn', avatarUrl: 'https://i.pravatar.cc/150?img=7' },
    { id: 'user6', username: 'Đặng Thanh', avatarUrl: 'https://i.pravatar.cc/150?img=8' },
    { id: 'user7', username: 'Bùi Vy', avatarUrl: 'https://i.pravatar.cc/150?img=9' },
    { id: 'user8', username: 'Võ Thương', avatarUrl: 'https://i.pravatar.cc/150?img=10' },
    { id: 'user13', username: 'Nguyễn Văn', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
    { id: 'user23', username: 'Trần Thao', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
    { id: 'user33', username: 'Lê Tran', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
    { id: 'user43', username: 'Phạm Lam', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
    { id: 'user53', username: 'Hoàng Văn', avatarUrl: 'https://i.pravatar.cc/150?img=7' },
    { id: 'user63', username: 'Đặng Thanh', avatarUrl: 'https://i.pravatar.cc/150?img=8' },
    { id: 'user73', username: 'Bùi Vy', avatarUrl: 'https://i.pravatar.cc/150?img=9' },
    { id: 'user83', username: 'Võ Thương', avatarUrl: 'https://i.pravatar.cc/150?img=10' },
  ];

  const mediaTypes = ['image', 'video'] as const;
  const emojis = ['❤️', '😍', '😂', '😮', '😢', '🙏', '🔥', '👍', '👏', '🎉'];
  
  return users.flatMap((user) => {
    // Generate 1-5 stories per user
    const storyCount = Math.floor(Math.random() * 5) + 1;
    
    return Array.from({ length: storyCount }, (_, index) => {
      const createdAt = new Date();
      createdAt.setHours(createdAt.getHours() - Math.floor(Math.random() * 24));
      
      const expiresAt = new Date(createdAt);
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      const type = mediaTypes[Math.floor(Math.random() * mediaTypes.length)];
      const mediaUrl = type === 'image' 
        ? `/stories/${user.id}_${index}.jpg` 
        : `/stories/${user.id}_${index}.mp4`;
      
      // Generate random reactions
      const reactions = Math.random() > 0.7 
        ? Array.from({ length: Math.floor(Math.random() * 8) }, () => ({
            userId: users[Math.floor(Math.random() * users.length)].id,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)),
          }))
        : [];
      
      // Generate random replies
      const replies = Math.random() > 0.8
        ? Array.from({ length: Math.floor(Math.random() * 5) }, () => {
            const replyUser = users[Math.floor(Math.random() * users.length)];
            return {
              userId: replyUser.id,
              username: replyUser.username,
              avatarUrl: replyUser.avatarUrl,
              content: 'This is amazing! 🔥',
              timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)),
            };
          })
        : [];
      
      // Generate random viewers
      const viewers = Array.from({ length: Math.floor(Math.random() * 15) }, () => {
        const viewer = users[Math.floor(Math.random() * users.length)];
        return {
          userId: viewer.id,
          username: viewer.username,
          avatarUrl: viewer.avatarUrl,
          viewedAt: new Date(Date.now() - Math.floor(Math.random() * 3600000)),
        };
      });
      
      return {
        id: `${user.id}_story_${index}`,
        userId: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        mediaUrl,
        type,
        createdAt,
        expiresAt,
        hasViewed: Math.random() > 0.5,
        reactions,
        replies,
        viewers,
        isHighlighted: Math.random() > 0.8,
        isTrending: Math.random() > 0.9,
        isCloseFriend: Math.random() > 0.7,
      };
    });
  });
};

// Group stories by user
export const groupStoriesByUser = (stories: StoryItem[]): StoryGroup[] => {
  const userMap = new Map<string, StoryGroup>();
  
  stories.forEach(story => {
    if (!userMap.has(story.userId)) {
      userMap.set(story.userId, {
        userId: story.userId,
        username: story.username,
        avatarUrl: story.avatarUrl,
        stories: [],
        isHighlighted: story.isHighlighted,
        isTrending: story.isTrending,
        isCloseFriend: story.isCloseFriend,
      });
    }
    
    const userGroup = userMap.get(story.userId)!;
    userGroup.stories.push(story);
  });
  
  // Sort stories by creation date (newest first)
  userMap.forEach(group => {
    group.stories.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  });
  
  return Array.from(userMap.values());
};

// Filter out expired stories
export const filterExpiredStories = (stories: StoryItem[]): StoryItem[] => {
  const now = new Date();
  return stories.filter(story => story.expiresAt > now);
};

// Get mock story groups
export const getMockStoryGroups = (): StoryGroup[] => {
  const mockStories = generateMockStories();
  const validStories = filterExpiredStories(mockStories);
  return groupStoriesByUser(validStories);
}; 