import type { Effect, ImmerReducer, Subscription } from 'umi';
import { 
  checkOllamaStatus,
  generateContent,
  analyzeData,
  getChatHistory,
  getUsageLimit
} from '@/services/AI/index';
import { message } from 'antd';
import type { ChatHistory, Message, OllamaStatus, UsageLimit } from '@/services/AI/typings';

export interface AiModelState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  ollamaStatus: OllamaStatus | null;
  usageLimit: UsageLimit | null;
  chatHistories: ChatHistory[];
  selectedProfile: string;
}

export interface AiModelType {
  namespace: 'ai';
  state: AiModelState;
  effects: {
    checkStatus: Effect;
    fetchChatHistory: Effect;
    sendMessage: Effect;
    analyzeData: Effect;
    fetchUsageLimit: Effect;
    changeProfile: Effect;
  };
  reducers: {
    setLoading: ImmerReducer<AiModelState>;
    setOllamaStatus: ImmerReducer<AiModelState>;
    setUsageLimit: ImmerReducer<AiModelState>;
    setChatHistories: ImmerReducer<AiModelState>;
    appendUserMessage: ImmerReducer<AiModelState>;
    appendAssistantMessage: ImmerReducer<AiModelState>;
    setError: ImmerReducer<AiModelState>;
    clearError: ImmerReducer<AiModelState>;
    setSelectedProfile: ImmerReducer<AiModelState>;
    clearMessages: ImmerReducer<AiModelState>;
  };
  subscriptions: { setup: Subscription };
}

const DEFAULT_USER_ID = '6831d5f3a7c426695dce161d'; // Chị Đào

const AiModel: AiModelType = {
  namespace: 'ai',
  
  state: {
    messages: [],
    isLoading: false,
    error: null,
    ollamaStatus: null,
    usageLimit: null,
    chatHistories: [],
    selectedProfile: 'general',
  },
  
  effects: {
    *checkStatus({ payload }, { call, put }): Generator<any, void, any> {
      yield put({ type: 'setLoading', payload: true });
      
      try {
        const response = yield call(checkOllamaStatus);
        
        if (response.success && response.data) {
          yield put({
            type: 'setOllamaStatus',
            payload: response.data,
          });
        } else {
          yield put({
            type: 'setError', 
            payload: response.message || 'Không thể kiểm tra trạng thái Ollama',
          });
        }
      } catch (error) {
        yield put({
          type: 'setError',
          payload: 'Đã xảy ra lỗi khi kiểm tra trạng thái Ollama',
        });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    
    *fetchChatHistory({ payload }, { call, put }): Generator<any, void, any> {
      const { userId = DEFAULT_USER_ID, profile } = payload || {};
      
      yield put({ type: 'setLoading', payload: true });
      
      try {
        const response = yield call(getChatHistory, userId, profile);
        
        if (response.success && response.data) {
          yield put({
            type: 'setChatHistories',
            payload: response.data,
          });
        } else {
          yield put({
            type: 'setError',
            payload: response.message || 'Không thể lấy lịch sử chat',
          });
        }
      } catch (error) {
        yield put({
          type: 'setError',
          payload: 'Đã xảy ra lỗi khi lấy lịch sử chat',
        });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    
    *sendMessage({ payload }, { call, put }): Generator<any, void, any> {
      const { userId = DEFAULT_USER_ID, prompt, profile = 'general' } = payload;
      
      yield put({ type: 'appendUserMessage', payload: prompt });
      yield put({ type: 'setLoading', payload: true });
      
      try {
        const response = yield call(generateContent, userId, prompt, profile);
        
        if (response.success && response.data) {
          yield put({
            type: 'appendAssistantMessage',
            payload: response.data.content,
          });
          
          yield put({
            type: 'setUsageLimit',
            payload: { 
              current: response.data.usageCount, 
              max: response.data.maxUsage 
            },
          });
        } else {
          yield put({
            type: 'setError',
            payload: response.message || 'Không thể tạo nội dung AI',
          });
        }
      } catch (error) {
        yield put({
          type: 'setError',
          payload: 'Đã xảy ra lỗi khi tạo nội dung AI',
        });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    
    *analyzeData({ payload }, { call, put }): Generator<any, string | null, any> {
      const { userId = DEFAULT_USER_ID, data } = payload;
      
      yield put({ type: 'setLoading', payload: true });
      
      try {
        const response = yield call(analyzeData, userId, data);
        
        if (response.success && response.data) {
          yield put({
            type: 'appendUserMessage',
            payload: 'Phân tích dữ liệu',
          });
          
          yield put({
            type: 'appendAssistantMessage',
            payload: response.data.analysis,
          });
          
          yield put({
            type: 'setUsageLimit',
            payload: { 
              current: response.data.usageCount, 
              max: response.data.maxUsage 
            },
          });
          
          return response.data.analysis;
        } else {
          yield put({
            type: 'setError',
            payload: response.message || 'Không thể phân tích dữ liệu',
          });
          return null;
        }
      } catch (error) {
        yield put({
          type: 'setError',
          payload: 'Đã xảy ra lỗi khi phân tích dữ liệu',
        });
        return null;
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    
    *fetchUsageLimit({ payload }, { call, put }): Generator<any, void, any> {
      const { userId = DEFAULT_USER_ID } = payload || {};
      
      yield put({ type: 'setLoading', payload: true });
      
      try {
        const response = yield call(getUsageLimit, userId);
        
        if (response.success && response.data) {
          yield put({
            type: 'setUsageLimit',
            payload: response.data,
          });
        } else {
          yield put({
            type: 'setError',
            payload: response.message || 'Không thể lấy thông tin giới hạn sử dụng',
          });
        }
      } catch (error) {
        yield put({
          type: 'setError',
          payload: 'Đã xảy ra lỗi khi lấy thông tin giới hạn sử dụng',
        });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    
    *changeProfile({ payload }, { put }): Generator<any, void, any> {
      const { profile } = payload;
      
      yield put({ type: 'clearMessages' });
      yield put({ type: 'setSelectedProfile', payload: profile });
      
      yield put({
        type: 'fetchChatHistory',
        payload: { profile },
      });
    },
  },
  
  reducers: {
    setLoading(state, { payload }) {
      state.isLoading = payload;
    },
    
    setOllamaStatus(state, { payload }) {
      state.ollamaStatus = payload;
    },
    
    setUsageLimit(state, { payload }) {
      state.usageLimit = payload;
    },
    
    setChatHistories(state, { payload }) {
      state.chatHistories = payload;
    },
    
    appendUserMessage(state, { payload }) {
      state.messages.push({
        role: 'user',
        content: payload
      });
    },
    
    appendAssistantMessage(state, { payload }) {
      state.messages.push({
        role: 'assistant',
        content: payload
      });
    },
    
    setError(state, { payload }) {
      state.error = payload;
      message.error(payload);
    },
    
    clearError(state) {
      state.error = null;
    },
    
    setSelectedProfile(state, { payload }) {
      state.selectedProfile = payload;
    },
    
    clearMessages(state) {
      state.messages = [];
    },
  },
  
  subscriptions: {
    setup({ dispatch }) {
      // Kiểm tra trạng thái khi khởi động
      dispatch({ type: 'checkStatus' });
      dispatch({ type: 'fetchUsageLimit', payload: {} });
    },
  },
};

export default AiModel;