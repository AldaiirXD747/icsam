
import { AuthProvider } from './AuthContext';
import { useAuth } from './useAuth';
import { withAuth } from './withAuth';
import { ReactNode } from 'react';

// Auth provider wrapper for the app
export const AuthProviderWrapper = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export { AuthProvider, useAuth, withAuth };
export default useAuth;
