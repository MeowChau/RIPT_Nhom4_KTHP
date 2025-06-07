import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  BankOutlined,
  TeamOutlined,
  UserOutlined,
  ToolOutlined,
  DollarOutlined
} from '@ant-design/icons';
import type { API } from '@/services/Report/typings';
interface SummaryCardsProps {
  loading: boolean;
  summary: API.ReportSummary | null;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ loading, summary }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={12} lg={8} xl={4}>
        <Card>
          <Statistic
            loading={loading}
            title="Tổng số cơ sở"
            value={summary?.gyms || 0}
            prefix={<BankOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={12} lg={8} xl={5}>
        <Card>
          <Statistic
            loading={loading}
            title="Tổng số hội viên"
            value={summary?.members || 0}
            prefix={<TeamOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={12} lg={8} xl={5}>
        <Card>
          <Statistic
            loading={loading}
            title="Tổng số huấn luyện viên"
            value={summary?.personalTrainers || 0}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={5}>
        <Card>
          <Statistic
            loading={loading}
            title="Tổng số thiết bị"
            value={summary?.totalEquipment || 0}
            prefix={<ToolOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} xl={5}>
        <Card>
          <Statistic
            loading={loading}
            title="Tổng doanh thu (VNĐ)"
            value={summary?.totalRevenue || 0}
            prefix={<DollarOutlined />}
            precision={0}
            formatter={(value) => 
              `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
            }
          />
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryCards;