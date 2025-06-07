import React from 'react';
import { Table, Space, Button, Tag, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { Member } from '@/services/Member/types';

interface MemberTableProps {
  dataSource: Member[];
  loading: boolean;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => Promise<boolean>;
}

const MemberTable: React.FC<MemberTableProps> = ({
  dataSource,
  loading,
  onEdit,
  onDelete,
}) => {
  const columns: ColumnsType<Member> = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Member, b: Member) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['md'] as const,
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Gói tập',
      dataIndex: 'membershipPackage',
      key: 'membershipPackage',
      responsive: ['md'] as const,
      sorter: (a: Member, b: Member) => {
        // Chuyển đổi gói tập thành số tháng để so sánh
        const getMonths = (pkg: string) => {
          const months = parseInt(pkg.split(' ')[0], 10);
          return isNaN(months) ? 0 : months;
        };
        return getMonths(a.membershipPackage) - getMonths(b.membershipPackage);
      },
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      responsive: ['md'] as const,
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
      sorter: (a: Member, b: Member) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      responsive: ['md'] as const,
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
      sorter: (a: Member, b: Member) => 
        new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      responsive: ['lg'] as const,
      render: (text: any, record: Member) => {
        const now = new Date();
        const endDate = new Date(record.endDate);
        const isActive = endDate > now;
        
        return (
          <Tag color={isActive ? 'green' : 'red'}>
            {isActive ? 'Đang hoạt động' : 'Hết hạn'}
          </Tag>
        );
      },
      sorter: (a: Member, b: Member) => {
        const now = new Date().getTime();
        const endDateA = new Date(a.endDate).getTime();
        const endDateB = new Date(b.endDate).getTime();
        
        // Tính trạng thái: đang hoạt động (true) hoặc hết hạn (false)
        const isActiveA = endDateA > now;
        const isActiveB = endDateB > now;
        
        // Sắp xếp: đang hoạt động trước, hết hạn sau
        if (isActiveA === isActiveB) {
          // Nếu cùng trạng thái, sắp xếp theo ngày kết thúc
          return endDateA - endDateB;
        }
        // Đang hoạt động sẽ trước (-1), hết hạn sẽ sau (1)
        return isActiveA ? -1 : 1;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text: any, record: Member) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa hội viên này?"
            onConfirm={() => onDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey="_id"
      loading={loading}
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: (total) => `Tổng cộng ${total} hội viên`,
      }}
    />
  );
};

export default MemberTable;