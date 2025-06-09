const Calorie = require('../models/Calorie');
const mongoose = require('mongoose');

// Helper function để tính toán calories
const calculateCalories = (protein, carb, fat, caloTarget) => {
  const totalCaloIntake = (protein * 4) + (carb * 4) + (fat * 9);
  const caloDiff = totalCaloIntake - caloTarget;
  return { totalCaloIntake, caloDiff };
};

// Helper function để kiểm tra định dạng ngày
const isValidDate = (dateString) => {
  // Kiểm tra định dạng YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regex)) return false;

  // Kiểm tra ngày có hợp lệ không
  const date = new Date(dateString);
  if (!date.getTime() && date.getTime() !== 0) return false;
  return date.toISOString().slice(0, 10) === dateString;
};

// @desc    Tạo mới bản ghi calo
// @route   POST /api/calories
// @access  Public (tạm thời)
const createCalorieEntry = async (req, res) => {
  try {
    const { date, meals, protein, carb, fat, caloTarget } = req.body;
    
    // Sử dụng userId cố định cho mục đích test
    const userId = '65715a3c3764d76c4158cbc0'; // ID cố định cho test
    
    // Kiểm tra dữ liệu đầu vào
    if (!date || !protein || !carb || !fat || !caloTarget) {
      return res.status(400).json({
        status: 'error',
        message: 'Vui lòng cung cấp đầy đủ thông tin: date, protein, carb, fat, caloTarget'
      });
    }

    // Kiểm tra định dạng ngày
    if (!isValidDate(date)) {
      return res.status(400).json({
        status: 'error',
        message: 'Định dạng ngày không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM-DD'
      });
    }

    // Kiểm tra xem bản ghi cho ngày này đã tồn tại chưa
    const existingEntry = await Calorie.findOne({ userId, date });
    if (existingEntry) {
      return res.status(400).json({
        status: 'error',
        message: 'Bản ghi calo cho ngày này đã tồn tại. Hãy sử dụng PUT để cập nhật.'
      });
    }

    // Tính toán giá trị calo
    const { totalCaloIntake, caloDiff } = calculateCalories(protein, carb, fat, caloTarget);

    const calorieEntry = await Calorie.create({
      userId, // Sử dụng ID cố định
      date,
      meals: meals || 3, // Mặc định là 3 nếu không có
      protein,
      carb,
      fat,
      caloTarget,
      totalCaloIntake,
      caloDiff
    });

    res.status(201).json({
      status: 'success',
      data: calorieEntry
    });
  } catch (error) {
    console.error('Lỗi chi tiết:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Lỗi server',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Lấy tổng hợp hàng tuần
// @route   GET /api/calories/weekly-summary
// @access  Public (tạm thời)
const getWeeklySummary = async (req, res) => {
  try {
    // Sử dụng userId cố định cho mục đích test
    const userId = '65715a3c3764d76c4158cbc0'; // ID cố định cho test
    
    // Cho phép client chỉ định ngày kết thúc (mặc định là ngày hiện tại)
    let endDate = req.query.endDate || new Date().toISOString().split('T')[0];
    
    // Kiểm tra định dạng ngày hợp lệ
    if (!isValidDate(endDate)) {
      endDate = new Date().toISOString().split('T')[0]; // Reset về ngày hiện tại nếu không hợp lệ
    }
    
    // Tính ngày bắt đầu (6 ngày trước endDate)
    const endDateObj = new Date(endDate);
    const startDateObj = new Date(endDate);
    startDateObj.setDate(endDateObj.getDate() - 6);
    const startDate = startDateObj.toISOString().split('T')[0];

    // Truy vấn dữ liệu giữa các ngày này
    const weeklyData = await Calorie.find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 });

    // Nếu không có dữ liệu
    if (weeklyData.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'Không có dữ liệu cho khoảng thời gian được chọn',
        weeklyData: [],
        weeklySummary: {
          totalCaloIntake: 0,
          totalCaloTarget: 0,
          caloDiff: 0
        }
      });
    }

    // Định dạng phản hồi
    const formattedData = weeklyData.map(entry => ({
      date: entry.date,
      totalCaloIntake: entry.totalCaloIntake,
      caloTarget: entry.caloTarget,
      caloDiff: entry.caloDiff
    }));

    // Tính tổng hàng tuần
    const weeklySummary = {
      totalCaloIntake: weeklyData.reduce((sum, entry) => sum + entry.totalCaloIntake, 0),
      totalCaloTarget: weeklyData.reduce((sum, entry) => sum + entry.caloTarget, 0),
      caloDiff: weeklyData.reduce((sum, entry) => sum + entry.caloDiff, 0)
    };

    res.status(200).json({
      status: 'success',
      weeklyData: formattedData,
      weeklySummary
    });
  } catch (error) {
    console.error('Lỗi chi tiết:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Lỗi server',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Cập nhật bản ghi calo cho một ngày cụ thể
// @route   PUT /api/calories/:date
// @access  Public (tạm thời)
const updateCalorieEntry = async (req, res) => {
  try {
    const { date } = req.params;
    const { protein, carb, fat, caloTarget, meals } = req.body;
    
    // Sử dụng userId cố định cho mục đích test
    const userId = '65715a3c3764d76c4158cbc0'; // ID cố định cho test

    // Kiểm tra định dạng ngày
    if (!isValidDate(date)) {
      return res.status(400).json({
        status: 'error',
        message: 'Định dạng ngày không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM-DD'
      });
    }

    // Tìm bản ghi
    const calorieEntry = await Calorie.findOne({ userId, date });
    
    if (!calorieEntry) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy bản ghi calo cho ngày này'
      });
    }

    // Cập nhật các trường
    if (protein !== undefined) calorieEntry.protein = protein;
    if (carb !== undefined) calorieEntry.carb = carb;
    if (fat !== undefined) calorieEntry.fat = fat;
    if (caloTarget !== undefined) calorieEntry.caloTarget = caloTarget;
    if (meals !== undefined) calorieEntry.meals = meals;

    // Tính toán giá trị mới
    const { totalCaloIntake, caloDiff } = calculateCalories(
      calorieEntry.protein, 
      calorieEntry.carb, 
      calorieEntry.fat, 
      calorieEntry.caloTarget
    );
    
    calorieEntry.totalCaloIntake = totalCaloIntake;
    calorieEntry.caloDiff = caloDiff;

    // Lưu bản ghi đã cập nhật
    await calorieEntry.save();

    res.status(200).json({
      status: 'success',
      data: calorieEntry
    });
  } catch (error) {
    console.error('Lỗi chi tiết:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Lỗi server',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = {
  createCalorieEntry,
  getWeeklySummary,
  updateCalorieEntry
};