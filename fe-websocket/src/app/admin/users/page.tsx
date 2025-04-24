'use client';

import React, { useState } from 'react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import UserTable from '@/app/admin/users/components/UserTable';
import UserEditModal from '@/app/admin/users/components/UserEditModal';
import UserDeleteModal from '@/app/admin/users/components/UserDeleteModal';
import UserDetailModal from '@/app/admin/users/components/UserDetailModal';
import { Search, RefreshCw, Plus, Filter } from 'lucide-react';
import Pagination from "@/app/admin/users/components/pagination";
import { Button, Input, Select, Text, Card, Group, Stack, Paper } from "@mantine/core";
import { User } from '@/services/adminService';

const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const {
    users,
    loading,
    error,
    pagination,
    selectedUser,
    isEditModalOpen,
    isDeleteModalOpen,
    isDetailModalOpen,
    updateUser,
    toggleUserBan,
    deleteUser,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openDetailModal,
    closeDetailModal
  } = useAdminUsers({ initialPage: page, initialLimit: limit });

  // Filter users based on search term and status
  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && !user.isBanned) ||
      (statusFilter === 'banned' && user.isBanned);
    
    return matchesSearch && matchesStatus;
  });

  // Handle limit change
  const handleLimitChange = (value: string | null) => {
    if (value) {
      const newLimit = parseInt(value);
      setLimit(newLimit);
      setPage(1);
    }
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle toggle ban
  const handleToggleBan = async (user: User, ban: boolean) => {
    await toggleUserBan(user.id, ban);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="xl">
            {/* Header Section */}
            <Group justify="space-between" align="center">
              <div>
                <Text fz="xl" fw={700}>User Management</Text>
                <Text fz="sm" c="dimmed" mt={4}>
                  Manage and monitor user accounts
                </Text>
              </div>
              <Group>
                <Button 
                  variant="light" 
                  leftSection={<RefreshCw size={16} />}
                  onClick={() => setPage(1)}
                  disabled={loading}
                >
                  Refresh
                </Button>
                <Button 
                  variant="filled" 
                  leftSection={<Plus size={16} />}
                  onClick={() => {/* Add new user functionality */}}
                >
                  Add User
                </Button>
              </Group>
            </Group>

            {/* Stats Section */}
            <Group grow>
              <Paper p="md" radius="md" withBorder>
                <Text fz="sm" c="dimmed">Total Users</Text>
                <Text fz="xl" fw={700}>{pagination.total}</Text>
              </Paper>
              <Paper p="md" radius="md" withBorder>
                <Text fz="sm" c="dimmed">Active Users</Text>
                <Text fz="xl" fw={700} c="green">
                  {users.filter(u => !u.isBanned).length}
                </Text>
              </Paper>
              <Paper p="md" radius="md" withBorder>
                <Text fz="sm" c="dimmed">Banned Users</Text>
                <Text fz="xl" fw={700} c="red">
                  {users.filter(u => u.isBanned).length}
                </Text>
              </Paper>
            </Group>

            {/* Filters Section */}
            <Group justify="space-between">
              <Group>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <Select
                  placeholder="Status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  data={[
                    { value: 'active', label: 'Active' },
                    { value: 'banned', label: 'Banned' }
                  ]}
                  clearable
                  leftSection={<Filter size={14} />}
                />
              </Group>
              <Group>
                <Text fz="sm" c="dimmed">Show:</Text>
                <Select
                  value={limit.toString()}
                  onChange={handleLimitChange}
                  data={[
                    { value: '5', label: '5' },
                    { value: '10', label: '10' },
                    { value: '20', label: '20' },
                    { value: '50', label: '50' }
                  ]}
                  style={{ width: '80px' }}
                />
                <Text fz="sm" c="dimmed">per page</Text>
              </Group>
            </Group>

            {/* Error Message */}
            {error && (
              <Paper p="md" radius="md" withBorder bg="red.0">
                <Text c="red">{error.message}</Text>
              </Paper>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <UserTable
                  users={filteredUsers}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                  onToggleBan={handleToggleBan}
                  onViewDetails={openDetailModal}
                />
                
                {pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </Stack>
        </Card>
      </div>

      {/* Modals */}
      <UserEditModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={updateUser}
      />

      <UserDeleteModal
        user={selectedUser}
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={deleteUser}
      />

      <UserDetailModal
        user={selectedUser}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
      />
    </div>
  );
};

export default AdminUsersPage;