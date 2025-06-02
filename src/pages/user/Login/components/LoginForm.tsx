import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import styles from '../index.less';
import type API from '@/services/Auth/typings'; // Import namespace API làm default

// Thêm type API.LoginFormProps vào component
const LoginForm: React.FC<API.LoginFormProps> = ({ onFinish, loading }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      name="login"
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' }
        ]}
      >
        <Input 
          prefix={<UserOutlined />} 
          placeholder="Email" 
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Mật khẩu"
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Ghi nhớ đăng nhập</Checkbox>
        </Form.Item>
        <a className={styles.forgot} href="#">Quên mật khẩu?</a>
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          block 
          size="large" 
          loading={loading}
        >
          Đăng nhập
        </Button>
      </Form.Item>

      <div className={styles.register}>
        Chưa có tài khoản? <Link to="/user/register">Đăng ký ngay!</Link>
      </div>
    </Form>
  );
};

export default LoginForm;