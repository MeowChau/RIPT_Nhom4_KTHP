import { useState, useEffect } from 'react'; // Import các hook cần thiết từ React
import { InputNumber, Button, Table, Modal, Input, DatePicker } from 'antd'; // Import các thành phần giao diện từ Ant Design
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'; // Import các icon từ Ant Design

import { Moment } from 'moment'; // Import kiểu dữ liệu Moment để xử lý ngày giờ

const StudyGoals = () => {
  // State lưu danh sách môn học
  const [subjects, setSubjects] = useState<{ name: string; date: any; duration: number; content: string; notes: string; }[]>([]);
  
  // State lưu mục tiêu học tập
  const [goal, setGoal] = useState<number>(0);
  
  // State kiểm soát hiển thị modal
  const [modalVisible, setModalVisible] = useState(false);
  
  // State lưu chỉ mục của môn học đang chỉnh sửa, nếu null thì đang thêm mới
  const [editingSubject, setEditingSubject] = useState<number | null>(null);
  
  // State lưu thông tin môn học mới hoặc môn học đang chỉnh sửa
  const [newSubject, setNewSubject] = useState<{ name: string; date: Moment | null; duration: number; content: string; notes: string; }>({ name: '', date: null, duration: 0, content: '', notes: '' });

  // useEffect để lấy mục tiêu học từ localStorage khi component được mount
  useEffect(() => {
    setGoal(Number(localStorage.getItem('studyGoal') || 0));
  }, []);

  // Hàm thêm hoặc cập nhật môn học
  const handleAddOrUpdateSubject = () => {
    let updatedSubjects;
    if (editingSubject !== null) {
      // Nếu đang chỉnh sửa, cập nhật môn học tại vị trí editingSubject
      updatedSubjects = subjects.map((subject, index) => (index === editingSubject ? newSubject : subject));
    } else {
      // Nếu không, thêm môn học mới vào danh sách
      updatedSubjects = [...subjects, newSubject];
    }
    setSubjects(updatedSubjects);
    localStorage.setItem('studySubjects', JSON.stringify(updatedSubjects)); // Lưu vào localStorage
    setModalVisible(false); // Đóng modal
    setNewSubject({ name: '', date: null, duration: 0, content: '', notes: '' }); // Reset state
    setEditingSubject(null); // Reset trạng thái chỉnh sửa
  };

  // Hàm chỉnh sửa môn học
  const handleEditSubject = (index: number) => {
    setNewSubject(subjects[index]); // Đặt dữ liệu môn học vào state
    setEditingSubject(index); // Lưu vị trí môn học đang chỉnh sửa
    setModalVisible(true); // Hiển thị modal
  };

  // Hàm xóa môn học
  const handleDeleteSubject = (index: number) => {
    const updatedSubjects = subjects.filter((_, i) => i !== index); // Lọc bỏ môn học tại vị trí index
    setSubjects(updatedSubjects);
    localStorage.setItem('studySubjects', JSON.stringify(updatedSubjects)); // Lưu vào localStorage
  };

  // Cấu trúc cột của bảng hiển thị danh sách môn học
  const columns = [
    { title: 'Tên môn', dataIndex: 'name', key: 'name' },
    { title: 'Thời gian học', dataIndex: 'date', key: 'date' },
    { title: 'Thời lượng', dataIndex: 'duration', key: 'duration' },
    { title: 'Nội dung đã học', dataIndex: 'content', key: 'content' },
    { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any, index: number) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => handleEditSubject(index)} style={{ marginRight: 8 }} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDeleteSubject(index)} danger />
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý tiến độ học tập</h2>
      {/* Nút thêm môn học */}
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)} style={{ marginBottom: 10 }}>
        Thêm môn học
      </Button>
      {/* Bảng hiển thị danh sách môn học */}
      <Table dataSource={subjects} columns={columns} rowKey={(record, index) => index!.toString()} />
      
      {/* Modal thêm/chỉnh sửa môn học */}
      <Modal
        title={editingSubject !== null ? 'Chỉnh sửa môn học' : 'Thêm môn học'}
        visible={modalVisible}
        onOk={handleAddOrUpdateSubject}
        onCancel={() => setModalVisible(false)}
      >
        <Input placeholder="Tên môn" value={newSubject.name} onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })} style={{ marginBottom: 10 }} />
        <DatePicker showTime placeholder="Thời gian học" value={newSubject.date} onChange={(date) => setNewSubject({ ...newSubject, date })} style={{ marginBottom: 10, width: '100%' }} />
        <InputNumber min={1} placeholder="Thời lượng (phút)" value={newSubject.duration} onChange={(value) => setNewSubject({ ...newSubject, duration: value || 0 })} style={{ marginBottom: 10, width: '100%' }} />
        <Input placeholder="Nội dung đã học" value={newSubject.content} onChange={(e) => setNewSubject({ ...newSubject, content: e.target.value })} style={{ marginBottom: 10 }} />
        <Input placeholder="Ghi chú" value={newSubject.notes} onChange={(e) => setNewSubject({ ...newSubject, notes: e.target.value })} />
      </Modal>
    </div>
  );
};

export default StudyGoals;
