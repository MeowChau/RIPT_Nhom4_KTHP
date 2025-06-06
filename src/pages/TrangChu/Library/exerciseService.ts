import axios from 'axios';

const API_URL = '/api/exercises';

// Lấy danh sách bài tập
export const getExercises = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};
