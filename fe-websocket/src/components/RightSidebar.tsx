import { Avatar, Button, Text, ScrollArea, Divider } from '@mantine/core';
import { Bell, TrendingUp, UserPlus } from 'lucide-react';

// Mock data - Replace with real data from your backend
const suggestedUsers = [
  { id: 1, name: 'John Doe', username: 'johndoe', avatar: '' },
  { id: 2, name: 'Jane Smith', username: 'janesmith', avatar: '' },
  { id: 3, name: 'Mike Johnson', username: 'mikejohnson', avatar: '' },
];

const trendingHashtags = [
  { id: 1, name: 'LậpTrình', count: 1234 },
  { id: 2, name: 'ChụpHình', count: 890 },
  { id: 3, name: 'TràSữa', count: 567 },
  { id: 4, name: 'DuLịch', count: 432 },
  { id: 5, name: 'ẨmThực', count: 321 },
];

const birthdays = [
  { id: 1, name: 'Alice Brown', avatar: '' },
  { id: 2, name: 'Bob Wilson', avatar: '' },
];

const systemNotifications = [
  { id: 1, message: '🎉 Chào mừng bạn đến với FriendZone!', type: 'welcome' },
  { id: 2, message: '📢 Khuyến mãi đặc biệt: Mời bạn bè nhận quà!', type: 'promotion' },
];

export default function RightSidebar() {
  return (
    <div className="fixed hidden lg:block right-0 top-16 w-80 h-[calc(100vh-4rem)] bg-[#FAFAFA] dark:bg-[#121212] border-l border-[#DBDBDB] dark:border-[#262626] p-4 overflow-y-auto">
      {/* Suggested Users Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Text fw={600} size="sm" c="dimmed">Gợi ý theo dõi</Text>
          <Button variant="subtle" size="xs" color="instagram.4">Xem tất cả</Button>
        </div>
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar src={user.avatar || undefined} radius="xl" size="md" />
                <div>
                  <Text size="sm" fw={500}>{user.username}</Text>
                  <Text size="xs" c="dimmed">{user.name}</Text>
                </div>
              </div>
              <Button size="xs" variant="subtle" color="instagram.4" leftSection={<UserPlus size={14} />}>
                Theo dõi
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Divider my="md" color="#DBDBDB" />

      {/* Trending Hashtags Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Text fw={600} size="sm" c="dimmed">Trend / Hashtag hot</Text>
          <Button variant="subtle" size="xs" color="instagram.4">Xem tất cả</Button>
        </div>
        <ScrollArea h={200}>
          <div className="space-y-3">
            {trendingHashtags.map((hashtag) => (
              <div key={hashtag.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#DD2A7B]" />
                  <Text size="sm">#{hashtag.name}</Text>
                </div>
                <Text size="xs" c="dimmed">{hashtag.count} bài viết</Text>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Birthdays Section */}
      {birthdays.length > 0 && (
        <>
          <Divider my="md" color="#DBDBDB" />
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <Text fw={600} size="sm" c="dimmed">Sinh nhật hôm nay</Text>
            </div>
            <div className="space-y-3">
              {birthdays.map((friend) => (
                <div key={friend.id} className="flex items-center gap-3">
                  <Avatar src={friend.avatar || undefined}
                          radius="xl" size="md" />
                  <div>
                    <Text size="sm" fw={500}>{friend.name}</Text>
                    <Text size="xs" c="dimmed">Sinh nhật hôm nay</Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* System Notifications Section */}
      {systemNotifications.length > 0 && (
        <>
          <Divider my="md" color="#DBDBDB" />
          <div>
            <div className="flex justify-between items-center mb-4">
              <Text fw={600} size="sm" c="dimmed">Thông báo hệ thống</Text>
            </div>
            <div className="space-y-3">
              {systemNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-2">
                  <Bell size={16} className="mt-1 text-[#ED4956]" />
                  <Text size="sm">{notification.message}</Text>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 