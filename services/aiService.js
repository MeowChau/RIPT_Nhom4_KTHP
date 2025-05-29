const fetch = require('node-fetch');
require('dotenv').config();
const ChatHistory = require('../models/chatHistory');

// Khởi tạo map để theo dõi số lượt sử dụng API của user
const userUsageCounter = new Map();

// Cấu hình Ollama
const OLLAMA_ENDPOINT = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434/api';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

/**
 * Gọi Ollama API để tạo văn bản
 * @param {string} prompt - Yêu cầu từ người dùng
 * @param {string} systemPrompt - Prompt hệ thống
 * @returns {Promise<string>} - Phản hồi từ mô hình
 */
async function callOllamaAPI(prompt, systemPrompt = '') {
  try {
    // Kết hợp system prompt và user prompt
    const fullPrompt = systemPrompt 
      ? `${systemPrompt}\n\nUser: ${prompt}\n\nAssistant: `
      : `${prompt}\n\nAssistant: `;
    
    // Gọi Ollama API
    console.log('Calling Ollama with prompt:', fullPrompt.substring(0, 100) + '...');
    
    const response = await fetch(`${OLLAMA_ENDPOINT}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        prompt: fullPrompt,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama API error: ${error}`);
    }

    const data = await response.json();
    console.log('Ollama response received, length:', data.response?.length || 0);
    return data.response;
  } catch (error) {
    console.error('Lỗi khi gọi Ollama API:', error);
    return `Không thể kết nối với Ollama. Vui lòng đảm bảo Ollama đang chạy và bạn đã tải mô hình ${DEFAULT_MODEL}. Chi tiết lỗi: ${error.message}`;
  }
}

/**
 * Lấy số lần sử dụng AI của người dùng trong ngày
 * @param {string} userId - ID người dùng 
 * @returns {number} - Số lần đã sử dụng
 */
function getUserUsageCount(userId) {
  const today = new Date().toISOString().split('T')[0];
  const userKey = `${userId}:${today}`;
  
  return userUsageCounter.has(userKey) ? userUsageCounter.get(userKey) : 0;
}

/**
 * Kiểm tra và cập nhật số lần gọi API của người dùng
 * @param {string} userId - ID người dùng
 * @returns {boolean} - true nếu người dùng chưa vượt quá giới hạn
 */
function checkUserRateLimit(userId) {
  const today = new Date().toISOString().split('T')[0];
  const userKey = `${userId}:${today}`;
  
  if (!userUsageCounter.has(userKey)) {
    userUsageCounter.set(userKey, 0);
  }
  
  const currentCount = userUsageCounter.get(userKey);
  if (currentCount >= 30) {  // Giới hạn cao hơn vì là local
    return false;
  }
  
  userUsageCounter.set(userKey, currentCount + 1);
  return true;
}

/**
 * Kiểm tra nội dung không phù hợp
 * @param {string} content - Nội dung cần kiểm tra
 * @returns {boolean} - true nếu nội dung an toàn
 */
function filterInappropriateContent(content) {
  const inappropriateTerms = [
    'sex', 'khiêu dâm', 'cờ bạc', 'ma túy', 'vũ khí', 
    'bạo lực', 'tự tử', 'giết người', 'khỏa thân',
    'porn', 'nude', 'gambling', 'drugs', 'weapons',
    'violence', 'suicide', 'kill'
  ];
  
  const lowerContent = content.toLowerCase();
  return !inappropriateTerms.some(term => lowerContent.includes(term));
}

/**
 * Tạo nội dung dựa trên prompt với profile cụ thể
 * @param {string} userId - ID người dùng
 * @param {string} prompt - Yêu cầu từ người dùng
 * @param {string} profile - Loại profile AI (general, nutrition, fitness...)
 * @returns {Promise<Object>} - Nội dung được tạo và thông tin phụ
 */
