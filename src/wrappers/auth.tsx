
import React from 'react';
import { Redirect } from 'umi';
import { message } from 'antd';

const AuthWrapper: React.FC = (props) => {
  // Kiểm tra token trong localStorage
  const token = localStorage.getItem('token');
  
  // Nếu đã đăng nhập, hiển thị nội dung
  if (token) {
    return <>{props.children}</>;
  }
  
  // Nếu chưa đăng nhập, hiển thị thông báo và chuyển hướng về trang đăng nhập
  message.error('Vui lòng đăng nhập để truy cập trang này!');
  return <Redirect to="/user/login" />;
};

export default AuthWrapper;