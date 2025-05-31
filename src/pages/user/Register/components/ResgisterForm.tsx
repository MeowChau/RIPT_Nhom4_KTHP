import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import moment from 'moment';
import { getGymFacilities } from '@/services/Gym';
import styles from '../index.less';

const { Option } = Select;

interface RegisterFormProps {
  onFinish: (values: any) => void;
  loading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onFinish, loading }) => {
  const [form] = Form.useForm();
  const [gyms, setGyms] = useState<any[]>([]);
  const [loadingGyms, setLoadingGyms] = useState(false);

  // Lấy danh sách cơ sở gym
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoadingGyms(true);
        const response: any = await getGymFacilities();
        console.log('API gym response:', response);
        
        if (Array.isArray(response)) {
          setGyms(response);
        } else if (response && Array.isArray(response.data)) {
          setGyms(response.data);
        } else {
          console.error('Định dạng dữ liệu gym không hợp lệ:', response);
          setGyms([]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách gym:', error);
        setGyms([]);
      } finally {
        setLoadingGyms(false);
      }
    };

    fetchGyms();
  }, []);

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
        <Select placeholder="Chọn cơ sở gym" size="large" loading={loadingGyms}>
          {gyms.map(gym => (
            <Option key={gym._id} value={gym._id}>{gym.name}</Option>
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
          Tiếp tục
        </Button>
      </Form.Item>

      <div className={styles.login}>
        Đã có tài khoản? <Link to="/user/login">Đăng nhập!</Link>
      </div>
    </Form>
  );
};

export default RegisterForm;