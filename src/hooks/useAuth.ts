import { useState, useCallback } from 'react';
import { message } from 'antd';
import { history } from 'umi';
import { login, register, logout, getCurrentUser } from '@/services/Auth/index';
import type API from '@/services/Auth/typings';

export interface UseAuthResult {
  currentUser: API.UserInfo | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (params: API.LoginParams) => Promise<boolean>;
  register: (params: API.RegisterParams) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<API.UserInfo | null>;
}

export default function useAuth(): UseAuthResult {
  const [currentUser, setCurrentUser] = useState<API.UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));

  const handleLogin = useCallback(async (params: API.LoginParams): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await login(params);
      
      if (response.success && response.token) {
        // Lưu token vào localStorage
        localStorage.setItem('token', response.token);
        setIsLoggedIn(true);
        
        // Lưu thông tin người dùng từ response
        if (response.data) {
          setCurrentUser(response.data);
        }
        
        message.success('Đăng nhập thành công!');
        return true;
      } else {
        message.error(response.message || 'Đăng nhập thất bại!');
        return false;
      }
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response?.clone === 'function'
      ) {
        try {
          const errorData = await (error as any).response.clone().json();
          message.error(errorData.message || 'Đăng nhập thất bại!');
        } catch {
          message.error('Đã xảy ra lỗi khi đăng nhập!');
        }
      } else {
        message.error('Không thể kết nối đến server!');
      }
      console.error('Lỗi đăng nhập:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // handleRegister không thay đổi
  const handleRegister = useCallback(async (params: API.RegisterParams): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await register(params);
      
      if (response.success) {
        message.success('Đăng ký thành công! Mật khẩu mặc định là số điện thoại của bạn.');
        return true;
      } else {
        message.error(response.message || 'Đăng ký thất bại!');
        return false;
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi đăng ký!');
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await logout();
      
      // Xóa token
      localStorage.removeItem('token');
      
      setCurrentUser(null);
      setIsLoggedIn(false);
      message.success('Đăng xuất thành công!');
      history.push('/user/login');
    } catch (error) {
      message.error('Đã xảy ra lỗi khi đăng xuất!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = useCallback(async (): Promise<API.UserInfo | null> => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      
      if (response.success && response.data) {
        setCurrentUser(response.data);
        setIsLoggedIn(true);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    currentUser,
    loading,
    isLoggedIn,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    fetchCurrentUser,
  };
}