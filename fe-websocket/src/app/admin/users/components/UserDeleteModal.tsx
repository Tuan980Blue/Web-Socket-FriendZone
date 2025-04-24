import React, { useState } from 'react';
import { User } from '@/services/adminService';
import { 
  Modal, 
  Text, 
  Button, 
  Group, 
  Stack,
  Title
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

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
      title={<Title order={3}>Delete User</Title>}
      size="md"
    >
      <Stack>
        <Text>
          Are you sure you want to delete the user <strong>{user.username}</strong>?
          This action cannot be undone.
        </Text>
        
        <Text size="sm" c="dimmed">
          All user data, including posts, comments, and other associated content will be permanently removed.
        </Text>
        
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            color="red" 
            onClick={handleDelete} 
            loading={loading}
          >
            Delete User
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default UserDeleteModal; 