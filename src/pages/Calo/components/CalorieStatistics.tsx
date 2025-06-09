import React from 'react';
import { Card, Row, Col, Statistic, Progress, Spin, Typography } from 'antd';
import { FireOutlined, AimOutlined, BarChartOutlined } from '@ant-design/icons';
import styles from '@/pages/Calo/components/index.less';

const { Text } = Typography;

interface StatisticsProps {
  weeklySummary: API.WeeklySummary | null;
  loading: boolean;
}

const CalorieStatistics: React.FC<StatisticsProps> = ({ weeklySummary, loading }) => {
  if (!weeklySummary && loading) {
    return (
      <Card className={styles.statisticsCard} bordered={false}>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  const summary = weeklySummary || {
    totalCaloIntake: 0,
    totalCaloTarget: 0,
    caloDiff: 0,
  };

  // Calculate percentage of target reached
  const percentage = summary.totalCaloTarget 
    ? Math.min(Math.round((summary.totalCaloIntake / summary.totalCaloTarget) * 100), 100) 
    : 0;

  // Determine status color based on calorie difference
  const getStatusColor = () => {
    if (summary.caloDiff > 500) return '#f5222d'; // Significantly over
    if (summary.caloDiff > 0) return '#fa8c16';   // Slightly over
    if (summary.caloDiff < -500) return '#52c41a'; // Significantly under
    return '#1890ff'; // About right
  };

  const renderWeeklyStatus = () => {
    if (summary.caloDiff > 500) {
      return <Text type="danger">You&apos;re significantly over your calorie target this week</Text>;
    } else if (summary.caloDiff > 0) {
      return <Text type="warning">You&apos;re slightly over your calorie target this week</Text>;
    } else if (summary.caloDiff < -500) {
      return <Text type="success">You&apos;re under your calorie target this week</Text>;
    } else {
      return <Text type="secondary">You&apos;re on track with your calorie target this week</Text>;
    }
  };

  return (
    <Card 
      title="Weekly Calorie Summary"
      className={styles.statisticsCard}
      bordered={false}
    >
      <Row gutter={[16, 24]}>
        <Col xs={24} md={8}>
          <Statistic
            title="Weekly Intake"
            value={summary.totalCaloIntake}
            suffix="kcal"
            prefix={<FireOutlined className={styles.statisticIcon} />}
            className={styles.statistic}
          />
        </Col>
        <Col xs={24} md={8}>
          <Statistic
            title="Weekly Target"
            value={summary.totalCaloTarget}
            suffix="kcal"
            prefix={<AimOutlined className={styles.statisticIcon} />}
            className={styles.statistic}
          />
        </Col>
        <Col xs={24} md={8}>
          <Statistic
            title="Weekly Difference"
            value={summary.caloDiff}
            suffix="kcal"
            valueStyle={{ 
              color: summary.caloDiff > 0 ? '#cf1322' : summary.caloDiff < 0 ? '#3f8600' : undefined
            }}
            prefix={summary.caloDiff > 0 ? '+' : ''}
            className={styles.statistic}
          />
        </Col>
      </Row>

      <div className={styles.progressSection}>
        <div className={styles.progressTitle}>
          <BarChartOutlined /> Weekly Target Progress
        </div>
        <Progress 
          percent={percentage} 
          status={summary.caloDiff > 0 ? 'exception' : 'active'}
          strokeColor={getStatusColor()}
          className={styles.progressBar}
        />
        <div className={styles.progressStatus}>
          {renderWeeklyStatus()}
        </div>
      </div>
    </Card>
  );
};

export default CalorieStatistics;