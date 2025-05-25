const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  day: { type: String, required: true }, // "Monday", "Tuesday", ...
  status: {
    type: String,
    enum: ['off', 'morning', 'afternoon', 'on'],
    default: 'off'
  }
});

const PersonalTrainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gymId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
   description: { type: String, required: true }, // Thêm trường description
  schedule: { type: [ScheduleSchema], default: [] }
});

module.exports = mongoose.model('PersonalTrainer', PersonalTrainerSchema);
