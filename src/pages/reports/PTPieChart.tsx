import React from 'react';
import { Card } from 'antd';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

interface PTByGym {
  gymName: string;
  count: number;
}

interface Props {
  data: PTByGym[];
}

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const PTPieChart: React.FC<Props> = ({ data }) => (
  <Card title="Phân bố PT theo cơ sở" style={{ marginTop: 32 }}>
    {data.length > 0 ? (
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="count"
          nameKey="gymName"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    ) : (
      <p>Đang tải dữ liệu...</p>
    )}
  </Card>
);

export default PTPieChart;
