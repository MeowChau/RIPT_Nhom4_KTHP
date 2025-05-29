const PersonalTrainer = require('../models/PersonalTrainer');

// Lấy danh sách PT theo gymId
exports.getAllTrainers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.gymId) {
      filter.gymId = req.query.gymId;
    }
    const pts = await PersonalTrainer.find(filter).populate('gymId');
    res.json(pts);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Lấy thông tin PT theo ID
exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await PersonalTrainer.findById(req.params.id).populate('gymId');
    if (!trainer) {
      return res.status(404).json({ message: 'PT not found' });
    }
    res.json(trainer);
  } catch (error) {
    console.error('Error fetching trainer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Tạo mới PT
exports.createTrainer = async (req, res) => {
  try {
    const { name, gymId, description, schedule, image } = req.body;
    
    // Tạo PT mới với trường ảnh nếu có
    const pt = new PersonalTrainer({
      name,
      gymId,
      description,
      schedule,
      ...(image && { image }) // Thêm trường image nếu có
    });
    
    const savedPT = await pt.save();
    res.status(201).json(savedPT);
  } catch (error) {
    console.error('Error creating trainer:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Cập nhật PT
exports.updateTrainer = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    const updatedPT = await PersonalTrainer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedPT) {
      return res.status(404).json({ message: 'PT not found' });
    }
    
    res.json(updatedPT);
  } catch (error) {
    console.error('Error updating trainer:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors: error.errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Xóa PT
exports.deleteTrainer = async (req, res) => {
  try {
    const deletedPT = await PersonalTrainer.findByIdAndDelete(req.params.id);
    
    if (!deletedPT) {
      return res.status(404).json({ message: 'PT not found' });
    }
    
    res.json({ message: 'PT deleted successfully' });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};