import React from 'react';
import { Button } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import { exportReportData } from '@/services/Report/index';

const ExportButton: React.FC = () => {
  const handleExport = () => {
    exportReportData();
  };

  return (
    <Button
      type="primary"
      icon={<FileExcelOutlined />}
      onClick={handleExport}
      style={{ marginBottom: 16 }}
    >
      Xuất báo cáo Excel
    </Button>
  );
};

export default ExportButton;