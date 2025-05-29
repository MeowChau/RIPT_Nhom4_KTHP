import React from 'react';
import { Select, Space, Table, Typography } from 'antd';

const { Text } = Typography;

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const statusOptions = [
  { value: 'off', label: 'Off', color: 'red' },
  { value: 'morning', label: 'Morning', color: 'orange' },
  { value: 'afternoon', label: 'Afternoon', color: 'blue' },
  { value: 'on', label: 'Free', color: 'green' },
];

interface ScheduleItemProps {
  value?: any[];
  onChange?: (value: any[]) => void;
}

const ScheduleEditor: React.FC<ScheduleItemProps> = ({ value = [], onChange }) => {
  // Khởi tạo schedule cho 7 ngày trong tuần nếu chưa có
  React.useEffect(() => {
    if (!value || value.length === 0) {
      const initialSchedule = daysOfWeek.map(day => ({ day, status: 'off' }));
      onChange?.(initialSchedule);
    }
  }, []);

  const handleStatusChange = (day: string, status: string) => {
    // Tìm ngày đã tồn tại trong schedule
    const existingSchedule = value?.find((item) => item.day === day);
    
    const updatedSchedule = value?.map((item) => {
      if (item.day === day) {
        return { ...item, status };
      }
      return item;
    });
    
    if (!existingSchedule && updatedSchedule) {
      updatedSchedule.push({ day, status });
    }
    
    onChange?.(updatedSchedule);
  };

  const getStatusForDay = (day: string) => {
    return value?.find((item) => item.day === day)?.status || 'off';
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'day',
      key: 'day',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_: any, record: any) => (
        <Select
          value={getStatusForDay(record.day)}
          onChange={(selectedStatus) => handleStatusChange(record.day, selectedStatus)}
          style={{ width: 120 }}
        >
          {statusOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              <Space>
                <div
                  style={{
                    backgroundColor: option.color,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                />
                {option.label}
              </Space>
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  const dataSource = daysOfWeek.map(day => ({ key: day, day }));

  return <Table dataSource={dataSource} columns={columns} pagination={false} size="small" />;
};

export default ScheduleEditor;