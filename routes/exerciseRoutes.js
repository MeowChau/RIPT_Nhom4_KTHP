const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

router.route('/')
  .get(exerciseController.getAllExercises)
  .post(exerciseController.createExercise);

router.route('/:id')
  .get(exerciseController.getExercise)
  .put(exerciseController.updateExercise)
  .delete(exerciseController.deleteExercise);

module.exports = router;