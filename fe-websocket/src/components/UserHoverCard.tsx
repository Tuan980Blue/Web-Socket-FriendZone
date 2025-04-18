import { Avatar, HoverCard, Text, Group, Stack, useMantineTheme } from '@mantine/core';
import { User } from '@/types/user';
import { ReactNode } from 'react';
import { useMediaQuery } from '@mantine/hooks';

interface UserHoverCardProps {
  user: User | null;
  children?: ReactNode;
}

const UserHoverCard = ({ user, children }: UserHoverCardProps) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

  if (!user) return null;

  return (
    <HoverCard 
      width={320} 
      shadow="md" 
      withArrow 
      openDelay={200} 
      closeDelay={400}
      disabled={isMobile}
    >
      <HoverCard.Target>
        <div>
          {children || (
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
              <div className="relative rounded-full bg-[#FAFAFA] dark:bg-[#121212]">
                <Avatar
                  src={user?.avatar || '/image-person.png'}
                  alt={user?.username || "Profile"}
                  size="md"
                  radius="xl"
                />
              </div>
            </div>
          )}
        </div>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Group>
          <Avatar 
            src={user?.avatar || '/image-person.png'}
            alt={user?.username || "Profile"}
            size="lg"
            radius="xl"
          />
          <Stack gap={5}>
            <Text size="sm" fw={700} style={{ lineHeight: 1 }}>
              {user?.fullName || "User"}
            </Text>
            <Text size="xs" c="dimmed" style={{ lineHeight: 1 }}>
              @{user?.username || "username"}
            </Text>
          </Stack>
        </Group>

        <Text size="sm" mt="md">
          {user?.bio || "No bio available"}
        </Text>

        <Group mt="md" gap="xl">
          <Text size="sm" color={"blue"}>
            <b>{user?.followingCount || 0}</b> Following
          </Text>
          <Text size="sm" color={"pink"}>
            <b>{user?.followersCount || 0}</b> Followers
          </Text>
        </Group>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default UserHoverCard;