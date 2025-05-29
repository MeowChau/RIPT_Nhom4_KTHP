import { request } from 'umi';
import type { 
  ApiResponse, 
  ChatHistory, 
  GenerateResponse, 
  OllamaStatus, 
  AnalysisResponse, 
  UsageLimit 
} from '@/services/AI/typings';

const API_URL = '/api'; // Sử dụng proxy trong UmiJS

// Kiểm tra trạng thái Ollama
export async function checkOllamaStatus(): Promise<ApiResponse<OllamaStatus>> {
  try {
    return request(`${API_URL}/ai/status`, {
      method: 'GET',
      timeout: 10000, // Thêm timeout để tránh chờ quá lâu
      errorHandler: (error) => {
        console.error('Status check error:', error);
        return {
          success: false,
          message: 'Không thể kết nối đến máy chủ AI'
        };
      }
    });
  } catch (error) {
    console.error('Error checking Ollama status:', error);
    return { 
      success: false, 
      message: 'Không thể kiểm tra trạng thái Ollama'
    };
  }
}

// Gửi prompt đến AI và nhận phản hồi
export async function generateContent(
  userId: string,
  prompt: string,
  profile: string = 'general'
): Promise<ApiResponse<GenerateResponse>> {
  try {
    console.log('Calling AI generate with:', { userId, prompt, profile });
    
    return request(`${API_URL}/ai/generate`, {
      method: 'POST',
      headers: {
        'X-User-Id': userId,
        'Content-Type': 'application/json',
      },
      data: { prompt, profile },
      timeout: 30000, // AI có thể mất thời gian để phản hồi
      errorHandler: (error) => {
        console.error('Generate content error:', error);
        return {
          success: false,
          message: 'Không thể tạo nội dung AI'
        };
      }
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return { 
      success: false, 
      message: 'Không thể tạo nội dung AI'
    };
  }
}

// Phân tích dữ liệu
export async function analyzeData(
  userId: string,
  data: any
): Promise<ApiResponse<AnalysisResponse>> {
  try {
    return request(`${API_URL}/ai/analyze`, {
      method: 'POST',
      headers: {
        'X-User-Id': userId,
        'Content-Type': 'application/json',
      },
      data: { data },
      timeout: 30000, // Phân tích dữ liệu có thể mất nhiều thời gian
      errorHandler: (error) => {
        console.error('Analyze data error:', error);
        return {
          success: false,
          message: 'Không thể phân tích dữ liệu'
        };
      }
    });
  } catch (error) {
    console.error('Error analyzing data:', error);
    return { 
      success: false, 
      message: 'Không thể phân tích dữ liệu'
    };
  }
}

// Lấy lịch sử chat
export async function getChatHistory(
  userId: string,
  profile?: string
): Promise<ApiResponse<ChatHistory[]>> {
  try {
    return request(`${API_URL}/ai/history`, {
      method: 'GET',
      headers: {
        'X-User-Id': userId,
      },
      params: profile ? { profile } : {},
      errorHandler: (error) => {
        console.error('Get history error:', error);
        return {
          success: false,
          message: 'Không thể lấy lịch sử chat'
        };
      }
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return { 
      success: false, 
      message: 'Không thể lấy lịch sử chat'
    };
  }
}

// Lấy thông tin giới hạn sử dụng
export async function getUsageLimit(
  userId: string
): Promise<ApiResponse<UsageLimit>> {
  try {
    return request(`${API_URL}/ai/usage`, {
      method: 'GET',
      headers: {
        'X-User-Id': userId,
      },
      timeout: 10000,
      errorHandler: (error) => {
        console.error('Get usage limit error:', error);
        return {
          success: false,
          message: 'Không thể lấy thông tin giới hạn sử dụng'
        };
      }
    });
  } catch (error) {
    console.error('Error fetching usage limit:', error);
    return { 
      success: false, 
      message: 'Không thể lấy thông tin giới hạn sử dụng'
    };
  }
}