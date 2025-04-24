'use client';

import React, { useState } from 'react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import UserTable from '@/app/admin/users/components/UserTable';
import UserEditModal from '@/app/admin/users/components/UserEditModal';
import UserDeleteModal from '@/app/admin/users/components/UserDeleteModal';
import { Search, RefreshCw } from 'lucide-react';
import Pagination from "@/app/admin/users/components/pagination";
import { Button, Input, Select, Text } from "@mantine/core";
import { User } from '@/services/adminService';

const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(10);
  
  const {
    users,
    loading,
    error,
    pagination,
    selectedUser,
    isEditModalOpen,
    isDeleteModalOpen,
    fetchUsers,
    updateUser,
    toggleUserBan,
    deleteUser,
    changePage,
    changeLimit,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal
  } = useAdminUsers({ initialLimit: limit });

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle limit change
  const handleLimitChange = (value: string | null) => {
    if (value) {
      const newLimit = parseInt(value);
      setLimit(newLimit);
      changeLimit(newLimit);
    }
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchUsers(pagination.page, limit);
  };

  // Handle toggle ban
  const handleToggleBan = (user: User, ban: boolean) => {
    toggleUserBan(user.id, ban);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Text size="sm" c="dimmed">Show:</Text>
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
          <Text size="sm" c="dimmed">per page</Text>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <UserTable
            users={filteredUsers}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
            onToggleBan={handleToggleBan}
          />
          
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={changePage}
            />
          )}
        </>
      )}

      {/* Edit Modal */}
      <UserEditModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={updateUser}
      />

      {/* Delete Modal */}
      <UserDeleteModal
        user={selectedUser}
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={deleteUser}
      />
    </div>
  );
};

export default AdminUsersPage;