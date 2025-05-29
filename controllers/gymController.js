// controllers/gymController.js
const Gym = require('../models/Gym');

// GET gym theo ID
exports.getGymById = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }
    res.json(gym);  // Trả về trực tiếp đối tượng gym, không qua serializer
  } catch (error) {
    console.error('Error fetching gym details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT cập nhật gym 
exports.updateGym = async (req, res) => {
  try {
    const gym = await Gym.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }
    
    res.json(gym);  // Trả về trực tiếp đối tượng gym cập nhật
  } catch (error) {
    console.error('Lỗi khi cập nhật gym:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE xóa gym
exports.deleteGym = async (req, res) => {
  try {
    const gym = await Gym.findByIdAndDelete(req.params.id);
    
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }
    
    res.json({ message: 'Gym deleted successfully' });
  } catch (error) {
    console.error('Error deleting gym:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST tạo gym mới
exports.createGym = async (req, res) => {
  try {
    const newGym = new Gym(req.body);
    const savedGym = await newGym.save();
    res.status(201).json(savedGym);  // Trả về trực tiếp đối tượng gym mới tạo
  } catch (error) {
    console.error('Lỗi khi tạo gym mới:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// GET tất cả gym
exports.getAllGyms = async (req, res) => {
  try {
    const gyms = await Gym.find();
    res.json(gyms);  // Trả về trực tiếp mảng các đối tượng gym
  } catch (error) {
    console.error('Error fetching gyms:', error);
    res.status(500).json({ message: 'Server error' });
  }
};