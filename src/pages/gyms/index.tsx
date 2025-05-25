import React, { useEffect, useState } from 'react';
import { Table, Button, message, Popconfirm, Tag } from 'antd';
import axios from 'axios';
import AddGymForm from '@/pages/gyms/AddGymForm';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const GymsPage: React.FC = () => {
  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [editGym, setEditGym] = useState<any>(null);

  const fetchGyms = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/gyms');
      setGyms(res.data);
    } catch {
      message.error('Không tải được danh sách cơ sở');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGyms();
  }, []);

const handleAddGym = async (values: any) => {
  try {
    if (editGym) {
      await axios.put(`/api/gyms/${editGym._id}`, values);
      message.success('Cập nhật cơ sở thành công');
      setEditGym(null);
    } else {
      await axios.post('/api/gyms', values);
      message.success('Thêm cơ sở thành công');
    }
    setVisibleAdd(false);
    fetchGyms();
  } catch (error: any) {
    console.error('Lỗi API:', error.response?.data || error.message);
    message.error(`Thao tác thất bại: ${error.response?.data?.message || error.message}`);
  }
};

  const handleDeleteGym = async (id: string) => {
    try {
      await axios.delete(`/api/gyms/${id}`);
      message.success('Xóa cơ sở thành công');
      fetchGyms();
    } catch {
      message.error('Xóa cơ sở thất bại');
    }
  };

  const columns = [
    { title: 'Tên cơ sở', dataIndex: 'name', key: 'name' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Diện tích (m²)', dataIndex: 'area', key: 'area' },

    ...daysOfWeek.map(day => ({
      title: `Giờ hoạt động ${day}`,
      key: `workingHours_${day}`,
      render: (_: any, record: any) => {
        const wh = record.workingHours?.[day];
        if (!wh) return '-';

        // Kiểm tra open và close: phải là chuỗi không rỗng, nếu không có thì hiển thị "-"
        const open = typeof wh.open === 'string' && wh.open.trim() !== '' ? wh.open : '-';
        const close = typeof wh.close === 'string' && wh.close.trim() !== '' ? wh.close : '-';

        return (
          <>
            <span>{open} - {close}</span>{' '}
            {wh.active ? <Tag color="green">ON</Tag> : <Tag color="red">OFF</Tag>}
          </>
        );
      },
    })),

    {
      title: 'Dụng cụ',
      key: 'equipment',
      render: (_: any, record: any) => {
        if (!record.equipment || record.equipment.length === 0) return '-';
        return record.equipment.map((eq: any, idx: number) => (
          <div key={idx}>
            {eq.name} ({eq.quantity})
          </div>
        ));
      }
    },

    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditGym(record);
              setVisibleAdd(true);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xóa cơ sở này?"
            onConfirm={() => handleDeleteGym(record._id)}
            okText="Xóa"
            cancelText="Hủy"
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
    <div>
      <h1>Quản lý cơ sở Gym</h1>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => {
          setEditGym(null);
          setVisibleAdd(true);
        }}
      >
        Thêm cơ sở mới
      </Button>

      <AddGymForm
        visible={visibleAdd}
        onCancel={() => setVisibleAdd(false)}
        onSubmit={handleAddGym}
        initialValues={editGym}
      />

      <Table
        dataSource={gyms}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: 1500 }}
      />
    </div>
  );
};

export default GymsPage;
