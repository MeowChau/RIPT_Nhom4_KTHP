const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys'); // Import JWT_SECRET từ file config

// Log thông tin JWT_SECRET để debug (chỉ phần đầu)
console.log('Đang sử dụng JWT_SECRET', JWT_SECRET ? JWT_SECRET.substring(0, 3) + '...' : 'undefined');

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Đang xử lý đăng nhập cho:', email);
    
    // Tìm user
    const member = await Member.findOne({ email });
    if (!member) {
      return res.status(400).json({ success: false, message: 'Email không tồn tại' });
    }
    
    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mật khẩu không đúng' });
    }

    // *** QUAN TRỌNG: Đưa role vào payload JWT ***
    const payload = { 
      id: member._id,
      role: member.role || 'user' // Đưa role vào payload
    };
    
    const token = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1y' }
    );
    
    // Log thông tin
    console.log('Login successful for:', member.email);
    console.log('User has role:', member.role);
    console.log('JWT payload contains:', payload);
    
    // Trả về response với đầy đủ thông tin
    res.json({
      success: true,
      token,
      data: {
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role || 'user', // Đảm bảo có role
        // Các thông tin khác
      },
      role: member.role || 'user', // Thêm role ở top-level để dễ truy cập
      message: 'Đăng nhập thành công'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

router.get('/current', async (req, res) => {
  try {
    // Lấy token từ header và kiểm tra kỹ lưỡng
    const authHeader = req.headers.authorization || '';
    console.log('Authorization header:', authHeader);
    
    // Kiểm tra format của header
    if (!authHeader.startsWith('Bearer ')) {
      console.log('Header không đúng định dạng Bearer');
      return res.status(401).json({ 
        success: false, 
        message: 'Header Authorization không đúng định dạng' 
      });
    }
    
    // Tách token và kiểm tra
    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token);
    
    if (!token || token === 'undefined' || token === 'null') {
      console.log('Token rỗng hoặc không hợp lệ');
      return res.status(401).json({ 
        success: false, 
        message: 'Token không hợp lệ hoặc rỗng' 
      });
    }

    // Bổ sung kiểm tra token có đúng định dạng JWT không (xxx.yyy.zzz)
    if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)) {
      console.log('Token không đúng định dạng JWT');
      return res.status(401).json({ 
        success: false, 
        message: 'Token không đúng định dạng JWT' 
      });
    }

    // Đối với mock token (từ trang admin truy cập trực tiếp)
    if (token.includes('mock-signature')) {
      console.log('Phát hiện mock token, trả về dữ liệu mặc định');
      return res.json({
        success: true,
        data: {
          id: '1',
          name: 'Admin',
          email: 'admin@example.com',
          role: 'admin'
        }
      });
    }
    
    // Xác thực token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Kiểm tra ID trong token
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Token không chứa ID người dùng'
      });
    }
    
    // Tìm user theo ID từ token đã giải mã
    const member = await Member.findById(decoded.id);
    if (!member) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy thông tin người dùng' 
      });
    }
    
    // Trả về thông tin người dùng
    res.json({
      success: true,
      data: {
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role || 'user',
        phone: member.phone,
        gymId: member.gymId,
        membershipPackage: member.membershipPackage,
        startDate: member.startDate,
        endDate: member.endDate
      }
    });
  } catch (error) {
    console.error('GET /api/auth/current error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token không hợp lệ: ' + error.message
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token hết hạn' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server: ' + error.message
    });
  }
});

module.exports = router;