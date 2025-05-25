import React, { useState } from 'react';
import { Card, message } from 'antd';
import { history } from 'umi';
import RegisterForm from '@/pages/user/Register/components/ResgisterForm';
import { register } from '@/services/Auth';
import type API from '@/services/Auth/typings';
import moment from 'moment';
import styles from './index.less';

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    const { name, email, phone, gymId, membershipPackage, startDate } = values;
    
    // Định dạng ngày bắt đầu từ DatePicker
    const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
    
    const registerParams: API.RegisterParams = {
      name,
      email,
      phone,
      password: phone, // Mật khẩu mặc định là số điện thoại
      gymId,
      membershipPackage,
      startDate: formattedStartDate,
    };
    
    try {
      setLoading(true);
      console.log('Đang gửi dữ liệu đăng ký:', registerParams);
      
      const response = await register(registerParams);
      console.log('Phản hồi từ server:', response);
      
      if (response.success) {
        message.success('Đăng ký thành công! Mật khẩu mặc định là số điện thoại của bạn.');
        setTimeout(() => {
          history.push('/user/login');
        }, 1500);
      } else {
        message.error(response.message || 'Đăng ký thất bại!');
      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        try {
          const response = (error as { response: Response }).response;
          const errorData = await response.clone().json();
          message.error(`Lỗi: ${errorData.message || 'Vui lòng kiểm tra thông tin đăng ký'}`);
        } catch (e) {
          message.error(`Lỗi đăng ký: ${(error as { message?: string }).message || 'Vui lòng thử lại'}`);
        }
      } else {
        if (error && typeof error === 'object' && 'message' in error) {
          message.error(`Lỗi kết nối: ${(error as { message?: string }).message || 'Không thể kết nối đến server'}`);
        } else {
          message.error('Không thể kết nối đến server');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card title="Đăng ký hội viên" className={styles.card}>
        <RegisterForm onFinish={handleSubmit} loading={loading} />
      </Card>
    </div>
  );
};

export default RegisterPage;