import React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ExerciseTable: React.FC<any> = ({ exercises, onEdit, onDelete }) => {
  const columns = [
    { title: 'Tên bài tập', dataIndex: 'name' },
    { title: 'Mô tả', dataIndex: 'description' },
    { title: 'Danh mục', dataIndex: 'category' },
    { title: 'Mục con', dataIndex: 'subcategory' },
    { title: 'Ảnh', dataIndex: 'image', render: (text: string) => <img src={text} alt="thumbnail" style={{ width: 100 }} /> },
    {
      title: 'Hành động',
      render: (_: any, record: any) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)} style={{ marginRight: 8 }} />
          <Popconfirm title="Bạn có chắc muốn xóa bài tập này?" onConfirm={() => onDelete(record._id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return <Table columns={columns} dataSource={exercises} rowKey="_id" />;
};

export default ExerciseTable;
