const mongoose = require('mongoose');
const GiftCodeSchema = new mongoose.Schema({
  code: String,
  userId: String,
  giftType: String,
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('GiftCode', GiftCodeSchema); 