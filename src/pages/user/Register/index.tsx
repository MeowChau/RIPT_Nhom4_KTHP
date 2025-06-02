import React, { useEffect, useState } from 'react';
import { Card, Typography, Spin, Result, Button, message } from 'antd';
import { history, useModel } from 'umi';
import { register, login } from '@/services/Auth';
import RegisterForm from '@/pages/user/Register/components/ResgisterForm';
import styles from './index.less';

const { Title, Paragraph } = Typography;

const RegisterPage: React.FC = () => {
  // Sử dụng model user để truy cập loading state
  const { loading } = useModel('user');
  
  // State cho trang
  // State cho trang
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // State cho phòng tập
  const [gymList, setGymList] = useState<any[]>([]);
  const [loadingGyms, setLoadingGyms] = useState<boolean>(false);

  // Fetch danh sách phòng tập khi component mount
  useEffect(() => {
    const fetchGyms = async () => {
      setLoadingGyms(true);
      try {
        // Thay đổi URL API tùy theo backend của bạn
        const response = await fetch('/api/gyms');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setGymList(data);
        } else if (data && Array.isArray(data.data)) {
          setGymList(data.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng tập:', error);
        message.error('Không thể tải danh sách phòng tập');
      } finally {
        setLoadingGyms(false);
      }
    };

    fetchGyms();
  }, []);

  // Handler đăng ký
  const handleRegister = async (values: any) => {
    try {
      setErrorMessage(null);
      
      // Đảm bảo có startDate
      if (!values.startDate) {
        values.startDate = new Date().toISOString().split('T')[0];
      }
      
      // Đảm bảo có membershipPackage
      if (!values.membershipPackage) {
        values.membershipPackage = '1 tháng';
      }
      
      // Sử dụng số điện thoại làm mật khẩu
      values.password = values.phone;
      
      // Lưu thông tin đăng ký để hiển thị
      setRegisteredUser({
        name: values.name,
        email: values.email,
        phone: values.phone,
        membershipPackage: values.membershipPackage,
        startDate: values.startDate
      });
      
      // Gọi hàm register từ useAuth model
      const success = await register(values);
      
      if (success) {
        message.success('Đăng ký thành công!');
        setRegisterSuccess(true);
        
        // Không tự động redirect đến trang đăng nhập
        // Người dùng sẽ click nút để đăng nhập
      } else {
        message.error('Đăng ký không thành công. Vui lòng thử lại.');
      }
    } catch (error: any) {
      console.error('Lỗi khi đăng ký:', error);
      
      // Xử lý lỗi
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
        message.error(error.response.data.message);
      } else {
        setErrorMessage('Đăng ký không thành công. Vui lòng thử lại!');
        message.error('Đăng ký không thành công. Vui lòng thử lại!');
      }
    }
  };

  // Xử lý đăng nhập trực tiếp sau khi đăng ký thành công
  const handleDirectLogin = async () => {
    if (!registeredUser) return;
    
    try {
      message.loading('Đang đăng nhập...', 1);
      
      // Sử dụng thông tin đăng ký để đăng nhập
      const loginSuccess = await login({
        email: registeredUser.email,
        password: registeredUser.phone // Mật khẩu mặc định là số điện thoại
      });
      
      if (loginSuccess) {
        message.success('Đăng nhập thành công!');
        history.push('user/login'); // Chuyển hướng đến trang dashboard sau khi đăng nhập
      } else {
        message.error('Đăng nhập không thành công. Vui lòng thử lại ở trang đăng nhập.');
        history.push('/user/login'); // Đường dẫn đã sửa thành /user/login
      }
    } catch (error: any) {
      console.error('Lỗi khi đăng nhập:', error);
      message.error('Đăng nhập không thành công. Vui lòng thử lại ở trang đăng nhập.');
      history.push('/user/login'); // Đường dẫn đã sửa thành /user/login
    }
  };

  // Hiển thị thông báo thành công
  if (registerSuccess && registeredUser) {
    return (
      <div className={styles.registerPage}>
        <div className={styles.registerContainer}>
          <Card className={styles.registerCard}>
            <Result
              status="success"
              title="Đăng ký thành công!"
              subTitle={
                <div>
                  <p>Thông tin của bạn đã được lưu trong hệ thống.</p>
                  <p>Bạn có thể đăng nhập ngay bằng email và mật khẩu (số điện thoại của bạn).</p>
                </div>
              }
              extra={[
                <Button
                  type="primary"
                  key="direct-login"
                  onClick={handleDirectLogin}
                >
                  Đăng nhập ngay
                </Button>,
                <Button
                  key="login-page"
                  onClick={() => history.push('/user/login')} // Đường dẫn đã sửa thành /user/login
                >
                  Đến trang đăng nhập
                </Button>
              ]}
            />
            
            <div className={styles.registrationDetails}>
              <Paragraph strong>Thông tin đăng ký:</Paragraph>
              <ul className={styles.infoList}>
                <li><strong>Họ tên:</strong> {registeredUser.name}</li>
                <li><strong>Email:</strong> {registeredUser.email}</li>
                <li><strong>Số điện thoại:</strong> {registeredUser.phone}</li>
                <li><strong>Gói tập:</strong> {registeredUser.membershipPackage}</li>
                <li><strong>Ngày bắt đầu:</strong> {new Date(registeredUser.startDate).toLocaleDateString('vi-VN')}</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={styles.registerHeader}>
          <Title level={2}>Đăng ký tài khoản</Title>
          <Paragraph>Trở thành thành viên để được tập luyện tại phòng tập của chúng tôi</Paragraph>
        </div>

        <Card className={styles.registerCard}>
          {loadingGyms ? (
            <div className={styles.loadingContainer}>
              <Spin size="large" />
              <Paragraph className={styles.loadingText}>Đang tải dữ liệu...</Paragraph>
            </div>
          ) : (
            <RegisterForm
              onSubmit={handleRegister}
              isLoading={loading}
              error={errorMessage}
              gymList={gymList}
            />
          )}
        </Card>

        <div className={styles.registerFooter}>
          <p>© {new Date().getFullYear()} Fitness Center. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;