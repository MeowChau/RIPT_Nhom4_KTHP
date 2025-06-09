import { request } from 'umi';

const API_URL = process.env.UMI_APP_API_URL || 'https://ript-nhom4-kthp-xyz.onrender.com';

/**
 * Lấy thông tin của hội viên theo ID
 */
export async function getMemberById(id: string): Promise<MemberAPI.MemberData> {
  const token = localStorage.getItem('token');
  return request(`${API_URL}/api/members/${id}`, {
    method: 'GET',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
}

/**
 * Cập nhật thông tin của hội viên
 */
export async function updateMember(
  id: string, 
  data: MemberAPI.UpdateMemberParams
): Promise<MemberAPI.MemberData> {
  const token = localStorage.getItem('token');
  return request(`${API_URL}/api/members/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    data,
  });
}

/**
 * Lấy danh sách gym
 */
export async function getGyms(): Promise<MemberAPI.GymData[]> {
  return request(`${API_URL}/api/gyms`, {
    method: 'GET',
  });
}

/**
 * Lấy thông tin chi tiết gym
 */
export async function getGymById(id: string): Promise<MemberAPI.GymData> {
  return request(`${API_URL}/api/gyms/${id}`, {
    method: 'GET',
  });
}