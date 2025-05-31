const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/memberController');
const PaymentController = require('../controllers/PaymentController');
const verifyPayment = require('../middleware/verifyPayment');

// API lấy danh sách gói thanh toán
router.get('/plans', PaymentController.getPaymentPlans);

// API tạo link thanh toán (không cần đăng nhập)
router.post('/create', PaymentController.createPaymentLink);

// API kiểm tra trạng thái thanh toán
router.get('/status/:orderId', PaymentController.checkPaymentStatus);

// API đăng ký thành viên (yêu cầu xác minh thanh toán)
router.post('/register', verifyPayment, MemberController.register);

module.exports = router;