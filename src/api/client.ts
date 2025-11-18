/**
 * Axios HTTP Client with Interceptors
 * Handles authentication, error handling, and request/response transformation
 */

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import config from '../config';
import { tokenStorage } from '../utils/storage';
import { handleError } from '../utils/errors';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Adds authentication token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(handleError(error));
  }
);

/**
 * Response Interceptor
 * Handles token refresh and error responses
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh token endpoint
        const response = await axios.post(
          `${config.api.baseURL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update tokens
        tokenStorage.setAccessToken(accessToken);
        if (newRefreshToken) {
          tokenStorage.setRefreshToken(newRefreshToken);
        }

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        tokenStorage.clearTokens();
        window.location.href = '/login';
        return Promise.reject(handleError(refreshError));
      }
    }

    return Promise.reject(handleError(error));
  }
);

/**
 * HTTP Methods
 */
export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },

  /**
   * Upload file with progress tracking
   */
  upload: async <T>(
    url: string,
    file: File,
    onProgress?: (progressEvent: { loaded: number; total?: number }) => void
  ): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
          });
        }
      },
    });

    return response.data;
  },
};

export default api;
