import { request } from 'umi';
import type API from '@/services/Auth/typings';

const API_URL = process.env.UMI_APP_API_URL || '';

export async function login(params: API.LoginParams): Promise<API.Response<API.UserInfo>> {
  try {
    console.log('Gửi request đăng nhập');
    // Không log params để tránh lộ mật khẩu
    const response = await request(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: params,
    });
    
    // Lưu token
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      
      // Lưu thông tin người dùng nếu cần
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    }
    
    return response;
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    throw error;
  }
}

export async function register(params: API.RegisterParams): Promise<API.Response<API.UserInfo>> {
  try {
    console.log('Gửi request đăng ký');
    // Không log params để tránh lộ mật khẩu
    const response = await request(`${API_URL}/api/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: params,
    });
    
    // Kiểm tra cấu trúc response đã đúng với API.Response chưa
    if (response.success !== undefined) {
      // Response đã đúng định dạng
      return response;
    } else if (response._id) {
      // Chuyển đổi từ MongoDB document sang định dạng API.Response
      return {
        success: true,
        data: {
          id: response._id,
          name: response.name,
          email: response.email,
          phone: response.phone,
          gymId: response.gymId,
          membershipPackage: response.membershipPackage,
          startDate: response.startDate,
          endDate: response.endDate
        },
        message: 'Đăng ký thành công!'
      };
    } else {
      // Trường hợp không rõ
      return {
        success: false,
        message: 'Phản hồi từ server không đúng định dạng',
      };
    }
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<API.Response<API.UserInfo>> {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return {
        success: false,
        message: 'Không có token xác thực',
      };
    }
    
    // Lấy thông tin người dùng hiện tại
    return await request(`${API_URL}/api/auth/current`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Lỗi lấy thông tin người dùng:', error);
    
    // Kiểm tra lỗi xác thực
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as any).response?.status === 'number' &&
      (error as any).response.status === 401
    ) {
      // Xóa token và thông tin người dùng nếu không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    throw error;
  }
}

export async function logout(): Promise<API.Response<void>> {
  // Xóa token và thông tin người dùng
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  return {
    success: true,
    message: 'Đăng xuất thành công',
  };
}