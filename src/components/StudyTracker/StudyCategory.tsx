import { useState, useEffect } from 'react';
import { Input, Button, List, Modal, Card, Typography, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const StudyCategory = () => {
  // State để lưu danh sách các môn học
  const [categories, setCategories] = useState<string[]>([]);
  // State để lưu giá trị nhập mới
  const [newCategory, setNewCategory] = useState('');
  // State để theo dõi index của môn học đang chỉnh sửa
  const [editIndex, setEditIndex] = useState<number | null>(null);
  // State để kiểm soát hiển thị modal chỉnh sửa
  const [modalVisible, setModalVisible] = useState(false);
  // State để lưu giá trị chỉnh sửa
  const [editValue, setEditValue] = useState('');

  // useEffect để lấy dữ liệu từ localStorage khi component được mount
  useEffect(() => {
    const savedCategories = JSON.parse(localStorage.getItem('studyCategories') || '[]');
    setCategories(savedCategories);
  }, []);

  // Lưu danh sách danh mục môn học vào localStorage
  const saveToLocalStorage = (updatedCategories: string[]) => {
    localStorage.setItem('studyCategories', JSON.stringify(updatedCategories));
  };

  // Thêm một môn học mới vào danh sách
  const addCategory = () => {
    if (newCategory.trim()) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      saveToLocalStorage(updatedCategories);
      setNewCategory(''); // Reset input sau khi thêm
    }
  };

  // Xóa một môn học theo index
  const deleteCategory = (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
    saveToLocalStorage(updatedCategories);
  };

  // Mở modal chỉnh sửa và thiết lập giá trị ban đầu
  const openEditModal = (index: number) => {
    setEditIndex(index);
    setEditValue(categories[index]);
    setModalVisible(true);
  };

  // Lưu thay đổi sau khi chỉnh sửa môn học
  const handleEditSave = () => {
    if (editIndex !== null && editValue.trim()) {
      const updatedCategories = [...categories];
      updatedCategories[editIndex] = editValue.trim();
      setCategories(updatedCategories);
      saveToLocalStorage(updatedCategories);
      setModalVisible(false); // Đóng modal sau khi lưu
    }
  };

  return (
    <Card
      title={<Title level={3} style={{ textAlign: 'center', margin: 0 }}>Danh mục môn học</Title>}
      style={{ maxWidth: 500, margin: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* Ô nhập liệu để thêm môn học */}
        <Input
          placeholder="Nhập tên môn học"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onPressEnter={addCategory} // Thêm môn học khi nhấn Enter
        />
        {/* Nút thêm môn học */}
        <Button type="primary" block icon={<PlusCircleOutlined />} onClick={addCategory}>
          Thêm môn học
        </Button>
        {/* Danh sách các môn học đã thêm */}
        <List
          bordered
          dataSource={categories}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                // Nút chỉnh sửa
                <Button type="text" icon={<EditOutlined />} onClick={() => openEditModal(index)} />,
                // Nút xóa
                <Button type="text" icon={<DeleteOutlined />} danger onClick={() => deleteCategory(index)} />
              ]}
            >
              {item}
            </List.Item>
          )}
        />
      </Space>
      {/* Modal chỉnh sửa môn học */}
      <Modal
        title="Chỉnh sửa môn học"
        visible={modalVisible}
        onOk={handleEditSave}
        onCancel={() => setModalVisible(false)}
      >
        <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
      </Modal>
    </Card>
  );
};

export default StudyCategory;
