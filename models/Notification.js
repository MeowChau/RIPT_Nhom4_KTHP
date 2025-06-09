const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: false },
  type: { type: String, required: true }, // auto_points, gift, ...
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});
module.exports = mongoose.model('Notification', NotificationSchema); 