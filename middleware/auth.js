// Đổi tên biến khi import để tránh xung đột
const jwt = require('jsonwebtoken');
const Member = require('../models/Member'); // Sử dụng Member thay vì User để phù hợp với model của bạn

// JWT Secret Key - nên đưa vào file .env
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const auth = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false, 
        message: 'Không tìm thấy token xác thực'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Xác thực token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Tìm kiếm người dùng theo ID
    const member = await Member.findById(decoded.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }
    
    // Gắn thông tin người dùng vào request
    req.user = {
      id: member._id,
      name: member.name,
      email: member.email,
      role: member.role || 'user'
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

module.exports = auth;