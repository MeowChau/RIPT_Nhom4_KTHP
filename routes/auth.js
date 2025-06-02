const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys'); // Import JWT_SECRET từ file config

// Log thông tin JWT_SECRET để debug (chỉ phần đầu)
console.log('Đang sử dụng JWT_SECRET', JWT_SECRET ? JWT_SECRET.substring(0, 3) + '...' : 'undefined');

// Đăng ký tài khoản mới
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    console.log('Đang xử lý đăng ký cho:', email);
    
    // Kiểm tra dữ liệu đầu vào
    if (!email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email và số điện thoại là bắt buộc' 
      });
    }
    
    // Kiểm tra email đã tồn tại chưa
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email này đã được sử dụng' 
      });
    }
    
    // Sử dụng số điện thoại làm mật khẩu ban đầu
    const password = phone;
    
    // Tạo mật khẩu hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Tạo member mới
    const newMember = new Member({
      name: name || email.split('@')[0],
      email,
      password: hashedPassword,
      phone,
      role: 'user',
      createdAt: new Date()
    });
    
    // Lưu vào database
    await newMember.save();
    
    // Tạo JWT token
    const payload = { 
      id: newMember._id,
      role: 'user'
    };
    
    const token = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1y' }
    );
    
    console.log('Register successful for:', newMember.email);
    console.log('User created with ID:', newMember._id);
    
    // Trả về kết quả
    res.status(201).json({
      success: true,
      token,
      data: {
        id: newMember._id,
        name: newMember.name,
        email: newMember.email,
        role: 'user',
        phone: newMember.phone
      },
      message: 'Đăng ký thành công! Mật khẩu đăng nhập là số điện thoại của bạn.'
    });
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server khi đăng ký' 
    });
  }
});

// Đổi mật khẩu
router.post('/change-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, mật khẩu hiện tại và mật khẩu mới đều là bắt buộc'
      });
    }
    
    // Tìm user
    const member = await Member.findOne({ email });
    if (!member) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email không tồn tại' 
      });
    }
    
    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, member.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mật khẩu hiện tại không đúng' 
      });
    }
    
    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    member.password = await bcrypt.hash(newPassword, salt);
    
    // Lưu vào database
    await member.save();
    
    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server khi đổi mật khẩu' 
    });
  }
});

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
        phone: member.phone
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

// Quên mật khẩu (reset về số điện thoại)
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email là bắt buộc'
      });
    }
    
    // Tìm user
    const member = await Member.findOne({ email });
    if (!member) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email không tồn tại' 
      });
    }
    
    // Reset mật khẩu về số điện thoại
    if (!member.phone) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy số điện thoại để đặt lại mật khẩu'
      });
    }
    
    // Hash mật khẩu mới (số điện thoại)
    const salt = await bcrypt.genSalt(10);
    member.password = await bcrypt.hash(member.phone, salt);
    
    // Lưu vào database
    await member.save();
    
    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công. Mật khẩu mới là số điện thoại của bạn.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server khi đặt lại mật khẩu' 
    });
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