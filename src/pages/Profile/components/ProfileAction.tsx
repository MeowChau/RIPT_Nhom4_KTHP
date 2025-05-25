import React from 'react';
import { Button } from 'antd';
import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { history } from 'umi';

interface ProfileActionProps {
  memberId: string;
}

const ProfileAction: React.FC<ProfileActionProps> = () => {
  return (
    <>
      <Button 
        type="primary" 
        icon={<EditOutlined />}
        onClick={() => history.push('/user/profile/edit')}
      >
        Chỉnh sửa thông tin
      </Button>
      <Button 
        type="primary"
        ghost
        icon={<ReloadOutlined />}
        onClick={() => history.push('/user/renew-membership')}
      >
        Gia hạn gói tập
      </Button>
    </>
  );
};

export default ProfileAction;