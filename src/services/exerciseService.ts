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

// Thêm bài tập mới
export const addExercise = async (exerciseData: any) => {
  try {
    const response = await axios.post(API_URL, exerciseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật bài tập
export const updateExercise = async (id: string, exerciseData: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, exerciseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Xóa bài tập
export const deleteExercise = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
