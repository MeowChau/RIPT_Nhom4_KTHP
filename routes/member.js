const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Lấy danh sách hội viên
router.get('/', memberController.getAllMembers);

// Lấy thông tin một hội viên
router.get('/:id', memberController.getMemberById);

// Thêm hội viên mới
router.post('/', memberController.createMember);

// Cập nhật hội viên
router.put('/:id', memberController.updateMember);

// Xóa hội viên
router.delete('/:id', memberController.deleteMember);

module.exports = router;