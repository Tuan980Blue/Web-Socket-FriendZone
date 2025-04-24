import React from 'react';
import { User } from '@/services/adminService';
import { 
  Table, 
  Group, 
  Text, 
  Avatar, 
  Badge, 
  ActionIcon, 
  Menu, 
  rem 
} from '@mantine/core';
import { 
  IconDots, 
  IconEdit, 
  IconTrash, 
  IconBan, 
  IconUserCheck 
} from '@tabler/icons-react';
import { format } from 'date-fns';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleBan: (user: User, ban: boolean) => void;
}

const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  onEdit, 
  onDelete, 
  onToggleBan 
}) => {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>User</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Role</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Joined</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {users.map((user) => (
          <Table.Tr key={user.id}>
            <Table.Td>
              <Group gap="sm">
                <Avatar 
                  src={user.avatar} 
                  alt={user.username}
                  radius="xl"
                  size="md"
                >
                  {user.username.substring(0, 2).toUpperCase()}
                </Avatar>
                <div>
                  <Text fw={500}>{user.username}</Text>
                  <Text size="sm" c="dimmed">{user.fullName}</Text>
                </div>
              </Group>
            </Table.Td>
            <Table.Td>{user.email}</Table.Td>
            <Table.Td>
              <Badge 
                color={user.role === 'admin' ? 'red' : 'blue'}
                variant="light"
              >
                {user.role}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Badge 
                color={user.isBanned ? 'red' : 'green'}
                variant="light"
              >
                {user.isBanned ? 'Banned' : 'Active'}
              </Badge>
            </Table.Td>
            <Table.Td>
              {format(new Date(user.createdAt), 'MMM d, yyyy')}
            </Table.Td>
            <Table.Td>
              <Menu position="bottom-end" withinPortal>
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <IconDots style={{ width: rem(16), height: rem(16) }} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item 
                    leftSection={<IconEdit style={{ width: rem(16), height: rem(16) }} />}
                    onClick={() => onEdit(user)}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item 
                    leftSection={
                      user.isBanned 
                        ? <IconUserCheck style={{ width: rem(16), height: rem(16) }} color="green" />
                        : <IconBan style={{ width: rem(16), height: rem(16) }} color="red" />
                    }
                    color={user.isBanned ? 'green' : 'red'}
                    onClick={() => onToggleBan(user, !user.isBanned)}
                  >
                    {user.isBanned ? 'Unban' : 'Ban'}
                  </Menu.Item>
                  <Menu.Item 
                    leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} color="red" />}
                    color="red"
                    onClick={() => onDelete(user)}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

export default UserTable; 