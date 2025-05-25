const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');

// GET all exercises
router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// POST a new exercise
router.post('/', async (req, res) => {
  try {
    const newExercise = new Exercise(req.body);
    const savedExercise = await newExercise.save();
    res.status(201).json(savedExercise);
  } catch (error) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error });
  }
});

// PUT update an exercise by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExercise) return res.status(404).json({ message: 'Bài tập không tìm thấy' });
    res.json(updatedExercise);
  } catch (error) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error });
  }
});

// DELETE an exercise by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedExercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!deletedExercise) return res.status(404).json({ message: 'Bài tập không tìm thấy' });
    res.json({ message: 'Bài tập đã bị xóa' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
});

module.exports = router;
