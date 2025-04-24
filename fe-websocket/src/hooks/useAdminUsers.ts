import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminService, { User } from '@/services/adminService';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';

interface UseAdminUsersProps {
  initialPage?: number;
  initialLimit?: number;
}

export const useAdminUsers = ({ initialPage = 1, initialLimit = 10 }: UseAdminUsersProps = {}) => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Fetch users with pagination
  const { data: usersData, isLoading: isUsersLoading, error: usersError } = useQuery({
    queryKey: ['users', initialPage, initialLimit],
    queryFn: () => adminService.getAllUsers(initialPage, initialLimit),
    staleTime: 30000 // Cache for 30 seconds
  });

  // Fetch a single user by ID
  const { data: userDetail, isLoading: isUserDetailLoading } = useQuery({
    queryKey: ['user', selectedUser?.id],
    queryFn: () => selectedUser ? adminService.getUserById(selectedUser.id) : null,
    enabled: !!selectedUser && isDetailModalOpen
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: Partial<User> }) => 
      adminService.updateUserInfo(userId, userData),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (selectedUser?.id === updatedUser.id) {
        setSelectedUser(updatedUser);
      }
      toast.success('User updated successfully');
      closeEditModal();
      return updatedUser;
    },
    onError: (error: AxiosError) => {
      toast.error('Failed to update user');
      console.error('Error updating user:', error.message);
      return null;
    }
  });

  // Toggle user ban mutation
  const toggleBanMutation = useMutation({
    mutationFn: ({ userId, ban }: { userId: string; ban: boolean }) => 
      adminService.toggleUserBan(userId, ban),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (selectedUser?.id === updatedUser.id) {
        setSelectedUser(updatedUser);
      }
      toast.success(`User ${updatedUser.isBanned ? 'banned' : 'unbanned'} successfully`);
      return updatedUser;
    },
    onError: (error: AxiosError) => {
      toast.error('Failed to toggle user ban status');
      console.error('Error toggling user ban:', error.message);
      return null;
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
      toast.success('User deleted successfully');
      closeDeleteModal();
      return true;
    },
    onError: (error: AxiosError) => {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', error.message);
      return false;
    }
  });

  // Open edit modal
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  // Open delete modal
  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  // Open detail modal
  const openDetailModal = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  // Close detail modal
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
  };

  return {
    users: usersData?.users || [],
    pagination: usersData?.pagination || { page: initialPage, limit: initialLimit, total: 0, totalPages: 0 },
    loading: isUsersLoading || isUserDetailLoading,
    error: usersError,
    selectedUser: userDetail || selectedUser,
    isEditModalOpen,
    isDeleteModalOpen,
    isDetailModalOpen,
    updateUser: async (userId: string, userData: Partial<User>) => {
      const result = await updateUserMutation.mutateAsync({ userId, userData });
      return result;
    },
    toggleUserBan: async (userId: string, ban: boolean) => {
      const result = await toggleBanMutation.mutateAsync({ userId, ban });
      return result;
    },
    deleteUser: async (userId: string) => {
      const result = await deleteUserMutation.mutateAsync(userId);
      return result;
    },
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openDetailModal,
    closeDetailModal
  };
}; 