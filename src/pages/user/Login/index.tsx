import React from 'react';
import { Card } from 'antd';
import { history, useModel } from 'umi';
import LoginForm from './components/LoginForm';
import useAuth from '@/hooks/useAuth';
import styles from './index.less';
import API from '@/services/Auth/typings'; // Import namespace API
const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();
  const { refresh } = useModel('@@initialState');

  const handleSubmit = async (values: API.LoginParams) => {
    const success = await login(values);
    if (success) {
      await refresh(); // Cập nhật initialState sau khi đăng nhập
      history.push('/'); // Chuyển về trang chủ thay vì /dashboard
    }
  };

  return (
    <div className={styles.container}>
      <Card title="Đăng nhập" className={styles.card}>
        <LoginForm onFinish={handleSubmit} loading={loading} />
      </Card>
    </div>
  );
};

export default LoginPage;