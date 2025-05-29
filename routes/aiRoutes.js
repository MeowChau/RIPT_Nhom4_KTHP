const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const auth = require('../middleware/auth');

// Route kiểm tra tình trạng Ollama - không cần xác thực
router.get('/status', async (req, res) => {
  try {
    const status = await aiService.isOllamaRunning();
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể kiểm tra trạng thái Ollama'
    });
  }
});

// Route test không cần xác thực
router.post('/test', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: 'Yêu cầu cần có prompt'
      });
    }
    
    // Sử dụng một ID giả cho test
    const testUserId = '65432100000000000000000a';
    
    const result = await aiService.generateContent(testUserId, prompt, 'general');
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Lỗi API test:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Route tạo nội dung - cần đăng nhập
router.post('/generate', auth, async (req, res) => {
  try {
    const { prompt, profile = 'general' } = req.body;
    const userId = req.user.id; // Lấy từ middleware auth
    
    if (!prompt) {
      return res.status(400).json({ 
        success: false,
        message: 'Yêu cầu cần có prompt' 
      });
    }
    
    const result = await aiService.generateContent(userId, prompt, profile);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Lỗi API tạo nội dung:', error);
    res.status(error.message.includes('giới hạn') ? 429 : 500)
       .json({ 
         success: false,
         message: error.message 
       });
  }
});

// Route phân tích dữ liệu - cần đăng nhập
router.post('/analyze', auth, async (req, res) => {
  try {
    const { data } = req.body;
    const userId = req.user.id;
    
    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Yêu cầu cần có dữ liệu để phân tích'
      });
    }
    
    const result = await aiService.analyzeData(userId, data);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Lỗi API phân tích dữ liệu:', error);
    res.status(error.message.includes('giới hạn') ? 429 : 500)
       .json({
         success: false,
         message: error.message
       });
  }
});

// Lấy lịch sử chat
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { profile } = req.query;
    
    const history = await aiService.getChatHistory(userId, profile);
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử chat:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Không thể lấy lịch sử chat' 
    });
  }
});

// Lấy số lần sử dụng còn lại trong ngày
router.get('/usage', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const currentUsage = {
      current: aiService.getUserUsageCount(userId) || 0,
      max: 30  // Tăng lên 30 vì là local
    };
    
    res.json({
      success: true,
      data: currentUsage
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin sử dụng:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Không thể lấy thông tin sử dụng' 
    });
  }
});

module.exports = router;