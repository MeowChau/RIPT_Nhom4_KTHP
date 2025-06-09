import axios from 'axios';
import { message } from 'antd';
import { history } from 'umi';

// Xác định API URL dựa trên môi trường
const isProduction = process.env.NODE_ENV === 'production';
const API_URL = isProduction ? 'https://ript-nhom4-kthp-xyz.onrender.com' : '';

// Tạo instance axios với baseURL
const request = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Biến để theo dõi nếu đã hiển thị thông báo lỗi
let isShowingSessionError = false;

// Interceptor để tự động thêm token vào mọi request
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý các lỗi phản hồi, đặc biệt là lỗi xác thực
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi xác thực (401, 403)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (!isShowingSessionError) {
        isShowingSessionError = true;
        
        message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!', 3, () => {
          // Reset flag sau khi thông báo biến mất
          isShowingSessionError = false;
        });
        
        // Xóa token không hợp lệ
        localStorage.removeItem('token');
        
        // Chuyển hướng đến trang đăng nhập sau 1 giây
        setTimeout(() => {
          history.push('/user/login');
        }, 1000);
      }
    }
    
    return Promise.reject(error);
  }
);

export default request;