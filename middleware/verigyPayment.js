const Payment = require('../models/Payment');
const momoConfig = require('../config/momo.config');

// Middleware xác minh thanh toán trước khi đăng ký
const verifyPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mã đơn hàng thanh toán'
      });
    }

    // Kiểm tra thanh toán trong database
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin thanh toán'
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Thanh toán chưa hoàn tất, vui lòng thanh toán để tiếp tục đăng ký'
      });
    }

    // Kiểm tra xem thanh toán đã được sử dụng để đăng ký chưa
    if (payment.used) {
      return res.status(400).json({
        success: false,
        message: 'Thanh toán này đã được sử dụng để đăng ký tài khoản'
      });
    }

    // Tìm thông tin gói từ cấu hình
    const plan = momoConfig.paymentPlans.find(p => p.id === payment.planId);
    
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy thông tin gói đăng ký'
      });
    }

    // Thêm thông tin thanh toán và gói vào request để sử dụng trong controller
    req.payment = {
      id: payment._id,
      planId: payment.planId,
      orderId: payment.orderId,
      amount: payment.amount,
      duration: payment.duration,
      planName: plan.name,
      expiresAt: payment.expiresAt || new Date(Date.now() + payment.duration * 30 * 24 * 60 * 60 * 1000)
    };

    next();
  } catch (error) {
    console.error('Lỗi xác minh thanh toán:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi xác minh thanh toán'
    });
  }
};

module.exports = verifyPayment;