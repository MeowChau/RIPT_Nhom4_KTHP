import { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { List, Card, Empty, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { history, useModel } from 'umi';
import ThongBao from '@/pages/Forum/components/ThongBao';
import useThongBao from '@/models/forum/useThongBao';

export default () => {
  const { initialState } = useModel('@@initialState');
  const { danhSachThongBao, dangTai, layDanhSachThongBao, danhDauDaDoc } = useThongBao();

  useEffect(() => {
    if (initialState?.currentUser) {
      layDanhSachThongBao();
    }
  }, [layDanhSachThongBao, initialState?.currentUser]);

  return (
    <PageContainer
      header={{
        title: 'Thông báo',
        onBack: () => history.push('/'),
        backIcon: <ArrowLeftOutlined />
      }}
    >
      <Card bordered={false}>
        {dangTai ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Spin />
          </div>
        ) : (
          <List
            dataSource={danhSachThongBao}
            renderItem={thongBao => (
              <ThongBao 
                key={thongBao.id} 
                thongBao={thongBao} 
                onClick={danhDauDaDoc}
              />
            )}
            locale={{
              emptyText: <Empty description="Không có thông báo nào" />
            }}
          />
        )}
      </Card>
    </PageContainer>
  );
};