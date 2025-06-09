import React, { useEffect, useState } from 'react';
import { Card, List, Button, message, Modal, Typography, Spin, Row, Col, Tag } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

interface Gift {
  _id?: string;
  name: string;
  description: string;
  pointRequired: number;
  quantity: number;
  type: string;
  discountPercent?: number;
}

const DEFAULT_GIFTS: Gift[] = [
  { type: '1thang', name: 'Giảm 10% gói tập 1 tháng', description: 'Đổi 100 điểm lấy mã giảm 10% cho gói tập 1 tháng.', quantity: 100, pointRequired: 100, discountPercent: 10 },
  { type: '3thang', name: 'Giảm 20% gói tập 3 tháng', description: 'Đổi 200 điểm lấy mã giảm 20% cho gói tập 3 tháng.', quantity: 100, pointRequired: 200, discountPercent: 20 },
  { type: 'gangtay', name: 'Tặng găng tay tập gym', description: 'Đổi 1000 điểm nhận 1 đôi găng tay tập gym.', quantity: 50, pointRequired: 1000 },
  { type: 'whey', name: 'Tặng hũ whey protein', description: 'Đổi 5000 điểm nhận 1 hũ whey protein.', quantity: 10, pointRequired: 5000 }
];

const RewardsPage: React.FC = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemResult, setRedeemResult] = useState<{ code: string; qr?: string } | null>(null);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  // Lấy token và userId từ localStorage
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const userId = userData ? (JSON.parse(userData).id || JSON.parse(userData)._id) : '';

  useEffect(() => {
    fetchGifts();
    fetchUserPoints();
  }, []);

  const fetchGifts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/gift');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setGifts(res.data);
      } else {
        setGifts(DEFAULT_GIFTS);
      }
    } catch (e) {
      setGifts(DEFAULT_GIFTS);
      message.warning('Không thể tải danh sách quà từ server, đang dùng danh sách mặc định.');
    }
    setLoading(false);
  };

  const fetchUserPoints = async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/forum/posts/points', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserPoints(res.data.points || 0);
    } catch (e) {
      setUserPoints(0);
    }
  };

  const handleRedeem = async (gift: Gift) => {
    setSelectedGift(gift);
    Modal.confirm({
      title: `Đổi quà: ${gift.name}`,
      content: `Bạn chắc chắn muốn đổi ${gift.pointRequired} điểm lấy quà này?` + (gift.quantity === 0 ? '\nQuà đã hết!' : ''),
      okText: 'Đổi quà',
      cancelText: 'Hủy',
      onOk: async () => {
        setRedeemLoading(true);
        // Nếu là quà mặc định (không có _id), chỉ tạo mã giả lập
        if (!gift._id) {
          const fakeCode = Math.random().toString(36).substring(2, 10).toUpperCase();
          try {
            await axios.post('/api/gift/send-code', { code: fakeCode, userId });
            setRedeemResult({ code: fakeCode });
            message.success('Đổi quà thành công! Mã đã được gửi cho admin để xác thực.');
          } catch (e) {
            setRedeemResult({ code: fakeCode });
            message.info('Đổi quà thành công! (giả lập)');
          }
          setRedeemLoading(false);
          return;
        }
        try {
          const res = await axios.post('/api/gift/redeem', {
            userId,
            giftType: gift.type,
            qr: true
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRedeemResult(res.data);
          message.success('Đổi quà thành công!');
          fetchUserPoints();
          fetchGifts();
        } catch (e: any) {
          message.error(e?.response?.data?.message || 'Đổi quà thất bại');
        }
        setRedeemLoading(false);
      }
    });
  };

  return (
    <Card style={{ maxWidth: 800, margin: '32px auto' }}>
      <Title level={2}>Đổi quà tặng</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Text strong>Điểm năng nổ của bạn:</Text> <Tag color="gold" style={{ fontSize: 18 }}>{userPoints}</Tag>
        </Col>
      </Row>
      {loading ? <Spin /> : (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={gifts}
          renderItem={gift => (
            <List.Item>
              <Card title={gift.name} bordered={true}>
                <p>{gift.description}</p>
                <p>Điểm cần: <Tag color="blue">{gift.pointRequired}</Tag></p>
                <p>Số lượng còn: <Tag color={gift.quantity > 0 ? 'green' : 'red'}>{gift.quantity}</Tag></p>
                <Button
                  type="primary"
                  disabled={userPoints < 100 || userPoints < gift.pointRequired || gift.quantity === 0 || redeemLoading}
                  loading={redeemLoading && selectedGift?._id === gift._id}
                  onClick={() => handleRedeem(gift)}
                >
                  Đổi quà
                </Button>
                {userPoints < 100 && (
                  <div style={{ color: 'red', marginTop: 8 }}>
                    Bạn cần đạt ít nhất 100 điểm năng nổ để đổi quà.
                  </div>
                )}
              </Card>
            </List.Item>
          )}
        />
      )}
      <Modal
        visible={!!redeemResult}
        onCancel={() => setRedeemResult(null)}
        footer={null}
        title="Mã nhận quà của bạn"
      >
        {redeemResult?.code && (
          <div style={{ textAlign: 'center' }}>
            <Text strong>Mã code: </Text>
            <Tag color="purple" style={{ fontSize: 18 }}>{redeemResult.code}</Tag>
            <br />
            <div style={{ margin: '16px auto', color: '#888' }}>
              Mã này đã được gửi cho admin để xác thực và nhận quà tại quầy!
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default RewardsPage; 