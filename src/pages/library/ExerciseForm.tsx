import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Upload, message, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const ExerciseForm: React.FC<any> = ({ visible, onClose, isEditMode, exercise }) => {
  const [form] = Form.useForm();
  const [subcategories, setSubcategories] = useState<string[]>([]);  // Mảng chứa các mục con

  // Hàm xử lý submit form
  const handleSubmit = (values: any) => {
    console.log("Dữ liệu gửi lên backend:", values); // Thêm console.log để kiểm tra dữ liệu gửi đi

    const apiCall = isEditMode 
      ? axios.put(`/api/exercises/${exercise._id}`, values) 
      : axios.post('/api/exercises', values);

    apiCall
      .then((response) => {
        message.success(isEditMode ? 'Cập nhật bài tập thành công' : 'Thêm bài tập thành công');
        onClose();
      })
      .catch((error) => message.error('Thao tác thất bại'));
  };

  // Hàm xử lý thay đổi danh mục và cập nhật mục con
  const handleCategoryChange = (value: string) => {
    // Reset mục con khi danh mục thay đổi
    if (value === 'strength') {
      setSubcategories(['Lưng', 'Vai', 'Chân', 'Ngực', 'Tay']);
    } else if (value === 'cardio') {
      setSubcategories(['HIIT', 'LISS']);
    } else if (value === 'combat') {
      setSubcategories(['Combat']);
    } else {
      setSubcategories([]); // Nếu danh mục khác thì reset mục con
    }
  };

  // Nếu có dữ liệu bài tập (edit), set lại form
  useEffect(() => {
    if (exercise && visible) {
      form.setFieldsValue(exercise);  // Set giá trị mặc định cho form khi chỉnh sửa
      handleCategoryChange(exercise.category); // Đảm bảo mục con thay đổi dựa trên danh mục bài tập
    }
  }, [exercise, visible, form]);

  return (
    <Modal
      title={isEditMode ? 'Chỉnh sửa bài tập' : 'Thêm bài tập'}
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical" initialValues={exercise}>
        {/* Tên bài tập */}
        <Form.Item name="name" label="Tên bài tập" rules={[{ required: true, message: 'Vui lòng nhập tên bài tập' }]}>
          <Input />
        </Form.Item>

        {/* Mô tả bài tập */}
        <Form.Item name="description" label="Mô tả bài tập" rules={[{ required: true, message: 'Vui lòng nhập mô tả bài tập' }]}>
          <Input.TextArea rows={4} />
        </Form.Item>

        {/* Danh mục bài tập (Dropdown) */}
        <Form.Item name="category" label="Danh mục bài tập" rules={[{ required: true, message: 'Vui lòng chọn danh mục bài tập' }]}>
          <Select placeholder="Chọn danh mục" onChange={handleCategoryChange} allowClear>
            <Option value="strength">Kháng lực</Option>
            <Option value="cardio">Cardio</Option>
            <Option value="combat">Body Combat</Option>
          </Select>
        </Form.Item>

        {/* Mục con bài tập (Dropdown theo danh mục) */}
        <Form.Item name="subcategory" label="Mục con bài tập" rules={[{ required: true, message: 'Vui lòng chọn mục con bài tập' }]}>
          <Select placeholder="Chọn mục con" allowClear>
            {subcategories.map(sub => (
              <Option key={sub} value={sub}>{sub}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Ảnh minh họa */}
        <Form.Item name="image" label="Ảnh bài tập">
          <Upload beforeUpload={(file) => false} listType="picture" maxCount={1}>
            <Button icon={<PlusOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        {/* Link YouTube */}
        <Form.Item name="youtube" label="Video YouTube">
          <Input placeholder="Nhúng iframe YouTube" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>{isEditMode ? 'Cập nhật' : 'Thêm bài tập'}</Button>
      </Form>
    </Modal>
  );
};

export default ExerciseForm;
