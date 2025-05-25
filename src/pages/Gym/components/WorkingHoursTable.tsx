import React from 'react';
import { Table, Badge, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import API from '@/services/Gym/typings';
import styles from './WorkingHoursTable.less';

interface WorkingHoursTableProps {
  workingHours: API.WorkingHours;
}

const { Text } = Typography;

const WorkingHoursTable: React.FC<WorkingHoursTableProps> = ({ workingHours }) => {
  // Kiểm tra xem hôm nay là thứ mấy
  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };
  
  const currentDay = getCurrentDay();
  
  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'day',
      key: 'day',
      render: (text: string, record: any) => (
        <Text strong={record.key === currentDay}>{text}</Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text: string, record: any) => (
        <Badge
          status={record.isOpen ? 'success' : 'default'}
          text={record.isOpen ? 'Mở cửa' : 'Đóng cửa'}
        />
      ),
    },
    {
      title: 'Giờ mở cửa',
      dataIndex: 'hours',
      key: 'hours',
      render: (text: string, record: any) => (
        <Text>{record.isOpen ? text : '—'}</Text>
      ),
    }
  ];

  const data = [
    {
      key: 'Monday',
      day: 'Thứ Hai',
      isOpen: workingHours.Monday.active,
      hours: workingHours.Monday.active ? `${workingHours.Monday.open} - ${workingHours.Monday.close}` : '',
    },
    {
      key: 'Tuesday',
      day: 'Thứ Ba',
      isOpen: workingHours.Tuesday.active,
      hours: workingHours.Tuesday.active ? `${workingHours.Tuesday.open} - ${workingHours.Tuesday.close}` : '',
    },
    {
      key: 'Wednesday',
      day: 'Thứ Tư',
      isOpen: workingHours.Wednesday.active,
      hours: workingHours.Wednesday.active ? `${workingHours.Wednesday.open} - ${workingHours.Wednesday.close}` : '',
    },
    {
      key: 'Thursday',
      day: 'Thứ Năm',
      isOpen: workingHours.Thursday.active,
      hours: workingHours.Thursday.active ? `${workingHours.Thursday.open} - ${workingHours.Thursday.close}` : '',
    },
    {
      key: 'Friday',
      day: 'Thứ Sáu',
      isOpen: workingHours.Friday.active,
      hours: workingHours.Friday.active ? `${workingHours.Friday.open} - ${workingHours.Friday.close}` : '',
    },
    {
      key: 'Saturday',
      day: 'Thứ Bảy',
      isOpen: workingHours.Saturday.active,
      hours: workingHours.Saturday.active ? `${workingHours.Saturday.open} - ${workingHours.Saturday.close}` : '',
    },
    {
      key: 'Sunday',
      day: 'Chủ Nhật',
      isOpen: workingHours.Sunday.active,
      hours: workingHours.Sunday.active ? `${workingHours.Sunday.open} - ${workingHours.Sunday.close}` : '',
    }
  ];

  return (
    <div className={styles.workingHoursContainer}>
      <div className={styles.scheduleHeader}>
        <ClockCircleOutlined className={styles.clockIcon} />
        <Typography.Title level={4}>Lịch hoạt động</Typography.Title>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={false}
        rowClassName={(record) => record.key === currentDay ? styles.currentDay : ''}
        className={styles.scheduleTable}
      />
      
      <div className={styles.note}>
        <Typography.Text type="secondary">
          * Lịch hoạt động có thể thay đổi vào các ngày lễ, Tết. Vui lòng liên hệ trực tiếp để biết thêm chi tiết.
        </Typography.Text>
      </div>
    </div>
  );
};

export default WorkingHoursTable;