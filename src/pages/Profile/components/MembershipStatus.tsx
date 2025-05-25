import React from 'react';
import { Tag } from 'antd';
import moment from 'moment';

interface MembershipStatusProps {
  endDate?: string;
}

const MembershipStatus: React.FC<MembershipStatusProps> = ({ endDate }) => {
  if (!endDate) {
    return <Tag color="default">Chưa có gói tập</Tag>;
  }
  
  const now = moment();
  const expiryDate = moment(endDate);
  
  if (expiryDate.isBefore(now)) {
    return <Tag color="error">Đã hết hạn</Tag>;
  }
  
  const daysLeft = expiryDate.diff(now, 'days');
  if (daysLeft <= 7) {
    return <Tag color="warning">Sắp hết hạn ({daysLeft} ngày)</Tag>;
  }
  
  return <Tag color="success">Còn hạn ({daysLeft} ngày)</Tag>;
};

export default MembershipStatus;