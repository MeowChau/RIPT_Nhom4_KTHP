import React from 'react';
import { Table, Typography, Card, Tag, Button, Space, Popconfirm } from 'antd';
import { DeleteOutlined, HistoryOutlined, LineChartOutlined } from '@ant-design/icons';
import type { HealthRecord } from '@/services/TDEE/typings';
import { deleteHistoryRecord } from '@/services/TDEE/index';

const { Title, Text } = Typography;

interface HistoryRecordProps {
  records: HealthRecord[];
}

const HistoryRecord: React.FC<HistoryRecordProps> = ({ records }) => {
  if (!records || records.length === 0) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <HistoryOutlined style={{ fontSize: 48, color: '#ccc' }} />
          <Typography.Title level={4}>Không có lịch sử tính toán</Typography.Title>
          <Text type="secondary">
            Thông tin sẽ được hiển thị ở đây sau khi bạn tính chỉ số BMI và TDEE
          </Text>
        </div>
      </Card>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteHistoryRecord(id);
      // Reload sẽ được xử lý trong useHealthCalculator hook
    } catch (error) {
      console.error('Không thể xóa bản ghi:', error);
    }
  };

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: string) => new Date(text).toLocaleString('vi-VN')
    },
    {
      title: 'BMI',
      dataIndex: 'bmi',
      key: 'bmi',
      render: (bmi: number, record: any) => (
        <span>
          {bmi.toFixed(1)} <Tag color={
            record.bmiCategory === 'Bình thường' ? 'green' : 
            record.bmiCategory === 'Thiếu cân' ? 'blue' : 'orange'
          }>{record.bmiCategory}</Tag>
        </span>
      )
    },
    {
      title: 'TDEE',
      dataIndex: 'tdee',
      key: 'tdee',
      render: (tdee: number) => `${tdee} calo/ngày`
    },
    {
      title: 'Mục tiêu',
      dataIndex: 'goal',
      key: 'goal',
      render: (goal: string) => {
        let color = 'green';
        let text = 'Duy trì';
        if (goal === 'lose_weight') {
          color = 'blue';
          text = 'Giảm cân';
        } else if (goal === 'gain_weight') {
          color = 'orange';
          text = 'Tăng cân';
        }
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: HealthRecord) => (
        <Space size="small">
          <Popconfirm
            title="Bạn có chắc muốn xóa bản ghi này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}><LineChartOutlined /> Lịch sử tính toán</Title>
      <Table 
        dataSource={records} 
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default HistoryRecord;