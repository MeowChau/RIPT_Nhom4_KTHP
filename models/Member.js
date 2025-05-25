const mongoose = require('mongoose');

const RenewalSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  package: { type: String, required: true },
  status: { type: String, required: true }
});

const validPackages = ['1 tháng', '3 tháng', '6 tháng', '12 tháng'];

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  password: { type: String, required: true }, // Mật khẩu đã hash
  gymId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
  membershipPackage: { type: String, enum: validPackages, required: true },
  startDate: { type: Date, required: true },    // Ngày bắt đầu tập
  endDate: { type: Date, required: true },      // Ngày kết thúc tập (tự tính)
  renewalHistory: { type: [RenewalSchema], default: [] },
  // Thêm trường role
  role: { 
    type: String,
    enum: ['user', 'admin', 'trainer'],
    default: 'user'
  }
});

module.exports = mongoose.model('Member', MemberSchema);