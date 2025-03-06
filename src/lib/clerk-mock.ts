
import { createContext, useContext } from 'react';

// Mock user
const mockUser = {
  id: 'user_123',
  fullName: 'Admin User',
  email: 'admin@example.com',
};

// Create a context for the user
const UserContext = createContext({ user: mockUser, isLoaded: true });

// Create a hook to access the user context
export const useUser = () => useContext(UserContext);
