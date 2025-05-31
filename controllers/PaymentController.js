const MomoService = require('../services/MomoService');
const Payment = require('../models/Payment');
const momoConfig = require('../config/momo.config');

class PaymentController {
  // Hiển thị các gói thanh toán
  async getPaymentPlans(req, res) {
    try {
      return res.status(200).json({
        success: true,
        plans: momoConfig.paymentPlans
      });
    } catch (error) {
      console.error('Lỗi lấy danh sách gói:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Tạo liên kết thanh toán MoMo
  async createPaymentLink(req, res) {
    try {
      const { planId } = req.body;
      const userId = req.body.userId || null; // Có thể null nếu chưa đăng ký
      
      if (!planId) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn gói đăng ký'
        });
      }

      // Kiểm tra plan có tồn tại
      const plan = momoConfig.paymentPlans.find(p => p.id === planId);
      if (!plan) {
        return res.status(400).json({
          success: false,
          message: 'Gói không hợp lệ'
        });
      }

      // Tạo link thanh toán từ MoMo
      const paymentData = await MomoService.createPaymentRequest(userId, planId);
      
      // Lưu thông tin đơn hàng vào database
      await Payment.create({
        userId,
        planId,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        duration: paymentData.duration,
        status: 'pending'
      });

      return res.status(200).json({
        success: true,
        paymentUrl: paymentData.payUrl,
        orderId: paymentData.orderId
      });
    } catch (error) {
      console.error('Lỗi tạo link thanh toán:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi tạo link thanh toán'
      });
    }
  }

  // Xử lý callback từ MoMo (IPN)
  async handlePaymentNotification(req, res) {
    try {
      const verificationResult = MomoService.verifyIpnCallback(req.body);
      
      if (!verificationResult.isValid) {
        console.error('Thông báo thanh toán không hợp lệ:', verificationResult.message);
        return res.status(400).json({
          success: false,
          message: verificationResult.message
        });
      }

      const { orderId, transId, userId, planId, duration, amount } = verificationResult.data;
      
      // Cập nhật trạng thái thanh toán
      const payment = await Payment.findOne({ orderId });
      
      if (!payment) {
        console.error('Không tìm thấy thông tin thanh toán:', orderId);
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin thanh toán'
        });
      }

      // Cập nhật trạng thái thanh toán
      payment.status = 'completed';
      payment.transId = transId;
      payment.updatedAt = new Date();
      
      // Tính ngày hết hạn dựa vào thời hạn gói
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + duration);
      payment.expiresAt = expiresAt;
      
      await payment.save();
      
      return res.status(200).json({
        success: true,
        message: 'Xử lý thanh toán thành công'
      });
    } catch (error) {
      console.error('Lỗi xử lý thông báo thanh toán:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Kiểm tra trạng thái thanh toán
  async checkPaymentStatus(req, res) {
    try {
      const { orderId } = req.params;
      
      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp mã đơn hàng'
        });
      }

      const payment = await Payment.findOne({ orderId });
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông tin thanh toán'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          orderId: payment.orderId,
          status: payment.status,
          planId: payment.planId,
          amount: payment.amount,
          used: payment.used,
          createdAt: payment.createdAt
        }
      });
    } catch (error) {
      console.error('Lỗi kiểm tra trạng thái thanh toán:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }
}

module.exports = new PaymentController();