import React from 'react';
import { List, Badge, Avatar, Typography, Tooltip } from 'antd';
import type { ThongBao as IThongBao } from '@/services/Forum/typings';
import { formatTimeDistance, formatDateTime } from '@/utils/timeUtils';
import { Link } from 'umi';

const { Text } = Typography;

interface ThongBaoProps {
  thongBao: IThongBao;
  onClick: (thongBaoId: string) => void;
}

const ThongBao: React.FC<ThongBaoProps> = ({ thongBao, onClick }) => {
  const handleClick = () => {
    if (!thongBao.daDoc) {
      onClick(thongBao.id);
    }
  };

  let href = '/';
  if (thongBao.baiVietId) {
    href = `/bai-viet/${thongBao.baiVietId}`;
  }

  return (
    <Link to={href}>
      <List.Item 
        onClick={handleClick}
        style={{ 
          backgroundColor: thongBao.daDoc ? 'transparent' : '#f0f7ff',
          cursor: 'pointer',
          padding: '12px 16px'
        }}
      >
        <List.Item.Meta
          avatar={
            <Badge dot={!thongBao.daDoc}>
              <Avatar>{thongBao.tenNguoiThich[0]}</Avatar>
            </Badge>
          }
          title={
            <Text strong={!thongBao.daDoc}>
              {thongBao.noiDung}
            </Text>
          }
          description={
            <div>
              <Text type="secondary">Email: {thongBao.emailNguoiThich}</Text>
              <br />
              <Tooltip title={formatDateTime(thongBao.thoiGian)}>
                <Text type="secondary">{formatTimeDistance(thongBao.thoiGian)}</Text>
              </Tooltip>
            </div>
          }
        />
      </List.Item>
    </Link>
  );
};

export default ThongBao;
