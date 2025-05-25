import React from 'react';
import { Card } from 'antd';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

interface MemberByGym {
  gymName: string;
  count: number;
}

interface Props {
  data: MemberByGym[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CF7', '#FF6F91'];

const MembersPieChart: React.FC<Props> = ({ data }) => (
  <Card title="Phân bố hội viên theo cơ sở" style={{ marginTop: 32 }}>
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

export default MembersPieChart;
