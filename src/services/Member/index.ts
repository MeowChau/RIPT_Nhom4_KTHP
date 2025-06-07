import { request } from 'umi';

// Base URL cho API
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Services cho members
export const memberService = {
  getMembers: async () => {
    try {
      return await request(`${API_BASE_URL}/members`, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Failed to fetch members:', error);
      throw error;
    }
  },

  getMember: async (id: string) => {
    try {
      return await request(`${API_BASE_URL}/members/${id}`, {
        method: 'GET',
      });
    } catch (error) {
      console.error(`Failed to fetch member ${id}:`, error);
      throw error;
    }
  },

  createMember: async (data: any) => {
    try {
      return await request(`${API_BASE_URL}/members`, {
        method: 'POST',
        data,
      });
    } catch (error) {
      console.error('Failed to create member:', error);
      throw error;
    }
  },

  updateMember: async (id: string, data: any) => {
    try {
      return await request(`${API_BASE_URL}/members/${id}`, {
        method: 'PUT',
        data,
      });
    } catch (error) {
      console.error(`Failed to update member ${id}:`, error);
      throw error;
    }
  },

  deleteMember: async (id: string) => {
    try {
      return await request(`${API_BASE_URL}/members/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to delete member ${id}:`, error);
      throw error;
    }
  },
};

// Services cho gyms
export const gymService = {
  getGyms: async () => {
    try {
      return await request(`${API_BASE_URL}/gyms`, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Failed to fetch gyms:', error);
      throw error;
    }
  },
};