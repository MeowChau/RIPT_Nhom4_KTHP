const express = require('express');
const router = express.Router();
const { 
  createCalorieEntry, 
  getWeeklySummary,
  updateCalorieEntry
} = require('../controllers/calorieController');

// Routes không sử dụng middleware và userId
router.post('/', createCalorieEntry);
router.get('/weekly-summary', getWeeklySummary);
router.put('/:date', updateCalorieEntry);

module.exports = router;