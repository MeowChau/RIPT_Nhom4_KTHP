import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, message, Typography, Card } from 'antd';
import { useLocation, history } from 'umi';
import { getPTById, createPT, updatePT } from '@/services/personalTrainer';
import { queryGyms } from '@/services/gym';

const { Option } = Select;
const { Title } = Typography;

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const statusOptions = [
  { value: 'off', label: 'Off' },
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'on', label: 'Free' }, // Thay on thành Free
];

const PersonalTrainerEdit: React.FC = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get('id');

  const [gyms, setGyms] = useState<any[]>([]);

  useEffect(() => {
    queryGyms().then(setGyms).catch(() => message.error('Không tải được danh sách cơ sở'));

    if (id) {
      getPTById(id)
        .then(data => {
          const scheduleMap = new Map(data.schedule?.map((s: any) => [s.day, s]) || []);
          const fullSchedule = daysOfWeek.map(day => scheduleMap.get(day) || { day, status: 'off' });
          form.setFieldsValue({ ...data, schedule: fullSchedule });
        })
        .catch(() => {
          message.error('Không tải được dữ liệu huấn luyện viên');
        });
    } else {
      const defaultSchedule = daysOfWeek.map(day => ({ day, status: 'off' }));
      form.setFieldsValue({ schedule: defaultSchedule });
    }
  }, [id]);

  const onFinish = async (values: any) => {
    console.log('Submit data:', values); // Kiểm tra dữ liệu gửi lên
    try {
      if (id) {
        await updatePT(id, values);
        message.success('Cập nhật huấn luyện viên thành công');
      } else {
        await createPT(values);
        message.success('Tạo huấn luyện viên thành công');
      }
      history.push('/personalTrainers');
    } catch (error) {
      console.error(error);
      message.error('Lưu thất bại');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        {id ? 'Sửa Huấn luyện viên' : 'Thêm Huấn luyện viên'}
      </Title>
      <Card bordered>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Tên Huấn luyện viên" rules={[{ required: true, message: 'Nhập tên PT' }]}>
            <Input placeholder="Nhập tên huấn luyện viên" />
          </Form.Item>

          <Form.Item name="gymId" label="Cơ sở" rules={[{ required: true, message: 'Chọn cơ sở' }]}>
            <Select placeholder="Chọn cơ sở">
              {gyms.map(gym => (
                <Option key={gym._id} value={gym._id}>
                  {gym.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Thêm trường mô tả */}
          <Form.Item name="description" label="Mô tả về bản thân" rules={[{ required: true, message: 'Nhập mô tả về bản thân' }]}>
            <Input.TextArea placeholder="Giới thiệu về bản thân" rows={4} />
          </Form.Item>

          <Title level={4} style={{ marginTop: 24 }}>
            Lịch làm việc
          </Title>

          {daysOfWeek.map((day, idx) => (
            <React.Fragment key={day}>
              {/* Trường ẩn day để gửi lên backend */}
              <Form.Item
                name={['schedule', idx, 'day']}
                initialValue={day}
                style={{ display: 'none' }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={day}
                name={['schedule', idx, 'status']}
                rules={[{ required: true, message: 'Chọn trạng thái' }]}
              >
                <Select>
                  {statusOptions.map(({ value, label }) => (
                    <Option key={value} value={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </React.Fragment>
          ))}

          <Button type="primary" htmlType="submit" block style={{ marginTop: 20 }}>
            {id ? 'Cập nhật' : 'Tạo'}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default PersonalTrainerEdit;
