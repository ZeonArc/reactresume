'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types';

// Permanent auto-authenticated mock user
const AUTO_USER: User = {
  id: 'auto-user-123',
  email: 'guest@example.com',
  firstName: 'Guest',
  lastName: 'User'
};

interface AuthContextType {
  user: User;  // Always authenticated, so never null
  isLoading: boolean;
  error: null; // Never any errors
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Always provide auto-authenticated user
  const [user] = useState<User>(AUTO_USER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Just a formality - immediately mark as loaded
  useEffect(() => {
    console.log("Auto-login permanently active - no authentication required");
    setIsLoading(false);
  }, []);

  // All auth functions are now no-op dummy functions
  const handleSignIn = async () => {
    router.push('/dashboard');
  };

  const handleSignUp = async () => {
    router.push('/dashboard');
  };

  const handleSignOut = async () => {
    router.push('/');
  };

  const handleResetPassword = async () => {
    // Do nothing
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    error: null,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 