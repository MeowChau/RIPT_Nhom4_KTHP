import React, { useState, useEffect } from 'react';
import { Layout, Button, message } from 'antd';
import ExerciseForm from './ExerciseForm';
import ExerciseTable from './ExerciseTable';
import { getExercises, deleteExercise } from '../../services/exerciseService';
import axios from 'axios';

const { Header, Content } = Layout;

const LibraryPage: React.FC = () => {
  const [exercises, setExercises] = useState<any[]>([]); // Danh sách bài tập
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const [isEditMode, setIsEditMode] = useState(false); // Kiểm tra chế độ sửa
  const [editingExercise, setEditingExercise] = useState<any>(null); // Bài tập cần chỉnh sửa

  // Lấy danh sách bài tập từ API
  useEffect(() => {
    getExercises()
      .then((response: any) => setExercises(response))
      .catch(() => message.error('Error loading exercises'));
  }, []);

  // Mở modal thêm bài tập
  const handleAddExercise = () => {
    setIsEditMode(false);  // Chế độ thêm mới
    setEditingExercise(null); // Reset bài tập
    setIsModalVisible(true); // Mở modal
  };

  // Mở modal sửa bài tập
  const handleEditExercise = (exercise: any) => {
    setIsEditMode(true);  // Chế độ sửa
    setEditingExercise(exercise);  // Chỉnh sửa bài tập
    setIsModalVisible(true); // Mở modal
  };

  // Xóa bài tập
  const handleDeleteExercise = (id: string) => {
    deleteExercise(id)
      .then(() => {
        message.success('Bài tập đã được xóa');
        // Cập nhật lại danh sách bài tập mà không reload
        setExercises(exercises.filter(ex => ex._id !== id));
      })
      .catch(() => message.error('Xóa bài tập thất bại'));
  };

  // Đóng modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    // Reset form fields handled inside ExerciseForm when modal closes
  };

  // Lưu bài tập (thêm mới hoặc sửa bài tập)
  const handleSubmitExercise = (values: any) => {
    console.log("Dữ liệu gửi lên backend:", values);  // Kiểm tra dữ liệu gửi đi

    const apiCall = isEditMode
      ? axios.put(`/api/exercises/${editingExercise._id}`, values) // Cập nhật bài tập
      : axios.post('/api/exercises', values); // Thêm bài tập mới

    apiCall
      .then((response: any) => {
        message.success(isEditMode ? 'Cập nhật bài tập thành công' : 'Thêm bài tập thành công');
        
        // Cập nhật lại bài tập trong state mà không cần reload
        if (isEditMode) {
          setExercises(exercises.map(ex => ex._id === editingExercise._id ? response.data : ex));
        } else {
          setExercises([...exercises, response.data]); // Thêm bài tập mới vào bảng
        }
        
        setIsModalVisible(false); // Đóng modal sau khi thao tác thành công
      })
      .catch((error) => {
        console.error("Lỗi từ API:", error.response);  // In lỗi chi tiết từ backend
        message.error('Thao tác thất bại');
      });
  };

  return (
    <Layout>
      <Header>
        <h1 style={{ color: 'white' }}>Quản lý Thư viện Bài Tập</h1>
      </Header>
      <Content style={{ padding: '20px' }}>
        <Button type="primary" onClick={handleAddExercise}>Thêm bài tập</Button>

        {/* Hiển thị bảng bài tập */}
        <ExerciseTable 
          exercises={exercises}  // Dữ liệu bài tập
          onEdit={handleEditExercise}  // Sửa bài tập
          onDelete={handleDeleteExercise}  // Xóa bài tập
        />

        {/* Form thêm/sửa bài tập */}
        <ExerciseForm 
          visible={isModalVisible} 
          onClose={handleModalClose} 
          isEditMode={isEditMode} 
          exercise={editingExercise} 
          onSubmit={handleSubmitExercise} 
        />
      </Content>
    </Layout>
  );
};

export default LibraryPage;
