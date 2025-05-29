export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatHistory {
  _id: string;
  userId: string;
  aiProfile: 'general' | 'nutrition' | 'fitness' | 'health' | 'analysis';
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OllamaStatus {
  running: boolean;
  models: string[];
  error?: string;
}

export interface UsageLimit {
  current: number;
  max: number;
}

export interface GenerateResponse {
  content: string;
  usageCount: number;
  maxUsage: number;
  local: boolean;
}

export interface AnalysisResponse {
  analysis: string;
  usageCount: number;
  maxUsage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}