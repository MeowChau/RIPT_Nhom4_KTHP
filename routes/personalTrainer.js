const express = require('express');
const router = express.Router();
const personalTrainerController = require('../controllers/personalTrainerController');

// Lấy danh sách PT
router.get('/', personalTrainerController.getAllTrainers);

// Lấy thông tin một PT
router.get('/:id', personalTrainerController.getTrainerById);

// Tạo mới PT
router.post('/', personalTrainerController.createTrainer);

// Cập nhật PT
router.put('/:id', personalTrainerController.updateTrainer);

// Xóa PT
router.delete('/:id', personalTrainerController.deleteTrainer);

module.exports = router;