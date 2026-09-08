import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const storage = {
  async saveToken(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value);
        }
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error saving token to SecureStore:', error);
      throw error;
    }
  },

  async getToken(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          return window.localStorage.getItem(key);
        }
        return null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error retrieving token from SecureStore:', error);
      return null;
    }
  },

  async removeToken(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing token from SecureStore:', error);
      throw error;
    }
  },
};
