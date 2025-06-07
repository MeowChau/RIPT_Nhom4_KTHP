import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Col, Space } from 'antd';
import useReport from '@/models/useReport';
import SummaryCards from './components/SummaryCards';
import MembersPieChart from './components/MembersPieChart';
import PTPieChart from './components/PTPieChart';
import ActiveMembersChart from './components/ActiveMembersChart';
import ExportButton from './components/ExportButton';

const ReportPage: React.FC = () => {
  const { loading, summary, membersByGym, ptsByGym, activeMembersByGym } = useReport();

  return (
    <PageContainer
      title="Báo cáo & Thống kê"
      subTitle="Tổng quan về hoạt động phòng gym"
      extra={[<ExportButton key="export" />]}
    >
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <SummaryCards loading={loading} summary={summary} />
        
        <Row gutter={[16, 16]}>
          <Col span={24} lg={12}>
            <MembersPieChart loading={loading} data={membersByGym} />
          </Col>
          <Col span={24} lg={12}>
            <PTPieChart loading={loading} data={ptsByGym} />
          </Col>
        </Row>
        
        <ActiveMembersChart loading={loading} data={activeMembersByGym} />
      </Space>
    </PageContainer>
  );
};

export default ReportPage;