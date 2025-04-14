'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserContextType } from '../types/user';
import { auth } from '@/services/api';

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch user data from server
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      // Call API to get latest user data
      const response = await auth.getCurrentUser();
      setUser(response.user);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data');
      setUser(null);
      // Clear invalid session
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiration');
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing user data on initial load
  useEffect(() => {
    fetchUserData();
  }, []);

  // Custom setUser function that also updates localStorage
  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    
    if (newUser) {
      // Set token expiration to 24 hours from now
      const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem('tokenExpiration', expirationTime.toString());
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      // Clear user data from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiration');
    }
  };

  const value = {
    user,
    setUser: updateUser,
    isLoading,
    error,
    refreshUserData: fetchUserData // Expose refresh function
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}; 