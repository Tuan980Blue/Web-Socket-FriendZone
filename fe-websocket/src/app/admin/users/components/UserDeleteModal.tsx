import React, { useState } from 'react';
import { User } from '@/services/adminService';
import { 
  Modal, 
  Text, 
  Button, 
  Group, 
  Stack,
  Title,
  Paper,
  Avatar,
  ThemeIcon,
  Alert,
  Divider
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconTrash, IconUser } from '@tabler/icons-react';

interface UserDeleteModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (userId: string) => Promise<boolean>;
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({ 
  user, 
  isOpen, 
  onClose, 
  onDelete 
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const success = await onDelete(user.id);
      if (success) {
        notifications.show({
          title: 'Success',
          message: 'User deleted successfully',
          color: 'green',
        });
        onClose();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete user',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal 
      opened={isOpen} 
      onClose={onClose} 
      title={
        <Group gap="sm">
          <ThemeIcon size="lg" color="red" variant="light">
            <IconTrash size={20} />
          </ThemeIcon>
          <Title order={3}>Delete User</Title>
        </Group>
      }
      size="md"
      radius="md"
    >
      <Stack gap="md">
        <Paper p="md" withBorder>
          <Group gap="sm" mb="md">
            <Avatar src={user.avatar} size="md" radius="xl" />
            <div>
              <Text fw={500}>{user.fullName || user.username}</Text>
              <Text size="sm" c="dimmed">@{user.username}</Text>
            </div>
          </Group>

          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Warning" 
            color="red" 
            variant="light"
            mb="md"
          >
            This action cannot be undone. All user data, including posts, comments, and other associated content will be permanently removed.
          </Alert>

          <Stack gap="xs">
            <Text size="sm" fw={500}>This will delete:</Text>
            <Group gap="xs">
              <ThemeIcon size="sm" color="red" variant="light">
                <IconUser size={12} />
              </ThemeIcon>
              <Text size="sm">User account and profile</Text>
            </Group>
            <Group gap="xs">
              <ThemeIcon size="sm" color="red" variant="light">
                <IconUser size={12} />
              </ThemeIcon>
              <Text size="sm">All user posts and comments</Text>
            </Group>
            <Group gap="xs">
              <ThemeIcon size="sm" color="red" variant="light">
                <IconUser size={12} />
              </ThemeIcon>
              <Text size="sm">User connections and relationships</Text>
            </Group>
          </Stack>
        </Paper>

        <Divider />

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            color="red" 
            onClick={handleDelete} 
            loading={loading}
            leftSection={<IconTrash size={16} />}
          >
            Delete User
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default UserDeleteModal; 