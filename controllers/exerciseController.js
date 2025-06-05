const Exercise = require('../models/exerciseModel');

// Lấy danh sách tất cả bài tập
exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Lấy chi tiết một bài tập
exports.getExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy bài tập'
      });
    }
    
    res.status(200).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Thêm bài tập mới
exports.createExercise = async (req, res) => {
  try {
    const { name, type, image, videoUrl, description, frequency } = req.body;
    
    const exercise = await Exercise.create({
      name,
      type,
      image, // base64 string
      videoUrl,
      description,
      frequency: {
        sets: frequency.sets,
        reps: frequency.reps,
        rest: frequency.rest
      }
    });
    
    res.status(201).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Cập nhật bài tập
exports.updateExercise = async (req, res) => {
  try {
    const { name, type, image, videoUrl, description, frequency } = req.body;
    
    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type,
        image,
        videoUrl,
        description,
        frequency: {
          sets: frequency.sets,
          reps: frequency.reps,
          rest: frequency.rest
        },
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!exercise) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy bài tập'
      });
    }
    
    res.status(200).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Xóa bài tập
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy bài tập'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};