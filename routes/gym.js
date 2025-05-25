const express = require('express');
const router = express.Router();
const Gym = require('../models/Gym');

// GET all gyms
router.get('/', async (req, res) => {
  try {
    const gyms = await Gym.find();
    res.json(gyms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const gym = new Gym(req.body);
    const savedGym = await gym.save();
    res.status(201).json(savedGym);
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    console.error('Lỗi khi tạo gym:', error);
    res.status(500).json({ message: 'Hệ thống đang cập nhật. Vui lòng thử lại sau', detail: error.message });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const updatedGym = await Gym.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedGym) return res.status(404).json({ message: 'Gym not found' });
    res.json(updatedGym);
  } catch (error) {
    console.error('Lỗi khi cập nhật gym:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    res.status(400).json({ message: 'Invalid data' });
  }
});
// GET gym by ID - cần thêm route này nếu chưa có
router.get('/:id', async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }
    res.json(gym);
  } catch (error) {
    console.error('Error fetching gym details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// DELETE gym by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedGym = await Gym.findByIdAndDelete(req.params.id);
    if (!deletedGym) return res.status(404).json({ message: 'Gym not found' });
    res.json({ message: 'Gym deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
