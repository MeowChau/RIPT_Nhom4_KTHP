import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Typography, Avatar, Space, Divider, Button } from 'antd';
import { UserOutlined, MailOutlined, LikeOutlined, LikeFilled } from '@ant-design/icons';
import { useParams, history } from 'umi';
import useBaiViet from '@/models/forum/useBaiViet';
import BinhLuan from '@/pages/Forum/components/BinhLuan';
import { formatTimeDistance } from '@/utils/timeUtils';

const { Title, Paragraph, Text } = Typography;

const ChiTietBaiViet: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { baiVietHienTai, layBaiVietTheoId, thichBaiViet } = useBaiViet();
  
  useEffect(() => {
    if (id) {
      layBaiVietTheoId(id);
    }
  }, [id, layBaiVietTheoId]);
  
  if (!baiVietHienTai) {
    return (
      <PageContainer>
        <Card>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            Đang tải thông tin bài viết...
          </div>
        </Card>
      </PageContainer>
    );
  }
  
  const handleThichBaiViet = () => {
    if (baiVietHienTai) {
      thichBaiViet(baiVietHienTai.id);
    }
  };
  
  return (
    <PageContainer
      header={{
        title: 'Chi tiết bài viết',
        onBack: () => history.push('/user/forum')
      }}
    >
      <Card bordered={false}>
        <Title level={2}>{baiVietHienTai.tieuDe}</Title>
        
        <Space align="start">
          <Avatar icon={<UserOutlined />}>{baiVietHienTai.tenNguoiDang?.[0] || 'U'}</Avatar>
          <div>
            <Text strong>{baiVietHienTai.tenNguoiDang || 'Người dùng ẩn danh'}</Text>
            {baiVietHienTai.emailNguoiDang && (
              <div>
                <MailOutlined style={{ marginRight: 8 }} />
                <Text type="secondary">{baiVietHienTai.emailNguoiDang}</Text>
              </div>
            )}
            <div>
              <Text type="secondary">
                {baiVietHienTai.thoiGianDang 
                  ? formatTimeDistance(baiVietHienTai.thoiGianDang) 
                  : 'Vừa xong'}
              </Text>
            </div>
          </div>
        </Space>
        
        <Paragraph style={{ marginTop: 24, fontSize: 16 }}>
          {baiVietHienTai.noiDung}
        </Paragraph>
        
        <div style={{ marginTop: 16, marginBottom: 24 }}>
          <Button 
            type={baiVietHienTai.daNhanThich ? 'primary' : 'default'}
            icon={baiVietHienTai.daNhanThich ? <LikeFilled /> : <LikeOutlined />}
            onClick={handleThichBaiViet}
          >
            {baiVietHienTai.daNhanThich ? 'Đã thích' : 'Thích'} ({baiVietHienTai.soLuotThich || 0})
          </Button>
        </div>
        
        <Divider>Bình luận</Divider>
        
        {/* Sử dụng component BinhLuan đã có sẵn */}
        <BinhLuan baiVietId={baiVietHienTai.id} />
      </Card>
    </PageContainer>
  );
};

export default ChiTietBaiViet;