/**
 * Authentication API Service
 */

import api from '../../../api/client';
import type { User, UserRole } from '../../../types';

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface VerifyEmailRequest {
  token: string;
}

const authService = {
  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/login', data);
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>('/auth/register', data);
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    return api.post<void>('/auth/logout');
  },

  /**
   * Refresh access token
   */
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    return api.post<RefreshTokenResponse>('/auth/refresh', data);
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/auth/me');
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return api.patch<User>('/auth/profile', data);
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    return api.post<void>('/auth/change-password', data);
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (data: ResetPasswordRequest): Promise<void> => {
    return api.post<void>('/auth/forgot-password', data);
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    return api.post<void>('/auth/reset-password', { token, newPassword });
  },

  /**
   * Verify email address
   */
  verifyEmail: async (data: VerifyEmailRequest): Promise<void> => {
    return api.post<void>('/auth/verify-email', data);
  },

  /**
   * Resend verification email
   */
  resendVerificationEmail: async (): Promise<void> => {
    return api.post<void>('/auth/resend-verification');
  },
};

export default authService;
