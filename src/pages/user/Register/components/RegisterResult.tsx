import React from 'react';
import { Result, Button } from 'antd';

interface RegisterResultProps {
  onLogin: () => void;
}

const RegisterResult: React.FC<RegisterResultProps> = ({ onLogin }) => {
  return (
    <Result
      status="success"
      title="Đăng ký thành công!"
      subTitle="Tài khoản của bạn đã được tạo. Mật khẩu mặc định là số điện thoại của bạn."
      extra={[
        <Button 
          type="primary" 
          key="login" 
          onClick={onLogin}
        >
          Đăng nhập ngay
        </Button>
      ]}
    />
  );
};

export default RegisterResult;