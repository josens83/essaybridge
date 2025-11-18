/**
 * Authentication Context with Real API Integration
 * Replaces mock authentication with actual API calls
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole } from '../../shared/types';
import authService from './api/auth.service';
import { tokenStorage } from '../../utils/storage';
import { handleError, getUserFriendlyMessage } from '../../utils/errors';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize auth state from stored token
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.getAccessToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch current user profile
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        // Token invalid or expired
        tokenStorage.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login({ email, password, role });

      // Store tokens
      tokenStorage.setAccessToken(response.accessToken);
      tokenStorage.setRefreshToken(response.refreshToken);

      // Set user
      setUser(response.user);
    } catch (err) {
      const appError = handleError(err);
      const message = getUserFriendlyMessage(appError);
      setError(message);
      throw appError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(
    async (email: string, password: string, name: string, role: UserRole) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await authService.register({ email, password, name, role });

        // Store tokens
        tokenStorage.setAccessToken(response.accessToken);
        tokenStorage.setRefreshToken(response.refreshToken);

        // Set user
        setUser(response.user);
      } catch (err) {
        const appError = handleError(err);
        const message = getUserFriendlyMessage(appError);
        setError(message);
        throw appError;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);

      // Call logout API
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local state regardless of API call result
      tokenStorage.clearTokens();
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      const appError = handleError(err);
      const message = getUserFriendlyMessage(appError);
      setError(message);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