async function generateContent(userId, prompt, profile = 'general') {
  // Kiểm tra giới hạn sử dụng
  if (!checkUserRateLimit(userId)) {
    throw new Error('Bạn đã vượt quá giới hạn 30 lần sử dụng AI trong ngày');
  }
  
  // Kiểm tra nội dung không phù hợp
  if (!filterInappropriateContent(prompt)) {
    throw new Error('Câu hỏi chứa nội dung không phù hợp. Vui lòng điều chỉnh');
  }

  try {
    // Lấy tiền tố dựa trên profile
    let systemPrompt;
    switch (profile) {
      case 'nutrition':
        systemPrompt = "Bạn là chuyên gia dinh dưỡng cho phòng gym, chỉ tư vấn về chế độ ăn uống lành mạnh, dinh dưỡng thể thao và hỗ trợ mục tiêu tập luyện. Bạn không được đưa ra lời khuyên y tế. Bạn luôn khuyến khích người dùng tham khảo ý kiến bác sĩ cho các vấn đề sức khỏe.";
        break;
      case 'fitness':
        systemPrompt = "Bạn là huấn luyện viên thể hình chuyên nghiệp, tư vấn về bài tập, kỹ thuật tập luyện đúng, lịch tập, và phương pháp phát triển cơ bắp, sức bền, linh hoạt. Bạn ưu tiên an toàn và tránh đưa ra lời khuyên có thể gây chấn thương.";
        break;
      case 'health':
        systemPrompt = "Bạn là cố vấn sức khỏe thể chất, cung cấp thông tin về lối sống lành mạnh, cân bằng tập luyện và nghỉ ngơi, quản lý stress. Bạn không đưa ra chẩn đoán y tế nhưng có thể giải thích các khái niệm sức khỏe cơ bản liên quan đến tập luyện.";
        break;
      default:
        systemPrompt = "Bạn là trợ lý AI hữu ích cho phòng gym. Bạn tập trung vào các chủ đề liên quan đến tập luyện, dinh dưỡng, và lối sống lành mạnh. Tránh đưa ra lời khuyên y tế chuyên sâu.";
    }
    
    // Lấy lịch sử chat của người dùng
    let chatHistory;
    try {
      chatHistory = await ChatHistory.findOne({ 
        userId: userId,
        aiProfile: profile 
      }).sort({ updatedAt: -1 });
    } catch (dbError) {
      console.error('Lỗi khi truy vấn lịch sử chat:', dbError);
      // Tiếp tục mà không có lịch sử
    }
    
    // Gọi Ollama API
    const aiResponse = await callOllamaAPI(prompt, systemPrompt);
    
    // Lưu lịch sử hội thoại
    try {
      if (!chatHistory) {
        chatHistory = new ChatHistory({
          userId,
          aiProfile: profile,
          messages: [
            { role: 'user', content: prompt },
            { role: 'assistant', content: aiResponse }
          ]
        });
      } else {
        chatHistory.messages.push({ role: 'user', content: prompt });
        chatHistory.messages.push({ role: 'assistant', content: aiResponse });
        chatHistory.updatedAt = Date.now();
      }
      
      await chatHistory.save();
    } catch (saveError) {
      console.error('Lỗi khi lưu lịch sử chat:', saveError);
      // Tiếp tục mà không lưu lịch sử
    }
    
    return {
      content: aiResponse,
      usageCount: getUserUsageCount(userId),
      maxUsage: 30,
      local: true
    };
  } catch (error) {
    console.error('Lỗi khi tạo nội dung AI:', error);
    throw new Error('Không thể tạo nội dung AI: ' + error.message);
  }
}

/**
 * Phân tích dữ liệu và tạo báo cáo
 * @param {string} userId - ID người dùng
 * @param {Object} data - Dữ liệu cần phân tích
 * @returns {Promise<Object>} - Báo cáo phân tích và thông tin phụ
 */
async function analyzeData(userId, data) {
  // Kiểm tra giới hạn sử dụng
  if (!checkUserRateLimit(userId)) {
    throw new Error('Bạn đã vượt quá giới hạn 30 lần sử dụng AI trong ngày');
  }
  
  try {
    const prompt = `Phân tích dữ liệu sau và đưa ra các insights hữu ích về hiệu suất phòng gym và xu hướng thành viên: ${JSON.stringify(data)}`;
    
    // Sử dụng systemPrompt cho phân tích dữ liệu
    const systemPrompt = "Bạn là một chuyên gia phân tích dữ liệu cho phòng gym. Tập trung vào các chỉ số như tỷ lệ duy trì thành viên, xu hướng đăng ký, doanh thu, và mức độ tham gia lớp học.";
    
    // Gọi Ollama API
    const analysis = await callOllamaAPI(prompt, systemPrompt);

    // Lưu vào lịch sử
    try {
      const chatHistory = new ChatHistory({
        userId,
        aiProfile: 'analysis',
        messages: [
          { role: 'user', content: prompt },
          { role: 'assistant', content: analysis }
        ]
      });
      
      await chatHistory.save();
    } catch (saveError) {
      console.error('Lỗi khi lưu lịch sử phân tích:', saveError);
    }
    
    return {
      analysis: analysis,
      usageCount: getUserUsageCount(userId),
      maxUsage: 30
    };
  } catch (error) {
    console.error('Lỗi khi phân tích dữ liệu:', error);
    throw new Error('Không thể phân tích dữ liệu: ' + error.message);
  }
}

/**
 * Lấy lịch sử chat của người dùng
 * @param {string} userId - ID người dùng
 * @param {string} profile - Loại profile AI (tùy chọn)
 * @returns {Promise<Array>} - Danh sách cuộc trò chuyện
 */
async function getChatHistory(userId, profile = null) {
  try {
    const query = { userId };
    if (profile) {
      query.aiProfile = profile;
    }
    
    return await ChatHistory.find(query)
      .sort({ updatedAt: -1 })
      .select('aiProfile messages createdAt updatedAt');
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử chat:', error);
    throw new Error('Không thể lấy lịch sử chat');
  }
}

/**
 * Kiểm tra Ollama có đang chạy không
 * @returns {Promise<Object>} - Thông tin trạng thái
 */
async function isOllamaRunning() {
  try {
    const response = await fetch(`${OLLAMA_ENDPOINT}/tags`);
    if (response.ok) {
      const data = await response.json();
      return { 
        running: true,
        models: data.models?.map(m => m.name) || []
      };
    }
    return { running: false, models: [] };
  } catch (error) {
    return { running: false, error: error.message };
  }
}

module.exports = {
  generateContent,
  analyzeData,
  getChatHistory,
  getUserUsageCount,
  isOllamaRunning
};