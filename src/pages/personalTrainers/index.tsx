import React, { useEffect, useState } from 'react';
import { Table, Button, message, Popconfirm, Typography, Card, Tag } from 'antd';
import { Link } from 'umi';
import { queryPTs, deletePT } from '@/services/personalTrainer';

const { Text, Title } = Typography;

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const statusDisplayMap: Record<string, string> = {
  off: 'Off',
  morning: 'Morning',
  afternoon: 'Afternoon',
  on: 'Free',  // Thay "on" thành "Free"
};

const statusColorMap: Record<string, string> = {
  off: 'red',
  morning: 'orange',
  afternoon: 'blue',
  on: 'green',  // "Free" color là green
};

const PersonalTrainersPage: React.FC = () => {
  const [pts, setPTs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPTs();
  }, []);

  const fetchPTs = async () => {
    setLoading(true);
    try {
      const data = await queryPTs();
      setPTs(data);
    } catch {
      message.error('Không tải được danh sách huấn luyện viên');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePT(id);
      message.success('Xóa huấn luyện viên thành công');
      fetchPTs();
    } catch {
      message.error('Xóa thất bại');
    }
  };

  const columns = [
    { title: 'Tên PT', dataIndex: 'name', key: 'name' },
    {
      title: 'Cơ sở',
      dataIndex: ['gymId', 'name'],
      key: 'gym',
      render: (text: string) => <Text strong>{text || 'Chưa xác định'}</Text>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description', // Cột mô tả
      key: 'description',
      render: (text: string) => <Text>{text || 'Chưa có mô tả'}</Text>, // Hiển thị mô tả
    },
    {
      title: 'Lịch làm việc',
      key: 'schedule',
      render: (_: any, record: any) => {
        if (!record.schedule || record.schedule.length === 0) return <Text type="secondary">Chưa có lịch</Text>;

        return (
          <Card size="small" bordered={false} style={{ background: '#fafafa' }}>
            {daysOfWeek.map(day => {
              const daySchedule = record.schedule.find((s: any) => s.day === day);
              return (
                <div key={day}>
                  <Text strong>{day}:</Text>{' '}
                  <Tag color={statusColorMap[daySchedule?.status] || 'default'}>
                    {statusDisplayMap[daySchedule?.status] || 'Off'}
                  </Tag>
                </div>
              );
            })}
          </Card>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <>
          <Link to={`/personalTrainers/edit?id=${record._id}`}>
            <Button type="link">Sửa</Button>
          </Link>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        Quản lý Huấn luyện viên (PT)
      </Title>
      <Link to="/personalTrainers/edit">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Thêm huấn luyện viên
        </Button>
      </Link>
      <Table dataSource={pts} columns={columns} rowKey="_id" loading={loading} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default PersonalTrainersPage;
