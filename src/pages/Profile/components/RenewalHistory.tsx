import React from 'react';
import { Card, Table, Typography, Tag } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from '@/pages/Profile/components/index.less';

const { Title } = Typography;

interface RenewalHistoryProps {
  renewalHistory: MemberAPI.RenewalRecord[];
}

const RenewalHistory: React.FC<RenewalHistoryProps> = ({ renewalHistory }) => {
  if (!renewalHistory || renewalHistory.length === 0) {
    return null;
  }

  // Format ngày tháng
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return moment(dateString).format('DD/MM/YYYY');
  };

  // Cột cho bảng lịch sử gia hạn
  const columns = [
    {
      title: 'Ngày gia hạn',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Gói tập',
      dataIndex: 'package',
      key: 'package',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let text = status;
        
        switch (status) {
          case 'active':
            color = 'green';
            text = 'Đang hoạt động';
            break;
          case 'expired':
            color = 'red';
            text = 'Hết hạn';
            break;
          case 'pending':
            color = 'orange';
            text = 'Đang chờ';
            break;
          default:
            break;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <Card 
      className={styles.historyCard} 
      title={<Title level={4}><HistoryOutlined /> Lịch sử gia hạn</Title>}
    >
      <Table 
        dataSource={renewalHistory.map((item, index) => ({...item, key: index}))} 
        columns={columns}
        pagination={false}
      />
    </Card>
  );
};

export default RenewalHistory;