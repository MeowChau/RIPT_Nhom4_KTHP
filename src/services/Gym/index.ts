import { request } from 'umi';
import type API from '@/services/Gym/typings';
const API_URL = process.env.UMI_APP_API_URL || '';

/**
 * Lấy danh sách tất cả các cơ sở gym
 */
export async function getGymFacilities() {
  return request<API.GymFacility[]>(`${API_URL}/api/gyms`, {
    method: 'GET',
  });
}

/**
 * Lấy chi tiết một cơ sở gym theo ID
 * @param id ID của cơ sở gym
 */
export async function getGymFacilityById(id: string) {
  return request<API.GymFacility>(`${API_URL}/api/gyms/${id}`, {
    method: 'GET',
  });
}

/**
 * Tạo một cơ sở gym mới
 * @param data Dữ liệu của cơ sở gym mới
 */
export async function createGymFacility(data: Omit<API.GymFacility, '_id' | 'createdAt' | 'updatedAt'>) {
  return request<API.GymFacility>(`${API_URL}/api/gyms`, {
    method: 'POST',
    data,
  });
}

/**
 * Cập nhật thông tin của một cơ sở gym
 * @param id ID của cơ sở gym
 * @param data Dữ liệu cập nhật
 */
export async function updateGymFacility(id: string, data: Partial<API.GymFacility>) {
  return request<API.GymFacility>(`${API_URL}/api/gyms/${id}`, {
    method: 'PUT',
    data,
  });
}

/**
 * Xóa một cơ sở gym
 * @param id ID của cơ sở gym
 */
export async function deleteGymFacility(id: string) {
  return request<{ message: string }>(`${API_URL}/api/gyms/${id}`, {
    method: 'DELETE',
  });
}