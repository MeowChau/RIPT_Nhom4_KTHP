// routes/gym.js
const express = require('express');
const router = express.Router();
const gymController = require('../controllers/gymController');
const auth = require('../middleware/auth'); // Nếu bạn cần middleware xác thực

// GETs
router.get('/', gymController.getAllGyms);
router.get('/:id', gymController.getGymById);

// POST tạo gym mới
router.post('/', auth, gymController.createGym);

// PUT cập nhật gym
router.put('/:id', auth, gymController.updateGym);

// DELETE xóa gym
router.delete('/:id', auth, gymController.deleteGym);

module.exports = router;