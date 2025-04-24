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
  IconUserCheck,
  IconEye
} from '@tabler/icons-react';
import { format } from 'date-fns';

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
  const rows = users.map((user) => (
    <tr key={user.id}>
      <td>
        <Group spacing="sm">
          <Avatar size={40} src={user.avatar} radius={40} />
          <div>
            <Text fz="sm" fw={500}>
              {user.fullName || user.username}
            </Text>
            <Text fz="xs" c="dimmed">
              {user.email}
            </Text>
          </div>
        </Group>
      </td>
      <td>
        <Badge color={user.isBanned ? "red" : "green"}>
          {user.isBanned ? "Banned" : "Active"}
        </Badge>
      </td>
      <td>
        <Text fz="sm">{format(new Date(user.createdAt), 'PPP')}</Text>
      </td>
      <td>
        <Group spacing={0} position="right">
          <ActionIcon onClick={() => onViewDetails(user)}>
            <IconEye size="1rem" stroke={1.5} />
          </ActionIcon>
          <Menu transition="pop" withArrow position="bottom-end">
            <Menu.Target>
              <ActionIcon>
                <IconDots size="1rem" stroke={1.5} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                icon={<IconEdit size="1rem" stroke={1.5} />}
                onClick={() => onEdit(user)}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                icon={user.isBanned ? <IconUserCheck size="1rem" stroke={1.5} /> : <IconBan size="1rem" stroke={1.5} />}
                onClick={() => onToggleBan(user, !user.isBanned)}
              >
                {user.isBanned ? 'Unban' : 'Ban'}
              </Menu.Item>
              <Menu.Item
                icon={<IconTrash size="1rem" stroke={1.5} />}
                color="red"
                onClick={() => onDelete(user)}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </td>
    </tr>
  ));

  return (
    <Table verticalSpacing="sm">
      <thead>
        <tr>
          <th>User</th>
          <th>Status</th>
          <th>Created At</th>
          <th />
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default UserTable; 