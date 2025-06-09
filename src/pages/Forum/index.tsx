import { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Input, Space, Badge, Button, Card, Modal, message } from 'antd';
import { BellOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import BaiViet from '@/pages/Forum/components/BaiViet';
import type { BaiVietProps } from '@/pages/Forum/components/BaiViet';
import useBaiViet from '@/models/forum/useBaiViet';
import useThongBao from '@/models/forum/useThongBao';
import RewardsPage from '../Rewards';
import axios from 'axios';

// Define the type using the props from the BaiViet component
type BaiVietType = BaiVietProps['baiViet'];

export default () => {
  const { danhSachBaiViet, tuKhoaTimKiem, layDanhSachBaiViet, thichBaiViet, xoaBaiViet } = useBaiViet();

  const { soThongBaoChuaDoc } = useThongBao();

  const [showRewards, setShowRewards] = useState(false);

  // Bộ đếm thời gian tổng hợp
  const [nextRun, setNextRun] = useState<number>(60);
  const [lastDuration, setLastDuration] = useState<number | null>(null);
  const [lastRun, setLastRun] = useState<string | null>(null);

  // Thông báo điểm năng nổ tự động
  const [autoPointNoti, setAutoPointNoti] = useState<string | null>(null);

  // Luôn lấy danh sách bài viết mới nhất khi vào trang
  useEffect(() => {
    // Đảm bảo lấy dữ liệu mới nhất từ localStorage
    layDanhSachBaiViet(tuKhoaTimKiem);
  }, [tuKhoaTimKiem]);

  const handleTimKiem = (tuKhoa: string) => {
    layDanhSachBaiViet(tuKhoa);
  };

  // Hàm nhận điểm năng nổ
  const handleClaimPoints = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/forum/posts/claim-points', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success(res.data.message || 'Nhận điểm năng nổ thành công!');
      layDanhSachBaiViet(tuKhoaTimKiem); // reload lại danh sách bài viết
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Không thể nhận điểm năng nổ.');
    }
  };

  // Hàm lấy thông tin thời gian tổng hợp từ backend (giả lập qua API log)
  const fetchCronStatus = async () => {
    try {
      // Giả lập: gọi API lấy log cron gần nhất (cần backend hỗ trợ nếu muốn realtime)
      // Ở đây sẽ random số cho demo
      // Nếu backend có API thực, thay thế đoạn này bằng fetch thực tế
      setLastDuration(Math.floor(Math.random() * 1000) + 100); // ms
      setLastRun(new Date().toLocaleString());
    } catch {
      setLastDuration(null);
      setLastRun(null);
    }
  };

  useEffect(() => {
    // Đếm ngược đến lần tổng hợp tiếp theo
    const timer = setInterval(() => {
      setNextRun((prev) => {
        if (prev <= 1) {
          fetchCronStatus(); // Cập nhật thời gian thực thi mới
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get('/api/forum/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (Array.isArray(res.data) && res.data.length > 0) {
          const latest = res.data[0];
          setAutoPointNoti(latest.message + ' (' + new Date(latest.createdAt).toLocaleString() + ')');
        }
      } catch {}
    };
    fetchNotifications();
  }, [nextRun]);

  return (
    <PageContainer
      header={{
        title: 'Diễn đàn Hội viên Gym',
        extra: [
          <Link to="/thong-bao" key="thongbao">
            <Badge count={soThongBaoChuaDoc} overflowCount={99}>
              <Button icon={<BellOutlined />}>Thông báo</Button>
            </Badge>
          </Link>,
          <Button 
            key="create" 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => history.push('/user/forum/bai-viet')}
          >
            Tạo bài viết
          </Button>,
          <Button
            key="rewards"
            type="default"
            icon={<span role="img" aria-label="gift">🎁</span>}
            onClick={() => setShowRewards(true)}
          >
            Đổi quà
          </Button>,
          // <Button
          //   key="claim-points"
          //   type="dashed"
          //   icon={<span role="img" aria-label="fire">🔥</span>}
          //   onClick={handleClaimPoints}
          // >
          //   Nhận điểm năng nổ
          // </Button>
        ]
      }}
    >
      {/* Bộ đếm thời gian tổng hợp */}
      {autoPointNoti && (
        <Card style={{ marginBottom: 16, background: '#fffbe6', border: '1px solid #ffe58f' }}>
          <b>🔔 Thông báo:</b> {autoPointNoti}
        </Card>
      )}
      <Card style={{ marginBottom: 16, background: '#f6ffed', border: '1px solid #b7eb8f' }}>
        <b>⏳ Bộ đếm tổng hợp năng nổ:</b>
        <div>Thời gian đến lần tổng hợp tiếp theo: <b>{nextRun}s</b></div>
        {lastDuration !== null && lastRun && (
          <div>
            Lần tổng hợp gần nhất: <b>{lastRun}</b> | Thời gian thực thi: <b>{lastDuration} ms</b>
          </div>
        )}
      </Card>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card bordered={false}>
          <Input.Search
            placeholder="Tìm kiếm bài viết"
            allowClear
            enterButton="Tìm kiếm"
            size="large"
            onSearch={handleTimKiem}
            style={{ marginBottom: 16 }}
          />
          {danhSachBaiViet.length > 0 ? (
            danhSachBaiViet.map((baiViet: BaiVietType) => (
              <BaiViet
                key={baiViet.id}
                baiViet={baiViet}
                onThich={thichBaiViet}
                onXoa={xoaBaiViet}
              />
            ))
          ) : (
            tuKhoaTimKiem ? `Không tìm thấy kết quả cho '${tuKhoaTimKiem}'` : 
            'Chưa có bài viết nào'
          )}
        </Card>
      </Space>
      <Modal
        visible={showRewards}
        onCancel={() => setShowRewards(false)}
        footer={null}
        width={900}
        title="Đổi quà tặng"
      >
        <RewardsPage />
      </Modal>
    </PageContainer>
  );
};