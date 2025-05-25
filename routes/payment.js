// payment.js - Backend

const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// Lấy lịch sử giao dịch
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.gymId) filter.gymId = req.query.gymId;
    if (req.query.memberId) filter.memberId = req.query.memberId;

    const payments = await Payment.find(filter);

    // Định nghĩa giá của các gói tập
    const membershipPricing = {
      '1 month': 500,
      '3 months': 1000,
      '6 months': 1500,
      '12 months': 2000,
    };

    // Tính toán Doanh thu, Chi phí và Lợi nhuận
    const paymentsWithRevenueAndExpenses = payments.map(payment => {
      const membershipCost = membershipPricing[payment.package]; // Lấy giá trị từ membershipPricing
      if (!membershipCost) return payment; // Nếu gói không có trong pricing thì bỏ qua

      const revenue = membershipCost * payment.amount;  // Tính doanh thu từ số lượng hội viên
      const expenses = payment.rent + payment.salaries + payment.maintenance + payment.marketing; // Tổng chi phí
      const profit = revenue - expenses; // Tính lợi nhuận

      return {
        ...payment.toObject(),
        revenue,
        expenses,
        profit
      };
    });

    res.json(paymentsWithRevenueAndExpenses);  // Trả về thanh toán có doanh thu, chi phí và lợi nhuận
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
