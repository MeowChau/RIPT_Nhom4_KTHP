import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Spin, Alert, Button, Popconfirm } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { history } from 'umi';
import useProfile from '@/models/profile';
import UserInfoCard from './components/UserInfoCard';
import RenewalHistory from './components/RenewalHistory';
import '@/pages/Profile/components/index.less';

const ProfilePage: React.FC = () => {
  // Sử dụng custom hook để quản lý state
  const { loading, error, memberData, gymData, logout } = useProfile();

  // Chuyển hướng về trang đăng nhập nếu không có dữ liệu
  React.useEffect(() => {
    if (!loading && !memberData && !error) {
      history.push('/user/login');
    }
  }, [loading, memberData, error]);

  return (
    <PageContainer 
      title="Thông tin cá nhân"
      extra={[
        <Popconfirm
          key="logout"
          title="Bạn có chắc chắn muốn đăng xuất không?"
          onConfirm={logout}
          okText="Đăng xuất"
          cancelText="Hủy"
        >
          <Button 
            type="primary"
            danger
            icon={<LogoutOutlined />}
          >
            Đăng xuất
          </Button>
        </Popconfirm>
      ]}
    >
      <Spin spinning={loading}>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        
        {memberData && (
          <>
            <UserInfoCard 
              memberData={memberData} 
              gymData={gymData} 
              onLogout={logout} // Truyền hàm logout qua props
            />
            
            {memberData.renewalHistory && memberData.renewalHistory.length > 0 && (
              <RenewalHistory renewalHistory={memberData.renewalHistory} />
            )}
          </>
        )}
      </Spin>
    </PageContainer>
  );
};

export default ProfilePage;