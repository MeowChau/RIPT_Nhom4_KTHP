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
          return <Tag color="red">Over Target</Tag>;
        } else if (diff < -300) {
          return <Tag color="green">Under Target</Tag>;
        } else {
          return <Tag color="blue">On Target</Tag>;
        }
      },
      filters: [
        { text: 'Over Target', value: 'over' },
        { text: 'On Target', value: 'on' },
        { text: 'Under Target', value: 'under' },
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
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: API.DailyCalorieSummary) => (
        <Button 
          type="link" 
          icon={<EditOutlined />} 
          onClick={() => onEdit(record.date)}
        >
          Edit
        </Button>
      ),
    });
  }

  return (
    <Card 
      title={
        <div>
          Daily Records
          <Tooltip title="Click on column headers to sort, or use filters to organize your data">
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
          description="No entries found. Start tracking your calories!"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
};

export default CalorieTable;