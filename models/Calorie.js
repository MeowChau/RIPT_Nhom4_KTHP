const mongoose = require('mongoose');

const CalorieSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  date: {
    type: String,
    required: true
  },
  meals: {
    type: Number,
    default: 3
  },
  protein: {
    type: Number,
    required: true
  },
  carb: {
    type: Number,
    required: true
  },
  fat: {
    type: Number,
    required: true
  },
  caloTarget: {
    type: Number,
    required: true
  },
  totalCaloIntake: {
    type: Number
  },
  caloDiff: {
    type: Number
  }
}, {
  timestamps: true
});

// Middleware để tính toán totalCaloIntake và caloDiff trước khi lưu
CalorieSchema.pre('save', function(next) {
  this.totalCaloIntake = (this.protein * 4) + (this.carb * 4) + (this.fat * 9);
  this.caloDiff = this.totalCaloIntake - this.caloTarget;
  next();
});

const Calorie = mongoose.model('Calorie', CalorieSchema);
module.exports = Calorie;