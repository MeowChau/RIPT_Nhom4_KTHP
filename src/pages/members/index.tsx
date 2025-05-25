import React, { useEffect, useState } from 'react';
import { Table, Button, message, Tag } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { ColumnsType } from 'antd/es/table';  // Import ColumnType
import MemberFormModal from './MemberForm';

const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/members');
      setMembers(data);
    } catch (error) {
      message.error('Không tải được danh sách hội viên');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (member: any | null = null) => {
    setEditingMember(member);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/members/${id}`);
      message.success('Xoá hội viên thành công');
      fetchMembers();
    } catch {
      message.error('Xoá hội viên thất bại');
    }
  };

  // ColumnsType<Any> type để đảm bảo tính tương thích với antd table
  const columns: ColumnsType<any> = [
    {
      title: 'Tên hội viên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Gói tập',
      dataIndex: 'membershipPackage',
      key: 'membershipPackage',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => (date ? moment(date).format('DD/MM/YYYY') : ''),
      sorter: (a: any, b: any) => moment(a.startDate).isBefore(b.startDate) ? -1 : 1, // Sắp xếp theo ngày
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => (date ? moment(date).format('DD/MM/YYYY') : ''),
      sorter: (a: any, b: any) => moment(a.endDate).isBefore(b.endDate) ? -1 : 1, // Sắp xếp theo ngày kết thúc
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: any) => {
        const today = moment();
        const end = record.endDate ? moment(record.endDate) : null;
        if (!end) return <Tag color="default">Không rõ</Tag>;
        return end.isSameOrAfter(today, 'day') ? (
          <Tag color="green">Còn hoạt động</Tag>
        ) : (
          <Tag color="red">Hết hạn</Tag>
        );
      },
      sorter: (a: any, b: any) => {
        const statusA = a.endDate ? (moment(a.endDate).isSameOrAfter(moment(), 'day') ? 'Còn hoạt động' : 'Hết hạn') : 'Không rõ';
        const statusB = b.endDate ? (moment(b.endDate).isSameOrAfter(moment(), 'day') ? 'Còn hoạt động' : 'Hết hạn') : 'Không rõ';
        return statusA.localeCompare(statusB);
      },
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Xoá
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Quản lý Hội viên</h1>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => openModal(null)}
      >
        Thêm hội viên mới
      </Button>
      <Table
        dataSource={members}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <MemberFormModal
        visible={modalVisible}
        editingMember={editingMember}
        onClose={() => setModalVisible(false)}
        onSuccess={fetchMembers}
      />
    </div>
  );
};

export default MembersPage;
