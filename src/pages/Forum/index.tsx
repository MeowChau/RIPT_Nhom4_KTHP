import { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Input, Space, Badge, Button, Card } from 'antd';
import { BellOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, history } from 'umi';
import BaiViet from '@/pages/Forum/components/BaiViet';
import type { BaiVietProps } from '@/pages/Forum/components/BaiViet';
import useBaiViet from '@/models/forum/useBaiViet';
import useThongBao from '@/models/forum/useThongBao';

// Define the type using the props from the BaiViet component
type BaiVietType = BaiVietProps['baiViet'];

export default () => {
  const { danhSachBaiViet, tuKhoaTimKiem, layDanhSachBaiViet, thichBaiViet } = useBaiViet();

  const { soThongBaoChuaDoc } = useThongBao();

  // Luôn lấy danh sách bài viết mới nhất khi vào trang
  useEffect(() => {
    // Đảm bảo lấy dữ liệu mới nhất từ localStorage
    layDanhSachBaiViet(tuKhoaTimKiem);
  }, [tuKhoaTimKiem]);

  const handleTimKiem = (tuKhoa: string) => {
    layDanhSachBaiViet(tuKhoa);
  };

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
          </Button>
        ]
      }}
    >
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
              />
            ))
          ) : (
            tuKhoaTimKiem ? `Không tìm thấy kết quả cho '${tuKhoaTimKiem}'` : 
            'Chưa có bài viết nào'
          )}
        </Card>
      </Space>
    </PageContainer>
  );
};