import { useState, useEffect } from 'react';
import adminService, { User, PaginatedUsers } from '@/services/adminService';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';

interface UseAdminUsersProps {
  initialPage?: number;
  initialLimit?: number;
}

export const useAdminUsers = ({ initialPage = 1, initialLimit = 10 }: UseAdminUsersProps = {}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Fetch users with pagination
  const fetchUsers = async (page = pagination.page, limit = pagination.limit) => {
    setLoading(true);
    setError(null);
    try {
      const data: PaginatedUsers = await adminService.getAllUsers(page, limit);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError('Failed to fetch users');
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single user by ID
  const fetchUserById = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await adminService.getUserById(userId);
      setSelectedUser(user);
      return user;
    } catch (error) {
      const axiosError = error as AxiosError;
      setError('Failed to fetch user');
      toast.error('Failed to fetch user');
      console.error('Error fetching user:', axiosError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update user information
  const updateUser = async (userId: string, userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await adminService.updateUserInfo(userId, userData);
      setUsers(users.map(user => user.id === userId ? updatedUser : user));
      if (selectedUser?.id === userId) {
        setSelectedUser(updatedUser);
      }
      toast.success('User updated successfully');
      return updatedUser;
    } catch (error) {
      const axiosError = error as AxiosError;
      setError('Failed to update user');
      toast.error('Failed to update user');
      console.error('Error updating user:', axiosError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Toggle user ban status
  const toggleUserBan = async (userId: string, ban: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await adminService.toggleUserBan(userId, ban);
      setUsers(users.map(user => user.id === userId ? updatedUser : user));
      if (selectedUser?.id === userId) {
        setSelectedUser(updatedUser);
      }
      toast.success(`User ${ban ? 'banned' : 'unbanned'} successfully`);
      return updatedUser;
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(`Failed to ${ban ? 'ban' : 'unban'} user`);
      toast.error(`Failed to ${ban ? 'ban' : 'unban'} user`);
      console.error('Error toggling user ban:', axiosError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
      toast.success('User deleted successfully');
      return true;
    } catch (error) {
      const axiosError = error as AxiosError;
      setError('Failed to delete user');
      toast.error('Failed to delete user');
      console.error('Error deleting user:', axiosError.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Change page
  const changePage = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchUsers(newPage, pagination.limit);
  };

  // Change limit
  const changeLimit = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    fetchUsers(1, newLimit);
  };

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
  const openDetailModal = async (user: User) => {
    setLoading(true);
    try {
      const detailedUser = await adminService.getUserById(user.id);
      setSelectedUser(detailedUser);
      setIsDetailModalOpen(true);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError('Failed to fetch user details');
      toast.error('Failed to fetch user details');
      console.error('Error fetching user details:', axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  // Close detail modal
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    selectedUser,
    isEditModalOpen,
    isDeleteModalOpen,
    isDetailModalOpen,
    fetchUsers,
    fetchUserById,
    updateUser,
    toggleUserBan,
    deleteUser,
    changePage,
    changeLimit,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
    openDetailModal,
    closeDetailModal
  };
}; 