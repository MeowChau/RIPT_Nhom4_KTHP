import { Card, List, Button } from 'antd';
import { history } from 'umi';

const TienIchIndex = () => {
  const data = [
    {
      title: 'Xác thực mã đổi quà',
      link: '/TienIch/XacThucDoiQua',
      description: 'Nhập mã đổi quà từ khách hàng để xác thực và trừ số lượng quà.'
    },
    {
      title: 'Giới thiệu',
      link: '/TienIch/GioiThieu',
      description: 'Giới thiệu về hệ thống.'
    }
  ];
  return (
    <Card title="Tiện ích quản trị" style={{ maxWidth: 600, margin: '32px auto' }}>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={
                <Button type="link" onClick={() => history.push(item.link)}>
                  {item.title}
                </Button>
              }
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TienIchIndex; 