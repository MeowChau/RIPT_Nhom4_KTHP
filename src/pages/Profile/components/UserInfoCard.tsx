import React from 'react';
import { Card, Descriptions, Avatar, Tag, Button, Popconfirm, Space } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useModel } from 'umi';
import MembershipStatus from './MembershipStatus';
import ProfileAction from './ProfileAction';
import styles from '@/pages/Profile/components/index.less';

interface UserInfoCardProps {
  memberData: MemberAPI.MemberData;
  gymData?: MemberAPI.GymData | null;
  onLogout?: () => void; // Thêm prop onLogout
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ memberData, gymData, onLogout }) => {
  // Format ngày tháng
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return moment(dateString).format('DD/MM/YYYY');
  };
  
  // Xác định role
  const getRoleTag = () => {
    const role = memberData.role;
    if (!role) return null;
    
    let color = 'green';
    let text = 'Hội viên';
    
    if (role === 'admin') {
      color = 'red';
      text = 'Admin';
    } else if (role === 'trainer') {
      color = 'blue';
      text = 'Huấn luyện viên';
    }
    
    return <Tag color={color}>{text}</Tag>;
  };

  // Sử dụng logout từ hook nếu không có onLogout từ props
  const { logout: modelLogout } = useModel('profile');
  const handleLogout = onLogout || modelLogout;

  return (
    <Card
      className={styles.profileCard}
      actions={[
        <Space key="actions">
          <ProfileAction key={memberData._id} memberId={memberData._id} />
          <Popconfirm
            title="Bạn có chắc chắn muốn đăng xuất không?"
            onConfirm={handleLogout}
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
        </Space>
      ]}
    >
      <div className={styles.avatarContainer}>
        <Avatar 
          size={100} 
          icon={<UserOutlined />} 
          className={styles.avatar} 
        />
        <h2>{memberData.name}</h2>
        {getRoleTag()}
        <MembershipStatus endDate={memberData.endDate} />
      </div>

      <Descriptions title="Thông tin cá nhân" bordered layout="vertical">
        <Descriptions.Item label="Email">{memberData.email || 'Chưa cập nhật'}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{memberData.phone || 'Chưa cập nhật'}</Descriptions.Item>
        <Descriptions.Item label="Gói tập">{memberData.membershipPackage || 'Chưa đăng ký'}</Descriptions.Item>
        <Descriptions.Item label="Ngày bắt đầu">{formatDate(memberData.startDate)}</Descriptions.Item>
        <Descriptions.Item label="Ngày kết thúc">{formatDate(memberData.endDate)}</Descriptions.Item>
        <Descriptions.Item label="Cơ sở Gym">{gymData?.name || 'Chưa chọn'}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default UserInfoCard;