const express = require('express');
const router = express.Router();
const Gift = require('../models/Gift');
const GiftCode = require('../models/GiftCode');
const Member = require('../models/Member');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// Lấy danh sách quà
router.get('/', async (req, res) => {
  const gifts = await Gift.find();
  res.json(gifts);
});

// Đổi quà
router.post('/redeem', async (req, res) => {
  console.log('[GiftCode] /redeem called', req.body);
  const { userId, giftType, qr } = req.body;
  const user = await Member.findById(userId);
  const gift = await Gift.findOne({ type: giftType });
  if (!user || !gift || gift.quantity <= 0 || user.points < gift.pointRequired) {
    console.log('[GiftCode] /redeem failed: user or gift not found or not enough points/quantity');
    return res.status(400).json({ message: 'Không đủ điều kiện đổi quà' });
  }
  // Luôn tạo GiftCode mới mỗi lần đổi quà
  user.points -= gift.pointRequired;
  gift.quantity -= 1;
  await user.save();
  await gift.save();
  const code = uuidv4().slice(0, 8);
  const giftCode = await GiftCode.create({ code, userId: user._id.toString(), giftType, used: false });
  console.log('[GiftCode] Created:', giftCode);
  // Tạo notification cho admin
  const noti = await Notification.create({
    userId: null, // hoặc 'admin' nếu muốn
    type: 'gift_redeem',
    message: `User ${user.fullName || user.name || user.email || user._id} vừa đổi quà: ${gift.name || gift.type} với mã: ${code}`,
    createdAt: new Date(),
  });
  console.log('[Notification] Created:', noti);
  if (qr) {
    const qrData = await QRCode.toDataURL(giftCode.code);
    return res.json({ code: giftCode.code, qr: qrData });
  }
  res.json({ code: giftCode.code });
});

// Lấy mã đổi quà của user
router.get('/codes/:userId', async (req, res) => {
  const codes = await GiftCode.find({ userId: req.params.userId, used: false });
  res.json(codes);
});

// Lấy tất cả mã đổi quà chưa xác thực cho admin (kèm thông tin user)
router.get('/codes/all', async (req, res) => {
  console.log('[GiftCode] /codes/all called');
  const codes = await GiftCode.find({ used: false });
  console.log('[GiftCode] All codes:', codes);
  // Convert userId string sang ObjectId
  const userIds = codes.map(c => {
    try {
      return mongoose.Types.ObjectId(c.userId);
    } catch {
      return null;
    }
  }).filter(Boolean);
  const users = await Member.find({ _id: { $in: userIds } });
  const userMap = {};
  users.forEach(u => { userMap[u._id.toString()] = u; });
  const codesWithUser = codes.map(c => ({
    ...c.toObject(),
    user: userMap[c.userId] ? { name: userMap[c.userId].name, email: userMap[c.userId].email } : null
  }));
  console.log('[GiftCode] codesWithUser:', codesWithUser);
  res.json(codesWithUser);
});

// Admin xác thực đổi quà
router.post('/verify', async (req, res) => {
  const { code } = req.body;
  const giftCode = await GiftCode.findOne({ code, used: false });
  if (!giftCode) return res.status(404).json({ message: 'Mã không hợp lệ hoặc đã dùng' });
  giftCode.used = true;
  await giftCode.save();
  // Ghi nhận thông báo nhận quà
  const gift = await Gift.findOne({ type: giftCode.giftType });
  await Notification.create({
    userId: giftCode.userId,
    type: 'gift',
    message: `Bạn đã nhận quà: ${gift?.name || giftCode.giftType}`,
    createdAt: new Date()
  });
  res.json({ message: 'Đổi quà thành công' });
});

// Nhận mã đổi quà từ user gửi cho admin (giả lập)
router.post('/send-code', async (req, res) => {
  const { code, userId } = req.body;
  if (!code || !userId) return res.status(400).json({ message: 'Thiếu mã hoặc userId' });
  let giftCode = await GiftCode.findOne({ code });
  if (!giftCode) {
    giftCode = await GiftCode.create({ code, userId, giftType: 'custom' });
  } else {
    giftCode.userId = userId;
    await giftCode.save();
  }
  res.json({ message: 'Admin đã nhận mã đổi quà!' });
});

// Lấy danh sách thông báo đổi quà cho admin
router.get('/notifications/gift-admin', async (req, res) => {
  try {
    // Lấy tất cả thông báo type 'gift_redeem' (yêu cầu xác nhận) và 'gift' (đã xác nhận), mới nhất trước
    const notifications = await Notification.find({ type: { $in: ['gift_redeem', 'gift'] } }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Không lấy được thông báo đổi quà.' });
  }
});

module.exports = router; 