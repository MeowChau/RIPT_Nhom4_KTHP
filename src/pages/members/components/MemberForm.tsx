import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button } from 'antd';
import moment from 'moment';
import type { Member, Gym } from '@/services/Member/types';
import { MEMBERSHIP_PACKAGES } from '@/services/Member/types';

interface MemberFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<any>;
  initialValues: Member | null;
  gyms: Gym[];
}

const MemberForm: React.FC<MemberFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  gyms,
}) => {
  const [form] = Form.useForm();
  const isEditing = !!initialValues;

  useEffect(() => {
    // Reset form khi modal mở/đóng hoặc thay đổi initialValues
    if (visible) {
      form.resetFields();
      
      if (initialValues) {
        // Chuyển đổi các trường date sang moment object cho DatePicker
        const formattedValues = {
          ...initialValues,
          startDate: initialValues.startDate ? moment(initialValues.startDate) : undefined,
        };
        form.setFieldsValue(formattedValues);
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Chuyển đổi các giá trị moment sang string
      if (values.startDate) {
        values.startDate = values.startDate.format('YYYY-MM-DD');
      }
      
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Cập nhật hội viên' : 'Thêm hội viên mới'}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {isEditing ? 'Cập nhật' : 'Thêm'}
        </Button>,
      ]}
      maskClosable={false}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ role: 'user' }}
      >
        <Form.Item
          name="name"
          label="Họ tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        {!isEditing && (
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên' },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        )}

        {isEditing && (
          <Form.Item
            name="password"
            label="Mật khẩu mới (bỏ trống nếu không thay đổi)"
            rules={[
              { min: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên' },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
        )}

        <Form.Item
          name="gymId"
          label="Phòng tập"
          rules={[{ required: true, message: 'Vui lòng chọn phòng tập' }]}
        >
          <Select placeholder="Chọn phòng tập">
            {gyms?.map(gym => (
              <Select.Option key={gym._id} value={gym._id}>
                {gym.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="membershipPackage"
          label="Gói tập"
          rules={[{ required: true, message: 'Vui lòng chọn gói tập' }]}
        >
          <Select placeholder="Chọn gói tập">
            {MEMBERSHIP_PACKAGES.map(pkg => (
              <Select.Option key={pkg} value={pkg}>
                {pkg}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Ngày bắt đầu"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            format="DD/MM/YYYY"
            placeholder="Chọn ngày bắt đầu" 
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="Vai trò"
        >
          <Select placeholder="Chọn vai trò">
            <Select.Option value="user">Hội viên</Select.Option>
            <Select.Option value="trainer">Huấn luyện viên</Select.Option>
            <Select.Option value="admin">Quản trị viên</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MemberForm;