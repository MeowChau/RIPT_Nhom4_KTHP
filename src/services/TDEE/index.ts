import { request } from 'umi';
import type { HealthRecord, WorkoutPlanType } from '@/services/TDEE/typings';

const API_URL = '/api';

// Lấy lịch sử tính toán
export async function getHistoryRecords(): Promise<HealthRecord[]> {
  return request(`${API_URL}/health-records`, {
    method: 'GET',
  });
}

// Lưu kết quả tính toán vào lịch sử
export async function saveHealthRecord(data: Omit<HealthRecord, 'id'>): Promise<HealthRecord> {
  return request(`${API_URL}/health-records`, {
    method: 'POST',
    data,
  });
}

// Xóa bản ghi lịch sử
export async function deleteHistoryRecord(id: string): Promise<void> {
  return request(`${API_URL}/health-records/${id}`, {
    method: 'DELETE',
  });
}

// Lưu lịch tập
export async function saveWorkoutPlan(data: { 
  type: WorkoutPlanType, 
  userId?: string
}): Promise<void> {
  return request(`${API_URL}/workout-plans`, {
    method: 'POST',
    data,
  });
}

// Lấy lịch tập đã lưu
export async function getSavedWorkoutPlans(): Promise<any[]> {
  return request(`${API_URL}/workout-plans`, {
    method: 'GET',
  });
}