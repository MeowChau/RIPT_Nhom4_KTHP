import { request } from 'umi';

// Lấy tất cả bài tập
export async function getExercises(): Promise<API.APIResponse<API.Exercise[]>> {
  return request('/api/exercises', {
    method: 'GET',
  });
}

// Lấy chi tiết một bài tập
export async function getExerciseById(id: string): Promise<API.APIResponse<API.Exercise>> {
  return request(`/api/exercises/${id}`, {
    method: 'GET',
  });
}

// Thêm bài tập mới
export async function createExercise(data: Omit<API.Exercise, '_id' | 'createdAt' | 'updatedAt'>): Promise<API.APIResponse<API.Exercise>> {
  return request('/api/exercises', {
    method: 'POST',
    data,
  });
}

// Cập nhật bài tập
export async function updateExercise(id: string, data: Partial<API.Exercise>): Promise<API.APIResponse<API.Exercise>> {
  return request(`/api/exercises/${id}`, {
    method: 'PUT',
    data,
  });
}

// Xóa bài tập
export async function deleteExercise(id: string): Promise<API.APIResponse<Record<string, never>>> {
  return request(`/api/exercises/${id}`, {
    method: 'DELETE',
  });
}

// Lấy danh sách loại bài tập
export const EXERCISE_TYPES = ['Kháng lực', 'Cardio', 'BodyCombat'];