import React from 'react';
import { User } from '@/services/adminService';
import { 
  Modal, 
  Text, 
  Group, 
  Stack,
  Title,
  Avatar,
  Badge,
  Grid,
  Divider
} from '@mantine/core';
import { format, isValid } from 'date-fns';

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "Not provided";
  const date = new Date(dateString);
  return isValid(date) ? format(date, 'PPP') : "Invalid date";
};

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, isOpen, onClose }) => {
  if (!user) return null;

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="User Details"
      size="lg"
      centered
    >
      <Stack gap="md">
        <Group justify="space-between">
          <Group>
            <Avatar src={user.avatar} size="lg" radius="xl" />
            <div>
              <Title order={3}>{user.fullName || user.username}</Title>
              <Text size="sm" c="dimmed">@{user.username}</Text>
            </div>
          </Group>
          <Group>
            <Badge color={user.isBanned ? "red" : "green"}>
              {user.isBanned ? "Banned" : "Active"}
            </Badge>
            <Badge color="blue">{user.role}</Badge>
          </Group>
        </Group>

        <Divider />

        <Grid>
          <Grid.Col span={6}>
            <Text size="sm" c="dimmed">Email</Text>
            <Text>{user.email}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" c="dimmed">Phone</Text>
            <Text>{user.phoneNumber || "Not provided"}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" c="dimmed">Location</Text>
            <Text>{user.location || "Not provided"}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" c="dimmed">Gender</Text>
            <Text>{user.gender || "Not provided"}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" c="dimmed">Birth Date</Text>
            <Text>{formatDate(user.birthDate)}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" c="dimmed">Website</Text>
            <Text>{user.website || "Not provided"}</Text>
          </Grid.Col>
        </Grid>

        <Divider />

        <Grid>
          <Grid.Col span={4}>
            <Text size="sm" c="dimmed">Followers</Text>
            <Text>{user.followersCount}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Text size="sm" c="dimmed">Following</Text>
            <Text>{user.followingCount}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Text size="sm" c="dimmed">Posts</Text>
            <Text>{user.postsCount}</Text>
          </Grid.Col>
        </Grid>

        <Divider />

        <Stack gap="xs">
          <Text size="sm" c="dimmed">Bio</Text>
          <Text>{user.bio || "No bio provided"}</Text>
        </Stack>

        <Divider />

        <Grid>
          <Grid.Col span={6}>
            <Text size="sm" c="dimmed">Created At</Text>
            <Text>{formatDate(user.createdAt)}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" c="dimmed">Last Updated</Text>
            <Text>{formatDate(user.updatedAt)}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" c="dimmed">Last Seen</Text>
            <Text>{formatDate(user.lastSeen)}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" c="dimmed">Status</Text>
            <Text>{user.status || "Offline"}</Text>
          </Grid.Col>
        </Grid>
      </Stack>
    </Modal>
  );
};

export default UserDetailModal; 