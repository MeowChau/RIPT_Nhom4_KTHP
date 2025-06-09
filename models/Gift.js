const mongoose = require('mongoose');
const GiftSchema = new mongoose.Schema({
  type: String,
  name: String,
  description: String,
  quantity: Number,
  pointRequired: Number,
  discountPercent: Number,
  image: String,
});
module.exports = mongoose.model('Gift', GiftSchema); 