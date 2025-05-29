const Member = require('../models/Member');
const bcrypt = require('bcrypt');

// Hàm helper kiểm tra trùng email hoặc phone (ngoại trừ member hiện tại khi update)
async function checkDuplicateEmailPhone(email, phone, excludeId = null) {
  const query = {
    $or: [],
  };

  if (email) query.$or.push({ email });
  if (phone) query.$or.push({ phone });

  if (query.$or.length === 0) return false;

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existing = await Member.findOne(query);
  return !!existing;
}

// Hàm tính endDate dựa vào startDate và gói tập
function calculateEndDate(startDate, packageName) {
  const start = new Date(startDate);
  let monthsToAdd = 0;

  switch (packageName) {
    case '1 tháng': monthsToAdd = 1; break;
    case '3 tháng': monthsToAdd = 3; break;
    case '6 tháng': monthsToAdd = 6; break;
    case '12 tháng': monthsToAdd = 12; break;
    default: monthsToAdd = 0;
  }

  const end = new Date(start);
  end.setMonth(end.getMonth() + monthsToAdd);
  return end;
}

// Lấy danh sách hội viên
exports.getAllMembers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.gymId) {
      filter.gymId = req.query.gymId;
    }
    const members = await Member.find(filter);
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Lấy thông tin một hội viên
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Không tìm thấy hội viên' });
    }
    res.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Thêm hội viên mới
exports.createMember = async (req, res) => {
  try {
    const { password, email, phone, startDate, membershipPackage, ...rest } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải từ 6 ký tự trở lên' });
    }

    // Kiểm tra email hoặc phone trùng
    const isDuplicate = await checkDuplicateEmailPhone(email, phone);
    if (isDuplicate) {
      return res.status(400).json({ message: 'Email hoặc số điện thoại đã tồn tại' });
    }

    // Tính ngày kết thúc gói tập
    if (!startDate || !membershipPackage) {
      return res.status(400).json({ message: 'Vui lòng nhập ngày bắt đầu và gói tập' });
    }
    const endDate = calculateEndDate(startDate, membershipPackage);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const member = new Member({
      ...rest,
      email,
      phone,
      password: hashedPassword,
      startDate,
      endDate,
      membershipPackage,
    });

    const savedMember = await member.save();
    res.status(201).json(savedMember);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: error.message });
  }
};

// Cập nhật hội viên
exports.updateMember = async (req, res) => {
  try {
    const { password, email, phone, startDate, membershipPackage, ...rest } = req.body;
    const memberId = req.params.id;

    // Kiểm tra email hoặc phone trùng với member khác
    const isDuplicate = await checkDuplicateEmailPhone(email, phone, memberId);
    if (isDuplicate) {
      return res.status(400).json({ message: 'Email hoặc số điện thoại đã tồn tại' });
    }

    const updateData = {
      ...rest,
      email,
      phone,
      membershipPackage,
      startDate,
    };

    // Tính lại endDate nếu có startDate và membershipPackage
    if (startDate && membershipPackage) {
      updateData.endDate = calculateEndDate(startDate, membershipPackage);
    }

    // Xử lý mật khẩu
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu phải từ 6 ký tự trở lên' });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedMember = await Member.findByIdAndUpdate(memberId, updateData, { new: true });
    if (!updatedMember) {
      return res.status(404).json({ message: 'Không tìm thấy hội viên' });
    }

    res.json(updatedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: error.message });
  }
};

// Xóa hội viên
exports.deleteMember = async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    if (!deletedMember) {
      return res.status(404).json({ message: 'Không tìm thấy hội viên' });
    }
    res.json({ message: 'Xoá hội viên thành công' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};