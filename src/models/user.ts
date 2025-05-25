import { useState, useCallback, useEffect } from 'react';
import { getCurrentUser } from '@/services/Auth/index';

import type API from '@/services/Auth/typings'; // Import namespace API

export default function useUser() {
  const [currentUser, setCurrentUser] = useState<API.UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserInfo = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await getCurrentUser();
      if (response.success && response.data) {
        setCurrentUser(response.data);
      }
    } catch (error) {
      console.error('Lấy thông tin người dùng thất bại:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  return {
    currentUser,
    loading,
    fetchUserInfo,
  };
}