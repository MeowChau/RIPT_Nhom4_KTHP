import React, { useState, useEffect } from 'react';
import { Card, Input, Button, message, Typography, Tag, List, Space, Tabs } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface GiftCode {
  _id: string;
  code: string;
  userId: string;
  giftType: string;
  used: boolean;
  createdAt: string;
  user?: { name?: string; email?: string };
}

const XacThucDoiQua: React.FC = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [codes, setCodes] = useState<GiftCode[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [giftNotifications, setGiftNotifications] = useState<any[]>([]);
  const [loadingNoti, setLoadingNoti] = useState(false);

  useEffect(() => {
    fetchCodes();
    fetchGiftNotifications();
  }, [refresh]);

  const fetchCodes = async () => {
    try {
      const res = await axios.get('/api/gift/codes/all');
      setCodes(res.data);
    } catch (e) {
      setCodes([]);
    }
  };

  const fetchGiftNotifications = async () => {
    setLoadingNoti(true);
    try {
      const res = await axios.get('/api/gift/notifications/gift-admin');
      setGiftNotifications(res.data);
    } catch (e) {
      setGiftNotifications([]);
    }
    setLoadingNoti(false);
  };

  const handleVerify = async (inputCode?: string) => {
    const verifyCode = inputCode || code;
    if (!verifyCode) {
      message.warning('Vui lòng nhập mã đổi quà!');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/gift/verify', { code: verifyCode });
      setResult(res.data.message || 'Đổi quà thành công!');
      message.success(res.data.message || 'Đổi quà thành công!');
      setRefresh(r => r + 1);
    } catch (e: any) {
      setResult(e?.response?.data?.message || 'Mã không hợp lệ hoặc đã dùng!');
      message.error(e?.response?.data?.message || 'Mã không hợp lệ hoặc đã dùng!');
    }
    setLoading(false);
  };

  return (
    <Card style={{ maxWidth: 700, margin: '32px auto' }}>
      <Title level={3}>Xác thực mã đổi quà</Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Thông báo đổi quà" key="1">
          <List
            loading={loadingNoti}
            dataSource={giftNotifications}
            locale={{ emptyText: 'Chưa có thông báo đổi quà nào.' }}
            renderItem={item => (
              <List.Item>
                <Space direction="vertical">
                  <Text strong>{item.message}</Text>
                  <Text type="secondary">Người nhận: <Tag color="default">{item.userId}</Tag></Text>
                  <Text type="secondary">Thời gian: {new Date(item.createdAt).toLocaleString()}</Text>
                </Space>
              </List.Item>
            )}
            style={{ marginBottom: 24 }}
          />
        </TabPane>
        <TabPane tab="Xác thực mã đổi quà" key="2">
          <Input
            placeholder="Nhập mã đổi quà từ khách hàng"
            value={code}
            onChange={e => setCode(e.target.value)}
            style={{ marginBottom: 16, maxWidth: 300 }}
            onPressEnter={() => handleVerify()}
          />
          <Button type="primary" onClick={() => handleVerify()} loading={loading} style={{ marginBottom: 24 }}>
            Xác thực
          </Button>
          {result && (
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Tag color={result.includes('thành công') ? 'green' : 'red'} style={{ fontSize: 16 }}>{result}</Tag>
            </div>
          )}
          <Title level={4} style={{ marginTop: 32 }}>Danh sách mã đổi quà chưa xác thực</Title>
          <List
            bordered
            dataSource={codes}
            locale={{ emptyText: (
              <div>
                <div>Không có mã đổi quà nào chờ xác thực.</div>
                <div style={{ color: '#888', marginTop: 8 }}>
                  Hãy yêu cầu khách hàng đổi quà và chắc chắn đã gửi mã lên hệ thống.<br/>
                  Nếu vẫn không thấy, hãy thử reload trang hoặc kiểm tra lại backend.
                </div>
              </div>
            ) }}
            renderItem={item => (
              <List.Item actions={[
                <Button type="link" onClick={() => handleVerify(item.code)} key="verify">Xác thực</Button>
              ]}>
                <Space direction="vertical">
                  <Text strong>Mã: <Tag color="purple">{item.code}</Tag></Text>
                  <Text>Loại quà: <Tag color="blue">{item.giftType}</Tag></Text>
                  <Text>Người nhận: <Tag color="default">{item.user?.name || item.userId}</Tag></Text>
                  {item.user?.email && <Text>Email: <Tag color="default">{item.user.email}</Tag></Text>}
                  <Text type="secondary">Tạo lúc: {new Date(item.createdAt).toLocaleString()}</Text>
                </Space>
              </List.Item>
            )}
            style={{ marginTop: 16 }}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default XacThucDoiQua; 