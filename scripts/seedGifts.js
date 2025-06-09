const mongoose = require('mongoose');
const Gift = require('../models/Gift');

const gifts = [
  { type: '1thang', name: 'Giảm 10% gói tập 1 tháng', description: 'Đổi 100 điểm lấy mã giảm 10% cho gói tập 1 tháng.', quantity: 100, pointRequired: 100, discountPercent: 10 },
  { type: '3thang', name: 'Giảm 20% gói tập 3 tháng', description: 'Đổi 200 điểm lấy mã giảm 20% cho gói tập 3 tháng.', quantity: 100, pointRequired: 200, discountPercent: 20 },
  { type: 'gangtay', name: 'Tặng găng tay tập gym', description: 'Đổi 1000 điểm nhận 1 đôi găng tay tập gym.', quantity: 50, pointRequired: 1000 },
  { type: 'whey', name: 'Tặng hũ whey protein', description: 'Đổi 5000 điểm nhận 1 hũ whey protein.', quantity: 10, pointRequired: 5000 }
];

async function seed() {
  await mongoose.connect('mongodb+srv://nminhchaudev:nminhchaudev@cluster0.dohl7d1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });
  await Gift.deleteMany({});
  await Gift.insertMany(gifts);
  console.log('Seeded gifts successfully!');
  process.exit();
}

seed(); 