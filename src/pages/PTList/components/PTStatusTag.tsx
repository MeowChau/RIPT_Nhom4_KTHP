import React from 'react';
import { Tag } from 'antd';
import './PTStatusTag.less';

type PTStatus = 'off' | 'morning' | 'afternoon' | 'on';

interface PTStatusTagProps {
  status: PTStatus;
}

const statusColors = {
  off: 'default',
  morning: 'processing',
  afternoon: 'warning',
  on: 'success',
};

const statusLabels = {
  off: 'Không làm',
  morning: 'Ca sáng',
  afternoon: 'Ca chiều',
  on: 'Cả ngày',
};

const PTStatusTag: React.FC<PTStatusTagProps> = ({ status }) => {
  return (
    <Tag color={statusColors[status] || 'default'}>
      {statusLabels[status] || status}
    </Tag>
  );
};

export default PTStatusTag;