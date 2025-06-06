import React from 'react';
import { Card, List, Button, Typography, Divider, Badge } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import type { PlanProps } from '@/models/membership';
import styles from './PlanCard.less';
import { history } from 'umi';

const { Text, Title } = Typography;

interface PlanCardProps {
  plan: PlanProps;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  const discountPercent = plan.originalPrice
    ? Math.round(100 - (plan.price / plan.originalPrice) * 100)
    : 0;

  return (
    <Badge.Ribbon 
      text="Phổ biến nhất" 
      color="#ff4d4f" 
      className={plan.popular ? styles.ribbon : styles.hidden}
    >
      <Card 
        className={`${styles.planCard} ${plan.popular ? styles.popularPlan : ''}`} 
        hoverable
      >
        <div className={styles.planHeader}>
          <Title level={3} className={styles.planTitle}>{plan.duration}</Title>
          {plan.originalPrice && (
            <div className={styles.discount}>
              <span className={styles.discountBadge}>-{discountPercent}%</span>
            </div>
          )}
        </div>
        
        <div className={styles.priceContainer}>
          <Text className={styles.price}>
            {plan.price.toLocaleString('vi-VN')}
            <span className={styles.currency}>₫</span>
          </Text>
          {plan.originalPrice && (
            <Text delete className={styles.originalPrice}>
              {plan.originalPrice.toLocaleString('vi-VN')}₫
            </Text>
          )}
        </div>
        
        <Divider className={styles.divider} />
        
        <List
          itemLayout="horizontal"
          dataSource={plan.features}
          className={styles.featuresList}
          renderItem={(item) => (
            <List.Item className={styles.featureItem}>
              <CheckCircleFilled className={styles.checkIcon} /> 
              <span>{item}</span>
            </List.Item>
          )}
        />
        
        <Button 
          type={plan.popular ? 'primary' : 'default'}
          size="large" 
          block
          className={styles.actionButton}
          onClick={() => history.push('/user/register')}
        >
          Đăng ký ngay
        </Button>
      </Card>
    </Badge.Ribbon>
  );
};

export default PlanCard;