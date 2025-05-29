import React from 'react';
import { Space, Tag } from 'antd';
import PTStatusTag from './PTStatusTag';
import './PTSchedule.less';

interface PTScheduleProps {
  schedule: PT.Schedule[];
}

const PTSchedule: React.FC<PTScheduleProps> = ({ schedule }) => {
  if (!schedule || schedule.length === 0) {
    return <span>Chưa có lịch</span>;
  }

  return (
    <Space direction="vertical" size="small">
      {schedule.map((item) => (
        <div key={item.day}>
          <Tag>{item.day}</Tag>
          <PTStatusTag status={item.status} />
        </div>
      ))}
    </Space>
  );
};

export default PTSchedule;