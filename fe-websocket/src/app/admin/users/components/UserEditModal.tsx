import React, { useState, useEffect } from 'react';
import { User } from '@/services/adminService';
import { 
  Modal, 
  TextInput, 
  Textarea, 
  Select, 
  Switch, 
  Button, 
  Group, 
  Stack, 
  Grid
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

interface UserEditModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, userData: Partial<User>) => Promise<User | null>;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ 
  user, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [loading, setLoading] = useState(false);
  
  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      fullName: '',
      bio: '',
      website: '',
      location: '',
      phoneNumber: '',
      gender: '',
      birthDate: '',
      isPrivate: false,
      role: 'user',
      isBanned: false
    },
    validate: {
      username: (value) => (!value ? 'Username is required' : null),
      email: (value) => (!value ? 'Email is required' : /^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  useEffect(() => {
    if (user) {
      form.setValues({
        username: user.username || '',
        email: user.email || '',
        fullName: user.fullName || '',
        bio: user.bio || '',
        website: user.website || '',
        location: user.location || '',
        phoneNumber: user.phoneNumber || '',
        gender: user.gender || '',
        birthDate: user.birthDate || '',
        isPrivate: user.isPrivate || false,
        role: user.role || 'user'
      });
    }
  }, [user]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const updatedUser = await onSave(user.id, values);
      if (updatedUser) {
        notifications.show({
          title: 'Success',
          message: 'User updated successfully',
          color: 'green',
        });
        onClose();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update user',
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
      title={`Edit User: ${user.username}`}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Username"
                placeholder="Enter username"
                required
                {...form.getInputProps('username')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Email"
                placeholder="Enter email"
                required
                {...form.getInputProps('email')}
              />
            </Grid.Col>
          </Grid>
          
          <TextInput
            label="Full Name"
            placeholder="Enter full name"
            {...form.getInputProps('fullName')}
          />
          
          <Textarea
            label="Bio"
            placeholder="Enter bio"
            {...form.getInputProps('bio')}
          />
          
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Website"
                placeholder="Enter website"
                {...form.getInputProps('website')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Location"
                placeholder="Enter location"
                {...form.getInputProps('location')}
              />
            </Grid.Col>
          </Grid>
          
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Phone Number"
                placeholder="Enter phone number"
                {...form.getInputProps('phoneNumber')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Select
                label="Gender"
                placeholder="Select gender"
                data={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
                {...form.getInputProps('gender')}
              />
            </Grid.Col>
          </Grid>
          
          <TextInput
            label="Birth Date"
            type="date"
            {...form.getInputProps('birthDate')}
          />
          
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Select
                label="Role"
                placeholder="Select role"
                data={[
                  { value: 'user', label: 'User' },
                  { value: 'admin', label: 'Admin' },
                ]}
                {...form.getInputProps('role')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Group mt={30}>
                <Switch
                  label="Private Account"
                  {...form.getInputProps('isPrivate', { type: 'checkbox' })}
                />
              </Group>
            </Grid.Col>
          </Grid>
        </Stack>
        
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default UserEditModal; 