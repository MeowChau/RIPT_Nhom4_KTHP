import React, { useEffect } from 'react';
import { Card, Empty, Spin } from 'antd';
import { Pie } from '@ant-design/plots';
import type { API } from '@/services/Report/typings';

interface MembersPieChartProps {
  loading: boolean;
  data: API.ChartData[];
}

const MembersPieChart: React.FC<MembersPieChartProps> = ({ loading, data }) => {
  useEffect(() => {
    console.log('MembersPieChart render with data:', data);
  }, [data]);

  // Kiểm tra xem thư viện có được import đúng không
  console.log('Pie component available:', typeof Pie);

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    legend: {
      position: 'bottom', // Đặt legend ở dưới để thấy rõ hơn
    },
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{percentage}',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
  };

  return (
    <Card title="Phân bố hội viên theo cơ sở" style={{ height: '400px', marginBottom: 16 }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px 50px' }}>
          <Spin />
        </div>
      ) : data && data.length > 0 ? (
        <div style={{ height: '300px', width: '100%', overflow: 'hidden' }}>
          <Pie {...config} />
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />
      )}
    </Card>
  );
};

export default MembersPieChart;