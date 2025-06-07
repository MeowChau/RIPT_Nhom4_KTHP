import React from 'react';
import { Card, Empty, Spin } from 'antd';
import { Column } from '@ant-design/plots';

interface ChartData {
  name: string;
  value: number;
}

interface ActiveMembersChartProps {
  loading: boolean;
  data: ChartData[];
}

const ActiveMembersChart: React.FC<ActiveMembersChartProps> = ({ loading, data }) => {
  const config = {
    data,
    xField: 'name',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: true,
      },
      title: {
        text: 'Cơ sở',
      },
    },
    yAxis: {
      title: {
        text: 'Số lượng hội viên đang hoạt động',
      },
    },
    meta: {
      name: {
        alias: 'Cơ sở',
      },
      value: {
        alias: 'Số lượng',
      },
    },
  };

  return (
    <Card title="Hội viên đang hoạt động theo cơ sở">
      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px 50px' }}>
          <Spin />
        </div>
      ) : data.length > 0 ? (
        <Column {...config} />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  );
};

export default ActiveMembersChart;