const express = require('express');
const router = express.Router();
const Gym = require('../models/Gym');
const Member = require('../models/Member');
const PersonalTrainer = require('../models/PersonalTrainer');
const Payment = require('../models/Payment');
const ExcelJS = require('exceljs'); // Thêm thư viện ExcelJS

// API thống kê tổng quan
router.get('/summary', async (req, res) => {
  try {
    const gymCount = await Gym.countDocuments();
    const memberCount = await Member.countDocuments();
    const ptCount = await PersonalTrainer.countDocuments();
    
    const totalEquipment = await Gym.aggregate([
      { $unwind: '$equipment' },
      { $group: { _id: null, total: { $sum: '$equipment.quantity' } } }
    ]);
    
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    console.log('Summary:', { gymCount, memberCount, ptCount, totalEquipment, totalRevenue });
    
    res.json({
      gyms: gymCount,
      members: memberCount,
      personalTrainers: ptCount,
      totalEquipment: totalEquipment[0]?.total || 0,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Error in /summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/members-by-gym', async (req, res) => {
  try {
    const membersByGym = await Member.aggregate([
      { $group: { _id: '$gymId', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'gyms',
          localField: '_id',
          foreignField: '_id',
          as: 'gym'
        }
      },
      { $unwind: '$gym' },
      {
        $project: {
          gymName: '$gym.name',
          count: 1
        }
      }
    ]);
    
    res.json(membersByGym);
  } catch (error) {
    console.error('Error in /members-by-gym:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API lấy số lượng PT theo cơ sở
router.get('/pts-by-gym', async (req, res) => {
  try {
    const ptsByGym = await PersonalTrainer.aggregate([
      { $group: { _id: '$gymId', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'gyms',
          localField: '_id',
          foreignField: '_id',
          as: 'gym'
        }
      },
      { $unwind: '$gym' },
      {
        $project: {
          gymName: '$gym.name',
          count: 1
        }
      }
    ]);
    
    res.json(ptsByGym);
  } catch (error) {
    console.error('Error in /pts-by-gym:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API lấy số lượng hội viên còn hoạt động theo cơ sở
router.get('/active-members-by-gym', async (req, res) => {
  try {
    const now = new Date();
    const activeMembersByGym = await Member.aggregate([
      { $match: { endDate: { $gte: now } } }, // Lọc chỉ lấy hội viên còn hoạt động (endDate > ngày hiện tại)
      { $group: { _id: '$gymId', activeCount: { $sum: 1 } } },
      {
        $lookup: {
          from: 'gyms',
          localField: '_id',
          foreignField: '_id',
          as: 'gym'
        }
      },
      { $unwind: '$gym' },
      {
        $project: {
          gymName: '$gym.name',
          activeCount: 1
        }
      }
    ]);
    
    res.json(activeMembersByGym);
  } catch (error) {
    console.error('Error in /active-members-by-gym:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API xuất báo cáo tổng quan dạng Excel
router.get('/export-overview', async (req, res) => {
  try {
    // Lấy dữ liệu tổng quan
    const gymCount = await Gym.countDocuments();
    const memberCount = await Member.countDocuments();
    const ptCount = await PersonalTrainer.countDocuments();
    
    const totalEquipment = await Gym.aggregate([
      { $unwind: '$equipment' },
      { $group: { _id: null, total: { $sum: '$equipment.quantity' } } }
    ]);
    
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Lấy dữ liệu hội viên theo phòng gym
    const membersByGym = await Member.aggregate([
      { $group: { _id: '$gymId', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'gyms',
          localField: '_id',
          foreignField: '_id',
          as: 'gym'
        }
      },
      { $unwind: '$gym' },
      {
        $project: {
          gymName: '$gym.name',
          count: 1
        }
      }
    ]);

    // Lấy dữ liệu PT theo phòng gym
    const ptsByGym = await PersonalTrainer.aggregate([
      { $group: { _id: '$gymId', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'gyms',
          localField: '_id',
          foreignField: '_id',
          as: 'gym'
        }
      },
      { $unwind: '$gym' },
      {
        $project: {
          gymName: '$gym.name',
          count: 1
        }
      }
    ]);

    // Lấy dữ liệu hội viên hoạt động theo phòng gym
    const now = new Date();
    const activeMembersByGym = await Member.aggregate([
      { $match: { endDate: { $gte: now } } },
      { $group: { _id: '$gymId', activeCount: { $sum: 1 } } },
      {
        $lookup: {
          from: 'gyms',
          localField: '_id',
          foreignField: '_id',
          as: 'gym'
        }
      },
      { $unwind: '$gym' },
      {
        $project: {
          gymName: '$gym.name',
          activeCount: 1
        }
      }
    ]);

    // Tạo workbook và worksheet Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Báo cáo tổng quan');

    // Tạo header và styling
    worksheet.columns = [
      { header: 'Chỉ số', key: 'metric', width: 25 },
      { header: 'Giá trị', key: 'value', width: 15 }
    ];

    // Style cho header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };

    // Thêm dữ liệu tổng quan
    worksheet.addRow({ metric: 'Tổng số cơ sở', value: gymCount });
    worksheet.addRow({ metric: 'Tổng số hội viên', value: memberCount });
    worksheet.addRow({ metric: 'Tổng số huấn luyện viên', value: ptCount });
    worksheet.addRow({ metric: 'Tổng số thiết bị', value: totalEquipment[0]?.total || 0 });
    worksheet.addRow({ metric: 'Tổng doanh thu', value: totalRevenue[0]?.total || 0 });

    // Thêm worksheet mới cho dữ liệu chi tiết
    const membersByGymSheet = workbook.addWorksheet('Hội viên theo cơ sở');
    membersByGymSheet.columns = [
      { header: 'Cơ sở', key: 'gymName', width: 25 },
      { header: 'Số lượng hội viên', key: 'count', width: 20 }
    ];
    membersByGymSheet.getRow(1).font = { bold: true };
    membersByGymSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    membersByGym.forEach(item => {
      membersByGymSheet.addRow({ gymName: item.gymName, count: item.count });
    });

    // Worksheet cho PT theo cơ sở
    const ptsByGymSheet = workbook.addWorksheet('PT theo cơ sở');
    ptsByGymSheet.columns = [
      { header: 'Cơ sở', key: 'gymName', width: 25 },
      { header: 'Số lượng huấn luyện viên', key: 'count', width: 25 }
    ];
    ptsByGymSheet.getRow(1).font = { bold: true };
    ptsByGymSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    ptsByGym.forEach(item => {
      ptsByGymSheet.addRow({ gymName: item.gymName, count: item.count });
    });

    // Worksheet cho hội viên đang hoạt động
    const activeMembersSheet = workbook.addWorksheet('Hội viên đang hoạt động');
    activeMembersSheet.columns = [
      { header: 'Cơ sở', key: 'gymName', width: 25 },
      { header: 'Số hội viên đang hoạt động', key: 'activeCount', width: 25 }
    ];
    activeMembersSheet.getRow(1).font = { bold: true };
    activeMembersSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    activeMembersByGym.forEach(item => {
      activeMembersSheet.addRow({ gymName: item.gymName, activeCount: item.activeCount });
    });

    // Xuất file Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=BaoCaoTongQuan.xlsx');

    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error in /export-overview:', error);
    res.status(500).json({ message: 'Server error during export' });
  }
});

module.exports = router;