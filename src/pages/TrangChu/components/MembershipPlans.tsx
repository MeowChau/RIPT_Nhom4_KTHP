import React, { useState, useEffect } from 'react';
import { Row, Col, Tabs, Typography, Spin, Divider } from 'antd';
import PlanCard from './PlanCard';
import BenefitCard from './BenefitCard';
import { getMembershipPlans, getMembershipBenefits } from '@/services/membershipService';
import styles from './MembershipPlans.less';
import type { BenefitProps } from '@/models/membership';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

interface Plan {
  id: string;
  duration: string;
  price: number;
  features: string[];
  // add other properties as needed
}

interface Benefit {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  // add other properties as needed
}

const MembershipPlans: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [plansData, benefitsData] = await Promise.all([
          getMembershipPlans(),
          getMembershipBenefits()
        ]);
        
        setPlans(plansData);
        setBenefits(benefitsData);
      } catch (error) {
        console.error('Failed to fetch membership data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.membershipContainer}>
      <div className={styles.sectionHeader}>
        <Title level={2} className={styles.mainTitle}>Lựa chọn gói hội viên phù hợp</Title>
        <Divider className={styles.divider} />
        <Paragraph className={styles.subtitle}>
          Chúng tôi cung cấp nhiều gói hội viên để phù hợp với nhu cầu và ngân sách của bạn
        </Paragraph>
      </div>

      <Spin spinning={loading}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          centered
          className={styles.membershipTabs}
        >
          <TabPane tab="Gói hội viên" key="1">
            <Row gutter={[24, 24]} className={styles.plansRow}>
              {plans.map((plan) => (
                <Col xs={24} sm={12} md={12} lg={6} key={plan.id}>
                  <PlanCard plan={plan} />
                </Col>
              ))}
            </Row>
          </TabPane>
          <TabPane tab="Lợi ích hội viên" key="2">
            <Row gutter={[24, 24]}>
              {benefits.map((benefit) => (
                <Col xs={24} md={8} key={benefit.id}>
                  <BenefitCard benefit={benefit as BenefitProps} />
                </Col>
              ))}
            </Row>
          </TabPane>
        </Tabs>
      </Spin>
    </div>
  );
};

export default MembershipPlans;