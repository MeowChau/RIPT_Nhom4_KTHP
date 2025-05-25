const express = require('express');
const router = express.Router();
const Gym = require('../models/Gym');
const Member = require('../models/Member');
const PersonalTrainer = require('../models/PersonalTrainer');
const Payment = require('../models/Payment');

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

// API số hội viên theo cơ sở
router.get('/members-by-gym', async (req, res) => {
  try {
    const data = await Member.aggregate([
      // Bỏ filter status nếu chưa có hoặc chưa chuẩn xác
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
          _id: 0,
          gymName: '$gym.name',
          count: 1
        }
      }
    ]);
    console.log('Members by gym:', data);
    res.json(data);
  } catch (error) {
    console.error('Error in /members-by-gym:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API số PT theo cơ sở
router.get('/pts-by-gym', async (req, res) => {
  try {
    const data = await PersonalTrainer.aggregate([
      // Bỏ filter status nếu chưa có hoặc chưa chuẩn xác
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
          _id: 0,
          gymName: '$gym.name',
          count: 1
        }
      }
    ]);
    console.log('PTs by gym:', data);
    res.json(data);
  } catch (error) {
    console.error('Error in /pts-by-gym:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API số lượng hội viên còn hoạt động theo cơ sở
router.get('/active-members-by-gym', async (req, res) => {
  try {
    const now = new Date();
    const data = await Member.aggregate([
      { $match: { endDate: { $gte: now } } },   // Lọc hội viên còn hoạt động theo endDate
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
          _id: 0,
          gymId: '$_id',
          gymName: '$gym.name',
          activeCount: 1
        }
      }
    ]);

    res.json(data);
  } catch (error) {
    console.error('Error in /active-members-by-gym:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
