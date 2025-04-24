import React, { useState } from 'react';
import { User } from '@/services/adminService';
import { 
  Table, 
  Group, 
  Text, 
  Avatar, 
  Badge, 
  ActionIcon, 
  Menu,
  Tooltip,
  Box,
  ScrollArea,
  ThemeIcon
} from '@mantine/core';
import { 
  IconDots, 
  IconEdit, 
  IconTrash, 
  IconBan, 
  IconUserCheck,
  IconEye,
  IconMail,
  IconCalendar,
  IconUser,
  IconCircleCheck,
  IconCircleX,
  IconCopy
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { notifications } from '@mantine/notifications';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleBan: (user: User, ban: boolean) => void;
  onViewDetails: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  onEdit, 
  onDelete, 
  onToggleBan,
  onViewDetails 
}) => {
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

  const rows = users.map((user) => (
    <Table.Tr key={user.id} className="hover:bg-gray-50 transition-colors">
      <Table.Td>
        <Group gap="sm">
          <Avatar 
            src={user.avatar} 
            size={40} 
            radius={40}
            color={user.isBanned ? 'red' : 'blue'}
          >
            {user.fullName?.charAt(0) || user.username.charAt(0)}
          </Avatar>
          <Box>
            <Text fw={500} fz="sm">
              {user.fullName || user.username}
            </Text>
            <Group gap={4}>
              <IconUser size={12} />
              <Text fz="xs" c="dimmed">
                @{user.username}
              </Text>
            </Group>
          </Box>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap={4}>
          <IconMail size={12} />
          <Text fz="sm">{user.email}</Text>
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
      </Table.Td>
      <Table.Td>
        <Badge 
          color={user.isBanned ? "red" : "green"} 
          variant="light"
          size="sm"
          leftSection={
            <ThemeIcon size="xs" color={user.isBanned ? "red" : "green"} variant="transparent">
              {user.isBanned ? <IconCircleX size={12} /> : <IconCircleCheck size={12} />}
            </ThemeIcon>
          }
        >
          {user.isBanned ? "Banned" : "Active"}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap={4}>
          <IconCalendar size={12} />
          <Text fz="sm">{format(new Date(user.createdAt), 'dd/MM/yyyy')}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <Tooltip label="View Details">
            <ActionIcon 
              variant="subtle" 
              color="blue" 
              onClick={() => onViewDetails(user)}
            >
              <IconEye size="1rem" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Menu withArrow position="bottom-end">
            <Menu.Target>
              <Tooltip label="More">
              <ActionIcon variant="subtle" color="gray">
                <IconDots size="1rem" stroke={1.5} />
              </ActionIcon>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEdit size="1rem" stroke={1.5} />}
                onClick={() => onEdit(user)}
              >
                Edit User
              </Menu.Item>
              <Menu.Item
                leftSection={user.isBanned ? 
                  <IconUserCheck size="1rem" stroke={1.5} /> : 
                  <IconBan size="1rem" stroke={1.5} />
                }
                color={user.isBanned ? "green" : "red"}
                onClick={() => onToggleBan(user, !user.isBanned)}
              >
                {user.isBanned ? 'Unban User' : 'Ban User'}
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconTrash size="1rem" stroke={1.5} />}
                color="red"
                onClick={() => onDelete(user)}
              >
                Delete User
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Created At</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
};

export default UserTable; 