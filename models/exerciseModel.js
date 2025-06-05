const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên bài tập không được để trống']
  },
  type: {
    type: String,
    required: [true, 'Loại bài tập không được để trống'],
    enum: ['Kháng lực', 'Cardio', 'BodyCombat']
  },
  image: {
    type: String, // Lưu trữ hình ảnh dưới dạng base64
  },
  videoUrl: {
    type: String,
    required: [true, 'URL video không được để trống']
  },
  description: {
    type: String,
    required: [true, 'Mô tả không được để trống']
  },
  frequency: {
    sets: {
      type: Number,
      default: 0
    },
    reps: {
      type: Number,
      default: 0
    },
    rest: {
      type: Number, // Thời gian nghỉ (giây)
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Exercise', exerciseSchema);