import React, { useState, useEffect, useRef } from 'react';
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
  Grid,
  Paper,
  Title,
  Tabs,
  Avatar,
  Divider,
  Text
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { 
  IconUser, 
  IconMail, 
  IconPhone, 
  IconMapPin, 
  IconGenderMale, 
  IconCalendar, 
  IconWorld, 
  IconLock, 
  IconShield 
} from '@tabler/icons-react';

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
  const previousUserRef = useRef<User | null>(null);
  
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
    if (user && user.id !== previousUserRef.current?.id) {
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
      previousUserRef.current = user;
    }
  }, [user, form]);

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
      title={
        <Group gap="sm">
          <Avatar src={user.avatar} size="md" radius="xl" />
          <div>
            <Title order={3}>Edit User</Title>
            <Text size="sm" c="dimmed">@{user.username}</Text>
          </div>
        </Group>
      }
      size="lg"
      radius="md"
    >
      <Tabs defaultValue="profile">
        <Tabs.List>
          <Tabs.Tab value="profile" leftSection={<IconUser size={14} />}>
            Profile
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconShield size={14} />}>
            Security
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile" pt="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <Paper p="md" withBorder>
                <Title order={4} mb="md">Basic Information</Title>
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Username"
                      placeholder="Enter username"
                      required
                      leftSection={<IconUser size={16} />}
                      {...form.getInputProps('username')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Email"
                      placeholder="Enter email"
                      required
                      leftSection={<IconMail size={16} />}
                      {...form.getInputProps('email')}
                    />
                  </Grid.Col>
                </Grid>
                
                <TextInput
                  label="Full Name"
                  placeholder="Enter full name"
                  leftSection={<IconUser size={16} />}
                  {...form.getInputProps('fullName')}
                />
                
                <Textarea
                  label="Bio"
                  placeholder="Enter bio"
                  minRows={3}
                  {...form.getInputProps('bio')}
                />
              </Paper>

              <Paper p="md" withBorder>
                <Title order={4} mb="md">Contact Information</Title>
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Website"
                      placeholder="Enter website"
                      leftSection={<IconWorld size={16} />}
                      {...form.getInputProps('website')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Location"
                      placeholder="Enter location"
                      leftSection={<IconMapPin size={16} />}
                      {...form.getInputProps('location')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Phone Number"
                      placeholder="Enter phone number"
                      leftSection={<IconPhone size={16} />}
                      {...form.getInputProps('phoneNumber')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                      label="Gender"
                      placeholder="Select gender"
                      leftSection={<IconGenderMale size={16} />}
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
                  leftSection={<IconCalendar size={16} />}
                  {...form.getInputProps('birthDate')}
                />
              </Paper>
            </Stack>
          </form>
        </Tabs.Panel>

        <Tabs.Panel value="security" pt="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <Paper p="md" withBorder>
                <Title order={4} mb="md">Account Settings</Title>
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                      label="Role"
                      placeholder="Select role"
                      leftSection={<IconShield size={16} />}
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
                      <IconLock size={16} style={{ marginLeft: 8 }} />
                    </Group>
                  </Grid.Col>
                </Grid>
              </Paper>
            </Stack>
          </form>
        </Tabs.Panel>
      </Tabs>

      <Divider my="md" />

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          loading={loading}
          onClick={() => form.onSubmit(handleSubmit)()}
        >
          Save Changes
        </Button>
      </Group>
    </Modal>
  );
};

export default UserEditModal; 