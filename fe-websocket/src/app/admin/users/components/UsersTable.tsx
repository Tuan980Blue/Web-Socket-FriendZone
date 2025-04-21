import { useState } from 'react';
import {
  Table,
  Text,
  ActionIcon,
  Menu,
  Badge,
  Group,
  TextInput,
  Button,
} from '@mantine/core';
import { IconDots, IconSearch, IconUserPlus, IconMail, IconBan } from '@tabler/icons-react';

// Mock data
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
    joinedAt: '2024-03-15',
    lastActive: '2024-03-20',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-03-14',
    lastActive: '2024-03-19',
  },
];

export function UsersTable() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Text fw={700} size="xl">
          Users Management
        </Text>
        <Button>
          <IconUserPlus size={16} style={{ marginRight: 8 }} />
          Add User
        </Button>
      </Group>

      <TextInput
        placeholder="Search users..."
        leftSection={<IconSearch size={16} />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
        mb="md"
      />

      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Last Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Badge
                  color={user.role === 'admin' ? 'violet' : 'blue'}
                  variant="light"
                >
                  {user.role}
                </Badge>
              </td>
              <td>
                <Badge
                  color={user.status === 'active' ? 'green' : 'red'}
                  variant="light"
                >
                  {user.status}
                </Badge>
              </td>
              <td>{user.joinedAt}</td>
              <td>{user.lastActive}</td>
              <td>
                <Menu position="bottom-end" withinPortal>
                  <Menu.Target>
                    <ActionIcon>
                      <IconDots size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item>
                      <IconMail size={16} style={{ marginRight: 8 }} />
                      Send Message
                    </Menu.Item>
                    <Menu.Item color="red">
                      <IconBan size={16} style={{ marginRight: 8 }} />
                      Ban User
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
} 