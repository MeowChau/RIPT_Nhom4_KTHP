const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  gymId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
  package: { type: String, required: true },
  amount: { type: Number, required: true },
  rent: { type: Number, default: 0 }, // Chi phí mặt bằng
  salaries: { type: Number, default: 0 }, // Chi phí lương nhân viên
  maintenance: { type: Number, default: 0 }, // Chi phí bảo trì
  marketing: { type: Number, default: 0 }, // Chi phí marketing
  
  date: { type: Date, required: true, default: Date.now },
  status: { type: String, enum: ['success', 'failed', 'pending'], required: true }
});

module.exports = mongoose.model('Payment', PaymentSchema);