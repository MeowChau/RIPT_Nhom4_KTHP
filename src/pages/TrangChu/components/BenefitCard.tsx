import React from 'react';
import { Card, Typography } from 'antd';
import { 
  FireFilled, 
  ThunderboltFilled, 
  TrophyFilled
} from '@ant-design/icons';
import { BenefitProps } from '@/models/membership';
import styles from './BenefitCard.less';

const { Title, Paragraph } = Typography;

interface BenefitCardProps {
  benefit: BenefitProps;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ benefit }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'fire': return <FireFilled className={styles.benefitIcon} />;
      case 'thunderbolt': return <ThunderboltFilled className={styles.benefitIcon} />;
      case 'trophy': return <TrophyFilled className={styles.benefitIcon} />;
      default: return <FireFilled className={styles.benefitIcon} />;
    }
  };

  return (
    <Card className={styles.benefitCard} hoverable>
      <div className={styles.benefitIconContainer}>
        {getIcon(typeof benefit.icon === 'string' ? benefit.icon : 'fire')}
      </div>
      <Title level={4} className={styles.benefitTitle}>
        {benefit.title}
      </Title>
      <Paragraph className={styles.benefitDescription}>
        {benefit.description}
      </Paragraph>
    </Card>
  );
};

export default BenefitCard;