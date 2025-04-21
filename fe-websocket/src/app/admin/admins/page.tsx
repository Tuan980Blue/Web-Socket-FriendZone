'use client'

import React from 'react';
import {
  Button,
  TextInput,
  Select,
  Table,
  Group,
  ActionIcon,
  Avatar,
  Badge,
  Stack,
  Title,
  Paper,
} from '@mantine/core';
import { IconPlus, IconSearch, IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import { useState } from 'react';
import AddAdminModal from './components/AddAdminModal';
import { Admin, RoleOption, StatusOption } from './types';

// Mock data for demonstration
const mockAdmins: Admin[] = [
  {
    id: 1,
    name: 'admin1',
    email: 'admin1@abc.com',
    role: 'Super Admin',
    avatar: '🧑‍💼',
    createdAt: '01/01/2024',
    status: 'Active',
  },
  // Add more mock data as needed
];

const roleOptions: RoleOption[] = [
  { value: 'Super Admin', label: '🔑 Super Admin', description: 'Toàn quyền, chỉnh sửa tất cả admin' },
  { value: 'Viewer', label: '👀 Viewer', description: 'Chỉ xem báo cáo và dữ liệu' },
  { value: 'Content Manager', label: '✍️ Content Manager', description: 'Quản lý bài viết, bình luận' },
  { value: 'User Moderator', label: '👥 User Moderator', description: 'Quản lý người dùng, xử lý vi phạm' },
];

const statusOptions: StatusOption[] = [
  { value: 'Active', label: 'Hoạt động' },
  { value: 'Inactive', label: 'Bị vô hiệu hóa' },
];

const AdminPage = () => {
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const handleDeleteAdmin = (admin: Admin) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa admin ${admin.name}?`)) {
      // Handle delete logic here
      console.log('Deleting admin:', admin);
    }
  };

  return (
    <Stack p="md">
      <Group justify="space-between">
        <Title order={2}>Quản lý Admin</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setIsAddModalVisible(true)}
        >
          Thêm Admin
        </Button>
      </Group>

      <Group>
        <TextInput
          placeholder="Tìm kiếm theo tên hoặc email"
          leftSection={<IconSearch size={16} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Lọc theo vai trò"
          value={roleFilter}
          onChange={(value) => setRoleFilter(value || '')}
          data={roleOptions}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          value={statusFilter}
          onChange={(value) => setStatusFilter(value || '')}
          data={statusOptions}
          style={{ width: 200 }}
        />
      </Group>

      <Paper shadow="xs" p="md">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Avatar</Table.Th>
              <Table.Th>Tên</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Vai trò</Table.Th>
              <Table.Th>Ngày tạo</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
              <Table.Th>Hành động</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {mockAdmins.map((admin) => (
              <Table.Tr key={admin.id}>
                <Table.Td>
                  <Avatar>{admin.avatar}</Avatar>
                </Table.Td>
                <Table.Td>{admin.name}</Table.Td>
                <Table.Td>{admin.email}</Table.Td>
                <Table.Td>
                  <Badge color="blue">
                    {roleOptions.find(r => r.value === admin.role)?.label}
                  </Badge>
                </Table.Td>
                <Table.Td>{admin.createdAt}</Table.Td>
                <Table.Td>
                  <Badge color={admin.status === 'Active' ? 'green' : 'red'}>
                    {admin.status === 'Active' ? 'Hoạt động' : 'Bị vô hiệu hóa'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="yellow"
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDeleteAdmin(admin)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <AddAdminModal
        open={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        roleOptions={roleOptions}
      />

    </Stack>
  );
};

export default AdminPage;