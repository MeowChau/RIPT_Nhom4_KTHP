import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { getExercises, getExerciseById, EXERCISE_TYPES } from '@/services/Exercise/index';

export default function useExercise() {
  const [exercises, setExercises] = useState<API.Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<API.Exercise | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');

  // Lấy tất cả bài tập
  const fetchExercises = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getExercises();
      if (response.success) {
        setExercises(response.data);
      } else {
        message.error('Không thể tải danh sách bài tập');
      }
    } catch (error) {
      message.error('Lỗi khi tải danh sách bài tập');
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy chi tiết bài tập
  const fetchExerciseDetails = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await getExerciseById(id);
      if (response.success) {
        setSelectedExercise(response.data);
        setDetailsVisible(true);
      } else {
        message.error('Không thể tải chi tiết bài tập');
      }
    } catch (error) {
      message.error('Lỗi khi tải chi tiết bài tập');
    } finally {
      setLoading(false);
    }
  }, []);

  // Lọc bài tập theo loại và từ khóa tìm kiếm
  const filteredExercises = useCallback(() => {
    let result = [...exercises];
    
    if (filterType) {
      result = result.filter(ex => ex.type === filterType);
    }
    
    if (searchText) {
      const lowercaseSearch = searchText.toLowerCase();
      result = result.filter(ex => 
        ex.name.toLowerCase().includes(lowercaseSearch) || 
        ex.description.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    return result;
  }, [exercises, filterType, searchText]);

  // Tải dữ liệu khi component mount
  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return {
    exercises: filteredExercises(),
    loading,
    exerciseTypes: EXERCISE_TYPES,
    filterType,
    searchText,
    selectedExercise,
    detailsVisible,
    setFilterType,
    setSearchText,
    fetchExerciseDetails,
    setDetailsVisible,
    refreshExercises: fetchExercises
  };
}