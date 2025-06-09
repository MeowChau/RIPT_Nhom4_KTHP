const ForumPost = require('../models/ForumPost');
const User = require('../models/User');
const Member = require('../models/Member');
const Gift = require('../models/Gift');
const GiftCode = require('../models/GiftCode');
const Notification = require('../models/Notification');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const runMinutePoints = async () => {
  const start = Date.now();
  console.log(`[CRON] Bắt đầu tổng hợp lúc: ${new Date(start).toLocaleString()}`);
  // Lấy tất cả bài viết
  const posts = await ForumPost.find();
  if (!posts.length) return;

  // Tìm bài viết nhiều like nhất
  let mostLikedPost = posts[0];
  let mostCommentedPost = posts[0];
  posts.forEach(post => {
    if ((post.likes?.length || 0) > (mostLikedPost.likes?.length || 0)) {
      mostLikedPost = post;
    }
    if ((post.comments?.length || 0) > (mostCommentedPost.comments?.length || 0)) {
      mostCommentedPost = post;
    }
  });

  // Nếu một bài viết vừa nhiều like vừa nhiều comment nhất
  if (mostLikedPost && mostCommentedPost && mostLikedPost._id.toString() === mostCommentedPost._id.toString()) {
    const post = mostLikedPost;
    if (post && post.authorId) {
      let member = null;
      try {
        member = await Member.findById(mongoose.Types.ObjectId(post.authorId));
      } catch (err) {
        member = await Member.findById(post.authorId);
      }
      if (!member) {
        console.log(`[CRON] Không tìm thấy Member với authorId: ${post.authorId}`);
      }
      if (member) {
        member.points = (member.points || 0) + 40;
        await member.save();
        await Notification.create({
          userId: member._id,
          type: 'auto_points_both',
          message: 'Bạn vừa được cộng 40 điểm năng nổ tự động vì bài viết của bạn đứng đầu cả lượt like và lượt bình luận!',
          createdAt: new Date()
        });
        // Tặng quà nếu đạt mốc
        const gifts = [
          { point: 5000, type: 'whey' },
          { point: 1000, type: 'gangtay' },
          { point: 200, type: '3thang' },
          { point: 100, type: '1thang' },
        ];
        for (const gift of gifts) {
          if (member.points >= gift.point && !(await GiftCode.findOne({ userId: member._id, giftType: gift.type }))) {
            const code = uuidv4().slice(0, 8);
            await GiftCode.create({ code, userId: member._id, giftType: gift.type });
          }
        }
        return;
      }
      // Nếu không có Member thì cộng cho User
      const user = await User.findById(post.authorId);
      if (user) {
        user.points = (user.points || 0) + 40;
        await user.save();
      }
    }
    return;
  }

  // Nếu hai bài khác nhau thì xử lý như cũ
  const rewardedMemberIds = new Set();
  const rewardedUserIds = new Set();
  const postTypes = [
    { post: mostLikedPost, type: 'auto_points_like', msg: 'Bạn vừa được cộng 20 điểm năng nổ tự động vì có bài viết nhiều lượt like nhất!' },
    { post: mostCommentedPost, type: 'auto_points_comment', msg: 'Bạn vừa được cộng 20 điểm năng nổ tự động vì có bài viết nhiều lượt bình luận nhất!' }
  ];
  for (const { post, type, msg } of postTypes) {
    if (post && post.authorId) {
      let member = null;
      try {
        member = await Member.findById(mongoose.Types.ObjectId(post.authorId));
      } catch (err) {
        member = await Member.findById(post.authorId);
      }
      if (!member) {
        console.log(`[CRON] Không tìm thấy Member với authorId: ${post.authorId}`);
      }
      if (member && !rewardedMemberIds.has(member._id.toString())) {
        member.points = (member.points || 0) + 20;
        await member.save();
        rewardedMemberIds.add(member._id.toString());
        await Notification.create({
          userId: member._id,
          type,
          message: msg,
          createdAt: new Date()
        });
        const gifts = [
          { point: 5000, type: 'whey' },
          { point: 1000, type: 'gangtay' },
          { point: 200, type: '3thang' },
          { point: 100, type: '1thang' },
        ];
        for (const gift of gifts) {
          if (member.points >= gift.point && !(await GiftCode.findOne({ userId: member._id, giftType: gift.type }))) {
            const code = uuidv4().slice(0, 8);
            await GiftCode.create({ code, userId: member._id, giftType: gift.type });
          }
        }
        continue;
      }
      const user = await User.findById(post.authorId);
      if (user && !rewardedUserIds.has(user._id.toString())) {
        user.points = (user.points || 0) + 20;
        await user.save();
        rewardedUserIds.add(user._id.toString());
      }
    }
  }
  const end = Date.now();
  console.log(`[CRON] Kết thúc tổng hợp lúc: ${new Date(end).toLocaleString()}`);
  console.log(`[CRON] Thời gian thực thi: ${(end - start)} ms`);
};

module.exports = runMinutePoints; 