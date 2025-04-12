'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserContextType } from '../types/user';

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing user data on initial load
  useEffect(() => {
    const checkUserSession = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const tokenExpiration = localStorage.getItem('tokenExpiration');
        
        if (token && userData && tokenExpiration) {
          const expirationTime = parseInt(tokenExpiration);
          const currentTime = new Date().getTime();
          
          if (currentTime < expirationTime) {
            // Token is still valid
            setUser(JSON.parse(userData));
          } else {
            // Token has expired, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('tokenExpiration');
            setUser(null);
          }
        } else {
          // No token or user data
          setUser(null);
        }
      } catch (err) {
        console.error('Error checking user session:', err);
        setError('Failed to load user session');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
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
    error
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}; 