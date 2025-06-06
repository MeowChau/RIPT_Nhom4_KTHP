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
          {record.videoUrl && (
            <Button
              onClick={() => window.open(record.videoUrl, '_blank')}
              style={{ marginRight: 8 }}
              type="default"
            >
              Xem Video
            </Button>
          )}
        </>
      ),
    },
  ];

  const expandedRowRender = (record: any) => (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h4 className="text-lg font-semibold mb-2">Chi tiết bài tập: {record.name}</h4>
      {record.description && <p className="mb-1">🔍 {record.description}</p>}
      {record.muscleGroup && <p className="mb-1">💪 Nhóm cơ: {record.muscleGroup}</p>}
      {record.type && <p className="mb-4">⚙️ Loại bài tập: {record.type}</p>}

      {record.videoUrl && (
        <Button
          onClick={() => window.open(record.videoUrl, '_blank')}
          type="primary"
          danger // Use danger type for red button, or customize style
        >
          Xem Video
        </Button>
      )}
    </div>
  );

  return (
    <Table
      columns={columns}
      dataSource={exercises}
      rowKey="_id"
      expandedRowRender={expandedRowRender}
    />
  );
};

export default ExerciseTable;
