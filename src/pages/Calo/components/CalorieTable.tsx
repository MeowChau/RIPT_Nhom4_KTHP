import React from 'react';
import { Card, Table, Tag, Button, Empty, Typography, Tooltip } from 'antd';
import { EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from '@/pages/Calo/components/index.less';

const { Text } = Typography;

interface CalorieTableProps {
  weeklyData: API.DailyCalorieSummary[];
  loading: boolean;
  onEdit?: (date: string) => void;
}

const CalorieTable: React.FC<CalorieTableProps> = ({ weeklyData, loading, onEdit }) => {
  const columns: any[] = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => moment(text).format('DD MMM YYYY'),
      sorter: (a: API.DailyCalorieSummary, b: API.DailyCalorieSummary) => 
        moment(a.date).valueOf() - moment(b.date).valueOf(),
    },
    {
      title: 'Lượng calo tiêu thụ',
      dataIndex: 'totalCaloIntake',
      key: 'totalCaloIntake',
      render: (value: number) => (
        <Text strong>{value} kcal</Text>
      ),
      sorter: (a: API.DailyCalorieSummary, b: API.DailyCalorieSummary) => 
        a.totalCaloIntake - b.totalCaloIntake,
    },
    {
      title: 'Mục tiêu Calo',
      dataIndex: 'caloTarget',
      key: 'caloTarget',
      render: (value: number) => (
        <Text>{value} kcal</Text>
      ),
    },
    {
      title: 'Chênh lệch',
      dataIndex: 'caloDiff',
      key: 'caloDiff',
      render: (value: number) => {
        let color = 'blue';
        let prefix = '';
        
        if (value > 0) {
          color = 'red';
          prefix = '+';
        } else if (value < 0) {
          color = 'green';
        }
        
        return (
          <Tag color={color}>
            {prefix}{value} kcal
          </Tag>
        );
      },
      sorter: (a: API.DailyCalorieSummary, b: API.DailyCalorieSummary) => 
        a.caloDiff - b.caloDiff,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: API.DailyCalorieSummary) => {
        const diff = record.caloDiff;
        
        if (diff > 300) {
          return <Tag color="red">Vượt mục tiêu</Tag>;
        } else if (diff < -300) {
          return <Tag color="green">Dưới mục tiêu</Tag>;
        } else {
          return <Tag color="blue">Đạt mục tiêu</Tag>;
        }
      },
      filters: [
        { text: 'Vượt mục tiêu', value: 'over' },
        { text: 'Đạt mục tiêu', value: 'on' },
        { text: 'Dưới mục tiêu', value: 'under' },
      ],
      onFilter: (value: string | number | boolean, record: API.DailyCalorieSummary) => {
        if (value === 'over') return record.caloDiff > 300;
        if (value === 'under') return record.caloDiff < -300;
        return record.caloDiff >= -300 && record.caloDiff <= 300;
      },
    },
  ];

  // Add edit action if onEdit is provided
  if (onEdit) {
    columns.push({
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: API.DailyCalorieSummary) => (
        <Button 
          type="link" 
          icon={<EditOutlined />} 
          onClick={() => onEdit(record.date)}
        >
          Sửa
        </Button>
      ),
    });
  }

  return (
    <Card 
      title={
        <div>
          Thống kê hàng ngày
          <Tooltip title="Nhấp vào tiêu đề cột để sắp xếp, hoặc sử dụng bộ lọc để tổ chức dữ liệu của bạn">
            <InfoCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </div>
      }
      className={styles.tableCard}
      bordered={false}
    >
      {weeklyData && weeklyData.length > 0 ? (
        <Table 
          dataSource={weeklyData}
          columns={columns}
          rowKey="date"
          loading={loading}
          pagination={false}
          rowClassName={(record) => 
            record.caloDiff > 300 
              ? styles.overRow 
              : record.caloDiff < -300 
              ? styles.underRow 
              : ''
          }
        />
      ) : (
        <Empty 
          description="Không tìm thấy dữ liệu nào. Hãy bắt đầu theo dõi lượng calo của bạn!"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
};

export default CalorieTable;