const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

// Sử dụng chính xác JWT_SECRET từ code đăng nhập
const JWT_SECRET = 'your_exact_secret_key_from_login_code'; // Thay thế giá trị này

// Middleware auth nâng cao - cho phép chọn người dùng thông qua header
const auth = (req, res, next) => {
  try {
    // Mặc định là Chị Đào
    let userId = '6831d5f3a7c426695dce161d';
    let userName = 'Chị Đào';
    let userEmail = 'dao@gmail.com';
    let userRole = 'user';

    // Kiểm tra header tùy chỉnh
    const customUserId = req.header('X-User-Id');
    if (customUserId) {
      userId = customUserId;
      
      // Có thể thêm logic để lấy thông tin user dựa vào ID
      // Ví dụ: switch case cho các ID khác nhau
      switch (customUserId) {
        case '6831d5f3a7c426695dce161d':
          userName = 'Chị Đào';
          userEmail = 'dao@gmail.com';
          userRole = 'user';
          break;
        case '6831d5f3a7c426695dce162e': // ID giả định khác
          userName = 'Anh Tuấn';
          userEmail = 'tuan@gmail.com';
          userRole = 'admin';
          break;
        default:
          // Giữ thông tin mặc định
          break;
      }
    }

    // Gán thông tin người dùng vào request
    req.user = { 
      id: userId,
      name: userName,
      email: userEmail,
      role: userRole
    };
    
    console.log(`Auth middleware bypassed - Using user: ${userName} (${userId})`);
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Lỗi xác thực'
    });
  }
};

module.exports = auth;