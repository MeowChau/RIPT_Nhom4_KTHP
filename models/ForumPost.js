const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
  authorId: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  likes: [String], // userId
});
const ForumPostSchema = new mongoose.Schema({
  authorId: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  likes: [String], // userId
  comments: [CommentSchema],
});
module.exports = mongoose.model('ForumPost', ForumPostSchema); 