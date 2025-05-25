const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');

// Đăng nhập dành riêng cho admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[ADMIN LOGIN] Xử lý đăng nhập admin cho:', email);
    
    // Tìm admin từ model User
    const admin = await User.findOne({ email });
    if (!admin) {
      console.log('[ADMIN LOGIN] Không tìm thấy admin với email:', email);
      return res.status(400).json({ success: false, message: 'Email không tồn tại' });
    }
    
    // Kiểm tra role admin
    if (admin.role !== 'admin') {
      console.log('[ADMIN LOGIN] Tài khoản không có quyền admin:', email);
      return res.status(403).json({ 
        success: false, 
        message: 'Tài khoản không có quyền truy cập vào trang quản trị' 
      });
    }
    
    // Kiểm tra mật khẩu với bcryptjs
    console.log('[ADMIN LOGIN] So sánh mật khẩu với hash:', admin.password);
    const isMatch = await bcryptjs.compare(password, admin.password);
    if (!isMatch) {
      console.log('[ADMIN LOGIN] Mật khẩu không đúng cho admin:', email);
      return res.status(400).json({ success: false, message: 'Mật khẩu không đúng' });
    }

    // Tạo JWT cho admin
    const payload = { 
      id: admin._id,
      email: admin.email,
      role: 'admin'
    };
    
    const token = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    console.log('[ADMIN LOGIN] Đăng nhập thành công cho admin:', email);
    
    // Trả về response
    res.json({
      success: true,
      token,
      data: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: 'admin'
      },
      message: 'Đăng nhập admin thành công'
    });
  } catch (error) {
    console.error('[ADMIN LOGIN] Lỗi:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// ENDPOINT đặc biệt - đăng nhập khẩn cấp không kiểm tra mật khẩu
router.post('/emergency-login', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('[EMERGENCY LOGIN] Đăng nhập khẩn cấp cho:', email);
    
    // Tìm admin
    const admin = await User.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Email không tồn tại' });
    }
    
    // Kiểm tra role admin nhưng bỏ qua kiểm tra mật khẩu
    if (admin.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Tài khoản không có quyền truy cập vào trang quản trị' 
      });
    }
    
    // Tạo JWT cho admin
    const payload = { 
      id: admin._id,
      email: admin.email,
      role: 'admin'
    };
    
    const token = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    console.log('[EMERGENCY LOGIN] Đăng nhập khẩn cấp thành công cho:', email);
    
    // Trả về response
    res.json({
      success: true,
      token,
      data: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: 'admin'
      },
      message: 'Đăng nhập khẩn cấp thành công'
    });
  } catch (error) {
    console.error('[EMERGENCY LOGIN] Lỗi:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// API lấy thông tin admin hiện tại
router.get('/current', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Chỉ cho phép admin truy cập
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    
    const admin = await User.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin không tồn tại' });
    }
    
    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('[ADMIN CURRENT] Lỗi:', error);
    res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
});

module.exports = router;