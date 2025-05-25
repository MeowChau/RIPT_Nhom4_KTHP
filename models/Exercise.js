const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  image: { type: String },
  youtube: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Exercise', ExerciseSchema);
