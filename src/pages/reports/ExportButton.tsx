import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

interface Props {
  onClick: () => void;
}

const ExportButton: React.FC<Props> = ({ onClick }) => (
  <div style={{ textAlign: 'right', marginTop: 16 }}>
    <Button type="primary" icon={<DownloadOutlined />} onClick={onClick}>
      Xuất Excel tổng quan
    </Button>
  </div>
);

export default ExportButton;
