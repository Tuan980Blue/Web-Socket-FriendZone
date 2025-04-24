import React, { useState } from 'react';
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
  Divider,
  Paper,
  Box,
  Tabs,
  ThemeIcon,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import { format, isValid } from 'date-fns';
import { 
  IconUser, 
  IconMail, 
  IconPhone, 
  IconMapPin, 
  IconGenderMale, 
  IconCalendar, 
  IconWorld, 
  IconUsers, 
  IconPhoto, 
  IconClock, 
  IconCircleCheck, 
  IconCircleX,
  IconShield,
  IconCopy
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "Not provided";
  const date = new Date(dateString);
  return isValid(date) ? format(date, 'dd/MM/yyyy') : "Invalid date";
};

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, isOpen, onClose }) => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    notifications.show({
      title: 'Success',
      message: 'Email copied to clipboard',
      color: 'green',
    });
    setTimeout(() => setCopiedEmail(null), 2000);
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
            <Title order={3}>{user.fullName || user.username}</Title>
            <Text size="sm" c="dimmed">@{user.username}</Text>
          </div>
        </Group>
      }
      size="lg"
      centered
      radius="md"
    >
      <Tabs defaultValue="profile">
        <Tabs.List>
          <Tabs.Tab value="profile" leftSection={<IconUser size={14} />}>
            Profile
          </Tabs.Tab>
          <Tabs.Tab value="activity" leftSection={<IconClock size={14} />}>
            Activity
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile" pt="md">
          <Stack gap="md">
            {/* Status Badges */}
            <Group>
              <Badge 
                size="lg" 
                color={user.isBanned ? "red" : "green"}
                variant="light"
                leftSection={
                  <ThemeIcon size="xs" color={user.isBanned ? "red" : "green"} variant="transparent">
                    {user.isBanned ? <IconCircleX size={12} /> : <IconCircleCheck size={12} />}
                  </ThemeIcon>
                }
              >
                {user.isBanned ? "Banned" : "Active"}
              </Badge>
              <Badge 
                size="lg" 
                color="blue"
                variant="light"
                leftSection={
                  <ThemeIcon size="xs" color="blue" variant="transparent">
                    <IconShield size={12} />
                  </ThemeIcon>
                }
              >
                {user.role}
              </Badge>
            </Group>

            <Divider />

            {/* Contact Information */}
            <Paper p="md" withBorder>
              <Title order={4} mb="md">Contact Information</Title>
              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Group gap="sm" mb="sm">
                    <ThemeIcon size="lg" variant="light" color="blue">
                      <IconMail size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" c="dimmed">Email</Text>
                      <Group gap={4}>
                        <Text>{user.email}</Text>
                        <Tooltip 
                          label={copiedEmail === user.email ? "Copied!" : "Copy email"}
                          color={copiedEmail === user.email ? "green" : "gray"}
                        >
                          <ActionIcon 
                            variant="subtle" 
                            color={copiedEmail === user.email ? "green" : "gray"} 
                            size="sm"
                            onClick={() => handleCopyEmail(user.email)}
                          >
                            <IconCopy size={14} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Box>
                  </Group>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Group gap="sm" mb="sm">
                    <ThemeIcon size="lg" variant="light" color="blue">
                      <IconPhone size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" c="dimmed">Phone</Text>
                      <Text>{user.phoneNumber || "Not provided"}</Text>
                    </Box>
                  </Group>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Group gap="sm" mb="sm">
                    <ThemeIcon size="lg" variant="light" color="blue">
                      <IconMapPin size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" c="dimmed">Location</Text>
                      <Text>{user.location || "Not provided"}</Text>
                    </Box>
                  </Group>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Group gap="sm" mb="sm">
                    <ThemeIcon size="lg" variant="light" color="blue">
                      <IconGenderMale size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" c="dimmed">Gender</Text>
                      <Text>{user.gender || "Not provided"}</Text>
                    </Box>
                  </Group>
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Additional Information */}
            <Paper p="md" withBorder>
              <Title order={4} mb="md">Additional Information</Title>
              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Group gap="sm" mb="sm">
                    <ThemeIcon size="lg" variant="light" color="blue">
                      <IconCalendar size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" c="dimmed">Birth Date</Text>
                      <Text>{formatDate(user.birthDate)}</Text>
                    </Box>
                  </Group>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Group gap="sm" mb="sm">
                    <ThemeIcon size="lg" variant="light" color="blue">
                      <IconWorld size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" c="dimmed">Website</Text>
                      <Text>{user.website || "Not provided"}</Text>
                    </Box>
                  </Group>
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Stats */}
            <Paper p="md" withBorder>
              <Title order={4} mb="md">Statistics</Title>
              <Grid>
                <Grid.Col span={4}>
                  <Group gap="sm">
                    <ThemeIcon size="lg" variant="light" color="blue">
                      <IconUsers size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" c="dimmed">Followers</Text>
                      <Text fw={500}>{user.followersCount}</Text>
                    </Box>
                  </Group>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Group gap="sm">
                    <ThemeIcon size="lg" variant="light" color="blue">
                      <IconUsers size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" c="dimmed">Following</Text>
                      <Text fw={500}>{user.followingCount}</Text>
                    </Box>
                  </Group>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Group gap="sm">
                    <ThemeIcon size="lg" variant="light" color="blue">
                      <IconPhoto size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" c="dimmed">Posts</Text>
                      <Text fw={500}>{user.postsCount}</Text>
                    </Box>
                  </Group>
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Bio */}
            {user.bio && (
              <Paper p="md" withBorder>
                <Title order={4} mb="md">Bio</Title>
                <Text>{user.bio}</Text>
              </Paper>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="activity" pt="md">
          <Stack gap="md">
            <Paper p="md" withBorder>
              <Title order={4} mb="md">Account Activity</Title>
              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Group gap="sm" mb="sm">
                    <ThemeIcon size="lg" variant="light" color="blue">
                      <IconCalendar size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" c="dimmed">Created At</Text>
                      <Text>{formatDate(user.createdAt)}</Text>
                    </Box>
                  </Group>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Group gap="sm" mb="sm">
                    <ThemeIcon size="lg" variant="light" color="blue">
                      <IconClock size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" c="dimmed">Last Updated</Text>
                      <Text>{formatDate(user.updatedAt)}</Text>
                    </Box>
                  </Group>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Group gap="sm" mb="sm">
                    <ThemeIcon size="lg" variant="light" color="blue">
                      <IconClock size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" c="dimmed">Last Seen</Text>
                      <Text>{formatDate(user.lastSeen)}</Text>
                    </Box>
                  </Group>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Group gap="sm" mb="sm">
                    <ThemeIcon size="lg" variant="light" color="blue">
                      <IconCircleCheck size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" c="dimmed">Status</Text>
                      <Text>{user.status || "Offline"}</Text>
                    </Box>
                  </Group>
                </Grid.Col>
              </Grid>
            </Paper>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
};

export default UserDetailModal; 