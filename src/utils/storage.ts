/**
 * LocalStorage Utility with Type Safety and Error Handling
 */

import config from '../config';

class StorageService {
  /**
   * Set item in localStorage
   */
  set<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Get item from localStorage
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Clear all items
   */
  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}

// Token management
export const tokenStorage = {
  setAccessToken(token: string): void {
    storage.set(config.auth.tokenKey, token);
  },

  getAccessToken(): string | null {
    return storage.get<string>(config.auth.tokenKey);
  },

  setRefreshToken(token: string): void {
    storage.set(config.auth.refreshTokenKey, token);
  },

  getRefreshToken(): string | null {
    return storage.get<string>(config.auth.refreshTokenKey);
  },

  clearTokens(): void {
    storage.remove(config.auth.tokenKey);
    storage.remove(config.auth.refreshTokenKey);
  },
};

export const storage = new StorageService();
export default storage;
