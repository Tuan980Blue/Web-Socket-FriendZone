import { useContext } from 'react';
import { UserContextType } from '../types/user';
import { UserContext } from '../store/UserContext';

export const useUserData = (): UserContextType => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserProvider');
  }
  
  return context;
}; 