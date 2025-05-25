import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import moment from 'moment';
import { getGymFacilities } from '@/services/Gym'; // Import service để lấy danh sách gym
import type API from '@/services/Auth/typings';
import styles from '../index.less';

const { Option } = Select;

const RegisterForm: React.FC<API.RegisterFormProps> = ({ onFinish, loading }) => {
  const [form] = Form.useForm();
  const [gyms, setGyms] = useState<any[]>([]);

  // Lấy danh sách cơ sở gym khi component được render
useEffect(() => {
  const fetchGyms = async () => {
    try {
      const response: any = await getGymFacilities();
      // Kiểm tra cấu trúc response và đặt state gyms
      if (Array.isArray(response)) {
        setGyms(response);
      } else if (response && Array.isArray((response as any).data)) {
        setGyms((response as any).data);
      } else {
        console.error('Định dạng dữ liệu gym không hợp lệ:', response);
        setGyms([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách gym:', error);
      setGyms([]);
    }
  };

  fetchGyms();
}, []);

  // Các gói tập theo yêu cầu backend
  const membershipPackages = ['1 tháng', '3 tháng', '6 tháng', '12 tháng'];

  return (
    <Form
      form={form}
      name="register"
      onFinish={onFinish}
      layout="vertical"
      scrollToFirstError
      initialValues={{
        startDate: moment(), // Mặc định ngày bắt đầu là hôm nay
      }}
    >
      <Form.Item
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên hội viên!' }]}
      >
        <Input 
          prefix={<UserOutlined />} 
          placeholder="Tên hội viên" 
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' }
        ]}
      >
        <Input 
          prefix={<MailOutlined />} 
          placeholder="Email" 
          size="large" 
        />
      </Form.Item>

      <Form.Item
        name="phone"
        rules={[
          { required: true, message: 'Vui lòng nhập số điện thoại!' },
          { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
        ]}
        extra="Số điện thoại của bạn sẽ là mật khẩu mặc định"
      >
        <Input 
          prefix={<PhoneOutlined />} 
          placeholder="Số điện thoại" 
          size="large" 
        />
      </Form.Item>

      <Form.Item
        name="gymId"
        label="Cơ sở gym"
        rules={[{ required: true, message: 'Vui lòng chọn cơ sở gym!' }]}
      >
        <Select placeholder="Chọn cơ sở gym" size="large">
          {gyms.map(gym => (
            <Option key={gym._id} value={gym._id}>{gym.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="membershipPackage"
        label="Gói tập"
        rules={[{ required: true, message: 'Vui lòng chọn gói tập!' }]}
      >
        <Select placeholder="Chọn gói tập" size="large">
          {membershipPackages.map(pkg => (
            <Option key={pkg} value={pkg}>{pkg}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="startDate"
        label="Ngày bắt đầu"
        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
      >
        <DatePicker 
          style={{ width: '100%' }} 
          format="YYYY-MM-DD" 
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          block 
          size="large"
          loading={loading}
        >
          Đăng ký
        </Button>
      </Form.Item>

      <div className={styles.login}>
        Đã có tài khoản? <Link to="/user/login">Đăng nhập!</Link>
      </div>
    </Form>
  );
};

export default RegisterForm;