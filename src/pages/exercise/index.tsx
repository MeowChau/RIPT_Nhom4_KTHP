import React, { useRef } from 'react';
import { Button, message, Tag, Popconfirm } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { history } from 'umi';
import { queryExercises, removeExercise } from '@/services/exercise';

type ExerciseType = {
  _id: string;
  name: string;
  type: 'Kháng lực' | 'Cardio' | 'BodyCombat';
  image?: string;
  videoUrl: string;
  description: string;
  frequency: {
    sets: number;
    reps: number;
    rest: number;
  };
  createdAt: Date;
};

const ExerciseList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const handleRemove = async (id: string) => {
    try {
      await removeExercise(id);
      message.success('Xóa bài tập thành công');
      actionRef.current?.reload();
    } catch (error) {
      message.error('Xóa bài tập thất bại');
    }
  };

  const columns: ProColumns<ExerciseType>[] = [
    {
      title: 'Tên bài tập',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      search: false,
      render: (_, record) => (
        record.image ? (
          <img src={record.image} alt={record.name} style={{ width: 80, height: 80, objectFit: 'cover' }} />
        ) : (
          <span>Không có hình ảnh</span>
        )
      ),
    },
    {
      title: 'Loại bài tập',
      dataIndex: 'type',
      valueEnum: {
        'Kháng lực': { text: 'Kháng lực' },
        'Cardio': { text: 'Cardio' },
        'BodyCombat': { text: 'BodyCombat' },
      },
      render: (_, record) => {
        let color = 'blue';
        if (record.type === 'Cardio') color = 'green';
        if (record.type === 'BodyCombat') color = 'orange';
        
        return <Tag color={color}>{record.type}</Tag>;
      },
    },
    {
      title: 'Tần suất',
      dataIndex: 'frequency',
      search: false,
      render: (_, record) => (
        <span>{record.frequency.sets} hiệp x {record.frequency.reps} lần (nghỉ {record.frequency.rest}s)</span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      valueType: 'date',
      sorter: true,
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => {
            history.push(`/exercises/detail?id=${record._id}`);
          }}
        >
          <EyeOutlined /> Chi tiết
        </a>,
        <a
          key="edit"
          onClick={() => {
            history.push(`/exercises/edit?id=${record._id}`);
          }}
        >
          <EditOutlined /> Sửa
        </a>,
        <Popconfirm
          key="delete"
          title="Bạn có chắc muốn xóa bài tập này?"
          onConfirm={() => handleRemove(record._id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <a><DeleteOutlined /> Xóa</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer title="Quản lý thư viện bài tập">
      <ProTable<ExerciseType>
        headerTitle="Danh sách bài tập"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              history.push('/exercises/edit');
            }}
          >
            <PlusOutlined /> Thêm bài tập mới
          </Button>,
        ]}
        request={async (params) => {
          const response = await queryExercises({
            ...params,
          });
          
          return {
            data: response.data || [],
            success: response.success,
            total: response.count || 0,
          };
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default ExerciseList;