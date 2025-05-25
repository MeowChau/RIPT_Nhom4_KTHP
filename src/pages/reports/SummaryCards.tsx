import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';

interface SummaryProps {
  gyms: number;
  members: number;
  personalTrainers: number;
  totalEquipment: number;
  totalRevenue: number;
}

const SummaryCards: React.FC<SummaryProps> = ({
  gyms,
  members,
  personalTrainers,
  totalEquipment,
  totalRevenue,
}) => (
  <>
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic title="Số cơ sở" value={gyms} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Số hội viên" value={members} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Số PT" value={personalTrainers} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Tổng máy móc" value={totalEquipment} />
        </Card>
      </Col>
    </Row>
    <Row style={{ marginTop: 16 }}>
      <Col span={24}>
        <Card>
          <Statistic title="Doanh thu" value={totalRevenue} prefix="₫" />
        </Card>
      </Col>
    </Row>
  </>
);

export default SummaryCards;
