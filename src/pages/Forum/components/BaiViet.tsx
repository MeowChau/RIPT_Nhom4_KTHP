import React from 'react';
import { Card, Avatar, Space, Typography, Button, Tooltip, Tag } from 'antd';
import { LikeOutlined, LikeFilled, CommentOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import type { BaiViet as IBaiViet } from '@/services/Forum/typings';
import { formatTimeDistance } from '../../../utils/timeUtils';

const { Title, Paragraph, Text } = Typography;

export interface BaiVietProps {
  baiViet: IBaiViet;
  onThich: (baiVietId: string) => void;
}

const BaiViet: React.FC<BaiVietProps> = ({ baiViet, onThich }) => {
  // Kiểm tra và đảm bảo các trường dữ liệu tồn tại
  const tenNguoiDang = baiViet?.tenNguoiDang || 'Người dùng';
  const avatarText = tenNguoiDang ? tenNguoiDang[0] : 'U';
  
  // Đảm bảo có email để hiển thị
  const emailNguoiDang = baiViet?.emailNguoiDang;

  // Debug để xem đang nhận được gì
  console.log('Dữ liệu bài viết:', baiViet);
  
  return (
    <Card style={{ marginBottom: 16 }} bordered={false}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Space>
          <Avatar icon={<UserOutlined />}>{avatarText}</Avatar>
          <div>
            <div style={{ marginBottom: 4 }}>
              <Text strong style={{ marginRight: 8 }}>{tenNguoiDang}</Text>
              
              {emailNguoiDang ? (
                <Tag color="blue" icon={<MailOutlined />}>
                  {emailNguoiDang}
                </Tag>
              ) : (
                <Tag color="orange" icon={<MailOutlined />}>
                  Chưa có email
                </Tag>
              )}
            </div>
            <Tooltip title={baiViet.thoiGianDang ? new Date(baiViet.thoiGianDang).toLocaleString() : ''}>
              <Text type="secondary">{baiViet.thoiGianDang ? formatTimeDistance(baiViet.thoiGianDang) : 'Vừa xong'}</Text>
            </Tooltip>
          </div>
        </Space>
      </div>
      
      <div style={{ margin: '16px 0' }}>
        <Link to={`/user/forum/bai-viet/${baiViet.id}`}>
          <Title level={4}>{baiViet.tieuDe || 'Không có tiêu đề'}</Title>
        </Link>
        <Paragraph
          ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}
        >
          {baiViet.noiDung || 'Không có nội dung'}
        </Paragraph>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button 
            type="text"
            icon={baiViet.daNhanThich ? <LikeFilled style={{ color: '#1890ff' }} /> : <LikeOutlined />}
            onClick={() => onThich(baiViet.id)}
          >
            <span style={baiViet.daNhanThich ? { color: '#1890ff' } : {}}>
              {baiViet.soLuotThich || 0} Thích
            </span>
          </Button>
          
          <Link to={`/user/forum/bai-viet/${baiViet.id}`}>
            <Button type="text" icon={<CommentOutlined />}>
              {baiViet.soLuongBinhLuan || 0} Bình luận
            </Button>
          </Link>
        </Space>
      </div>
    </Card>
  );
};

export default BaiViet;