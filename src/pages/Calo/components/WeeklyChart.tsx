import React, { useMemo } from 'react';
import { Card, Empty, Spin } from 'antd';
import { Column } from '@ant-design/plots';
import styles from '@/pages/Calo/components/index.less';

interface WeeklyChartProps {
  weeklyData: API.DailyCalorieSummary[];
  loading: boolean;
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ weeklyData, loading }) => {
  const chartData = useMemo(() => {
    if (!weeklyData || weeklyData.length === 0) return [];
    
    return weeklyData.flatMap(item => [
      {
        date: item.date,
        type: 'Intake',
        value: item.totalCaloIntake,
      },
      {
        date: item.date,
        type: 'Target',
        value: item.caloTarget,
      }
    ]);
  }, [weeklyData]);

  if (loading) {
    return (
      <Card className={styles.chartCard} bordered={false}>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!weeklyData || weeklyData.length === 0) {
    return (
      <Card className={styles.chartCard} bordered={false}>
        <Empty 
          description="No data available" 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      </Card>
    );
  }

  const config = {
    data: chartData,
    isGroup: true,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    label: {
      position: 'middle',
      layout: [
        {
          type: 'interval-adjust-position',
        },
        {
          type: 'interval-hide-overlap',
        },
        {
          type: 'adjust-color',
        },
      ],
    },
    color: ['#1890ff', '#52c41a'],
    columnStyle: {
      radius: [8, 8, 0, 0],
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.type, value: `${datum.value} kcal` };
      },
    },
    interactions: [{ type: 'element-active' }],
    legend: {
      position: 'top-right',
    },
  };

  return (
    <Card 
      title="Weekly Calorie Tracking" 
      className={styles.chartCard}
      bordered={false}
    >
      <Column {...config} height={320} />
    </Card>
  );
};

export default WeeklyChart;