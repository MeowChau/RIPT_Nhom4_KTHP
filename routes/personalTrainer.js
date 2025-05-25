const express = require('express');
const router = express.Router();
const PersonalTrainer = require('../models/PersonalTrainer');

// Lấy danh sách PT theo gymId
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.gymId) {
      filter.gymId = req.query.gymId;
    }
    const pts = await PersonalTrainer.find(filter).populate('gymId');
    res.json(pts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Tạo mới PT
router.post('/', async (req, res) => {
  try {
    const { name, gymId, description, schedule } = req.body; // Lấy description từ request
    const pt = new PersonalTrainer({
      name,
      gymId,
      description, // Lưu mô tả vào cơ sở dữ liệu
      schedule,
    });
    const savedPT = await pt.save();
    res.status(201).json(savedPT);
  } catch (error) {
    console.error('POST /api/personalTrainers error:', error);
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});


// Cập nhật PT
router.put('/:id', async (req, res) => {
  try {
    const { name, gymId, description, schedule } = req.body; // Lấy description từ request
    const updatedPT = await PersonalTrainer.findByIdAndUpdate(
      req.params.id,
      { name, gymId, description, schedule },
      { new: true }
    );
    if (!updatedPT) return res.status(404).json({ message: 'PT not found' });
    res.json(updatedPT);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// Xóa PT
router.delete('/:id', async (req, res) => {
  try {
    const deletedPT = await PersonalTrainer.findByIdAndDelete(req.params.id);
    if (!deletedPT) return res.status(404).json({ message: 'PT not found' });
    res.json({ message: 'PT deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
