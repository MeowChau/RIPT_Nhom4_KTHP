const express = require('express');
const router = express.Router();
const ForumPost = require('../models/ForumPost');
const auth = require('../middleware/auth');
const Member = require('../models/Member');
const GiftCode = require('../models/GiftCode');
const { v4: uuidv4 } = require('uuid');
const Notification = require('../models/Notification');

// Đăng bài
router.post('/posts', auth, async (req, res) => {
  const { content } = req.body;
  const authorId = req.user.id ? req.user.id.toString() : '';
  const post = await ForumPost.create({ authorId, content });
  res.json(post);
});

// Lấy danh sách bài
router.get('/posts', async (req, res) => {
  const posts = await ForumPost.find().sort({ createdAt: -1 });
  // Lấy danh sách authorId duy nhất
  const authorIds = [...new Set(posts.map(p => p.authorId))];
  // Lấy thông tin member
  const members = await Member.find({ _id: { $in: authorIds } });
  // Map memberId -> member
  const memberMap = {};
  members.forEach(m => { memberMap[m._id] = m; });
  // Gắn tên và email vào từng post
  const postsWithUser = posts.map(post => {
    const user = memberMap[post.authorId] || {};
    return {
      ...post.toObject(),
      authorName: user.name || 'Người dùng',
      authorEmail: user.email || '',
    };
  });
  res.json(postsWithUser);
});

// Like/Unlike bài
router.post('/posts/:id/like', auth, async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  const userId = req.user.id.toString();
  const index = post.likes.indexOf(userId);
  if (index === -1) {
    post.likes.push(userId); // Like
  } else {
    post.likes.splice(index, 1); // Unlike
  }
  await post.save();
  res.json(post);
});

// Comment
router.post('/posts/:id/comments', async (req, res) => {
  const { authorId, content } = req.body;
  const post = await ForumPost.findById(req.params.id);
  post.comments.push({ authorId, content });
  await post.save();
  res.json(post);
});

// Like comment
router.post('/comments/:commentId/like', async (req, res) => {
  const { userId } = req.body;
  const post = await ForumPost.findOne({ 'comments._id': req.params.commentId });
  const comment = post.comments.id(req.params.commentId);
  if (!comment.likes.includes(userId)) comment.likes.push(userId);
  await post.save();
  res.json(comment);
});

// Nhận điểm năng nổ thủ công
router.post('/posts/claim-points', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const ForumPost = require('../models/ForumPost');
    const Member = require('../models/Member');
    const GiftCode = require('../models/GiftCode');
    const { v4: uuidv4 } = require('uuid');

    // Lấy tất cả bài post của user
    const posts = await ForumPost.find({ authorId: userId });
    let pointsToAdd = 0;
    posts.forEach(post => {
      if ((post.likes?.length || 0) >= 10 || (post.comments?.length || 0) >= 3) {
        pointsToAdd += 20;
      }
    });
    if (pointsToAdd === 0) {
      return res.status(400).json({ message: 'Bạn chưa có bài nào đủ điều kiện nhận điểm năng nổ.' });
    }
    // Cộng điểm cho user
    const user = await Member.findById(userId);
    user.points = (user.points || 0) + pointsToAdd;
    await user.save();
    // Tặng quà nếu đạt mốc
    const gifts = [
      { point: 5000, type: 'whey' },
      { point: 1000, type: 'gangtay' },
      { point: 200, type: '3thang' },
      { point: 100, type: '1thang' },
    ];
    const awardedGifts = [];
    for (const gift of gifts) {
      if (user.points >= gift.point && !(await GiftCode.findOne({ userId, giftType: gift.type }))) {
        // Tạo giftcode
        const code = uuidv4().slice(0, 8);
        await GiftCode.create({ code, userId, giftType: gift.type });
        awardedGifts.push(gift.type);
      }
    }
    res.json({ message: `Đã cộng ${pointsToAdd} điểm năng nổ!`, awardedGifts });
  } catch (error) {
    console.error('Claim points error:', error);
    res.status(500).json({ message: 'Lỗi khi nhận điểm năng nổ.' });
  }
});

// Lấy tổng điểm năng nổ của user hiện tại
router.get('/posts/points', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const Member = require('../models/Member');
    const user = await Member.findById(userId);
    res.json({ points: user?.points || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Không lấy được điểm năng nổ.' });
  }
});

// Xóa bài viết
router.delete('/posts/:id', auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    if (post.authorId?.toString() !== req.user.id?.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa bài viết này' });
    }
    await ForumPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa bài viết thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi xóa bài viết' });
  }
});

// Lấy danh sách thông báo điểm năng nổ tự động cho user hiện tại
router.get('/notifications', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Không lấy được thông báo.' });
  }
});

module.exports = router; 