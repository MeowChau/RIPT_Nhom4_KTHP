const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  day: { type: String, required: true }, // "Monday", "Tuesday", ...
  status: {
    type: String,
    enum: ['off', 'morning', 'afternoon', 'on'],
    default: 'off'
  }
}, { _id: false });

const PersonalTrainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gymId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
  description: { type: String, required: true },
  image: { type: String }, // Thêm trường ảnh
  schedule: { type: [ScheduleSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('PersonalTrainer', PersonalTrainerSchema);