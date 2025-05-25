import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, Typography } from 'antd';

const { Title } = Typography;

// Định nghĩa kiểu prop
interface DataItem {
  gymName: string;
  activeCount: number;
}

interface ActiveMembersChartProps {
  data: DataItem[];
}

const ActiveMembersChart: React.FC<ActiveMembersChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card
        title={<Title level={4} style={{ margin: 0, textAlign: 'center' }}>Số lượng hội viên còn hoạt động theo cơ sở</Title>}
        bordered
        style={{ maxWidth: 900, margin: '40px auto', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)', textAlign: 'center', padding: 50 }}
      >
        Không có dữ liệu để hiển thị
      </Card>
    );
  }

  return (
    <Card
      title={<Title level={4} style={{ margin: 0, textAlign: 'center' }}>Số lượng hội viên còn hoạt động theo cơ sở</Title>}
      bordered
      style={{ maxWidth: 900, margin: '40px auto', boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)' }}
    >
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="gymName"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={80}
              tick={{ fontSize: 12, fill: '#595959' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#595959' }}
              allowDecimals={false}
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="activeCount"
              fill="#1890ff"
              name="Hội viên hoạt động"
              barSize={40}
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ActiveMembersChart;
