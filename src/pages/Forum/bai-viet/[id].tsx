import { useEffect } from 'react';
import { useParams, history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Typography, Space, Avatar, Button, Form, Input, List, Divider } from 'antd';
import { ArrowLeftOutlined, LikeOutlined, LikeFilled } from '@ant-design/icons';
import useBaiViet from '@/models/forum/useBaiViet';
import useBinhLuan from '@/models/forum/useBinhLuan';
import BinhLuan from '@/pages/Forum/components/BinhLuan';
import { formatTimeDistance, formatDateTime } from '@/utils/timeUtils';

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

export default () => {
  const { id } = useParams<{ id: string }>();
  const { baiVietHienTai, dangTai, layBaiVietTheoId, thichBaiViet } = useBaiViet();
  const { danhSachBinhLuan, dangTai: dangTaiBinhLuan, layDanhSachBinhLuan, themBinhLuan, thichBinhLuan } = useBinhLuan();
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      layBaiVietTheoId(id);
      layDanhSachBinhLuan(id);
    }
  }, [id, layBaiVietTheoId, layDanhSachBinhLuan]);

  const handleGuiBinhLuan = async (values: { noiDung: string }) => {
    if (id) {
      const success = await themBinhLuan({
        baiVietId: id,
        noiDung: values.noiDung
      });
      
      if (success) {
        form.resetFields();
      }
    }
  };

  if (dangTai || !baiVietHienTai) {
    return <div>Đang tải...</div>;
  }

  return (
    <PageContainer
      header={{
        title: baiVietHienTai.tieuDe,
        onBack: () => history.push('/'),
        backIcon: <ArrowLeftOutlined />
      }}
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card bordered={false}>
          <Space align="start" style={{ marginBottom: 16 }}>
            <Avatar size={40}>{baiVietHienTai.tenNguoiDang[0]}</Avatar>
            <div>
              <Text strong>{baiVietHienTai.tenNguoiDang}</Text>
              <br />
              <Text type="secondary" title={formatDateTime(baiVietHienTai.thoiGianDang)}>
                {formatTimeDistance(baiVietHienTai.thoiGianDang)}
              </Text>
            </div>
          </Space>
          
          <Paragraph style={{ fontSize: 16 }}>
            {baiVietHienTai.noiDung}
          </Paragraph>
          
          <div style={{ marginTop: 16 }}>
            <Button
              icon={baiVietHienTai.daNhanThich ? <LikeFilled style={{ color: '#1890ff' }} /> : <LikeOutlined />}
              onClick={() => thichBaiViet(baiVietHienTai.id)}
            >
              <span style={baiVietHienTai.daNhanThich ? { color: '#1890ff' } : {}}>
                {baiVietHienTai.soLuotThich} Thích
              </span>
            </Button>
          </div>
        </Card>

        <Card bordered={false} title="Bình luận">
          <Form 
            form={form}
            onFinish={handleGuiBinhLuan}
          >
            <Form.Item
              name="noiDung"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung bình luận' }]}
            >
              <TextArea rows={4} placeholder="Viết bình luận của bạn..." />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={dangTaiBinhLuan}>
                Gửi bình luận
              </Button>
            </Form.Item>
          </Form>
          
          <Divider />
          
          <List
            loading={dangTaiBinhLuan}
            dataSource={danhSachBinhLuan}
            locale={{ emptyText: 'Chưa có bình luận nào' }}
            renderItem={binhLuan => (
              <BinhLuan 
                key={binhLuan.id}
                binhLuan={binhLuan}
                onThich={thichBinhLuan}
              />
            )}
          />
        </Card>
      </Space>
    </PageContainer>
  );
};