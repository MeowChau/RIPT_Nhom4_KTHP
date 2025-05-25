import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, message, Spin } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

const packageOptions = ['1 tháng', '3 tháng', '6 tháng', '12 tháng'];

interface Gym {
  _id: string;
  name: string;
}

interface MemberFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingMember: any | null;
}

const MemberFormModal: React.FC<MemberFormModalProps> = ({
  visible,
  onClose,
  onSuccess,
  editingMember,
}) => {
  const [form] = Form.useForm();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loadingGyms, setLoadingGyms] = useState(false);

  // Lấy danh sách gym từ backend
  useEffect(() => {
    const fetchGyms = async () => {
      setLoadingGyms(true);
      try {
        const res = await axios.get('/api/gyms');
        setGyms(res.data);
      } catch {
        message.error('Không tải được danh sách cơ sở gym');
      } finally {
        setLoadingGyms(false);
      }
    };

    if (visible) {
      fetchGyms();
    }
  }, [visible]);

  useEffect(() => {
    if (editingMember) {
      const { password, startDate, ...rest } = editingMember;
      form.setFieldsValue({
        ...rest,
        startDate: startDate ? moment(startDate) : null,
      });
    } else {
      form.resetFields();
    }
  }, [editingMember, form]);

  const handleFinish = async (values: any) => {
    try {
      if (!values.password) {
        delete values.password;
      }

      if (editingMember) {
        await axios.put(`/api/members/${editingMember._id}`, values);
        message.success('Cập nhật hội viên thành công');
      } else {
        await axios.post('/api/members', values);
        message.success('Thêm hội viên thành công');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Lỗi khi lưu hội viên');
    }
  };

  return (
    <Modal
      visible={visible}
      title={editingMember ? 'Sửa hội viên' : 'Thêm hội viên'}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Lưu"
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} preserve={false}>
        <Form.Item
          label="Tên hội viên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { type: 'email', message: 'Email không hợp lệ' },
            { required: true, message: 'Vui lòng nhập email' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (editingMember) {
                  if (!value) return Promise.resolve();
                  if (value.length < 6)
                    return Promise.reject(new Error('Mật khẩu tối thiểu 6 ký tự'));
                  return Promise.resolve();
                } else {
                  if (!value) return Promise.reject(new Error('Vui lòng nhập mật khẩu'));
                  if (value.length < 6)
                    return Promise.reject(new Error('Mật khẩu tối thiểu 6 ký tự'));
                  return Promise.resolve();
                }
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password placeholder={editingMember ? 'Để trống nếu không đổi mật khẩu' : ''} />
        </Form.Item>

        <Form.Item
          label="Gói tập"
          name="membershipPackage"
          rules={[{ required: true, message: 'Vui lòng chọn gói tập' }]}
        >
          <Select placeholder="Chọn gói tập">
            {packageOptions.map((pkg) => (
              <Option key={pkg} value={pkg}>
                {pkg}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Cơ sở Gym"
          name="gymId"
          rules={[{ required: true, message: 'Vui lòng chọn cơ sở gym' }]}
        >
          {loadingGyms ? (
            <Spin />
          ) : (
            <Select placeholder="Chọn cơ sở gym" allowClear>
              {gyms.map((gym) => (
                <Option key={gym._id} value={gym._id}>
                  {gym.name}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item
          label="Ngày bắt đầu tập"
          name="startDate"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu tập' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MemberFormModal;
