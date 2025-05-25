import React from 'react';
import { Card, Badge, Tag, Typography, Space, Button } from 'antd';
import { 
  EnvironmentOutlined, 
  BorderOutlined, 
  ClockCircleOutlined,
  RightOutlined
} from '@ant-design/icons';
import { history } from 'umi';
import type  API  from '@/services/Gym/typings';
import styles from './GymCard.less';

const { Text, Title } = Typography;
const { Meta } = Card;

interface GymCardProps {
  facility: API.GymFacility;
}

const GymCard: React.FC<GymCardProps> = ({ facility }) => {
  const getTodayWorkingHours = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const todayHours = facility.workingHours[today as keyof typeof facility.workingHours];
    
    if (todayHours.active && todayHours.open && todayHours.close) {
      return {
        open: true,
        hours: `${todayHours.open} - ${todayHours.close}`
      };
    }
    
    return {
      open: false,
      hours: 'Đóng cửa'
    };
  };

  const { open, hours } = getTodayWorkingHours();

  const navigateToDetail = () => {
    history.push(`/gym/${facility._id}`);
  };

  return (
    <Card 
      className={styles.gymCard}
      cover={
        <div className={styles.cardImageContainer}>
          <img
            alt={facility.name}
            src={facility.image || '/images/gym-placeholder.jpg'}
            className={styles.cardImage}
          />
          <div className={styles.statusBadge}>
            <Badge 
              status={open ? "success" : "error"} 
              text={open ? "Đang mở cửa" : "Đã đóng cửa"} 
            />
          </div>
        </div>
      }
      bodyStyle={{ padding: '16px' }}
      bordered={false}
      hoverable
    >
      <Meta
        title={
          <div className={styles.cardTitle}>
            <Title level={5} ellipsis={{ tooltip: facility.name }}>
              {facility.name}
            </Title>
          </div>
        }
        description={
          <Space direction="vertical" size={8} className={styles.infoContainer}>
            <div className={styles.infoItem}>
              <EnvironmentOutlined className={styles.infoIcon} />
              <Text type="secondary" ellipsis={{ tooltip: facility.address }}>
                {facility.address}
              </Text>
            </div>
            
            <div className={styles.infoItem}>
              <BorderOutlined className={styles.infoIcon} />
              <Text type="secondary">{facility.area} m²</Text>
            </div>
            
            <div className={styles.infoItem}>
              <ClockCircleOutlined className={styles.infoIcon} />
              <Text type="secondary">{hours}</Text>
            </div>

            {facility.equipment && facility.equipment.length > 0 && (
              <div className={styles.equipmentTagsContainer}>
                {facility.equipment.slice(0, 2).map((item, index) => (
                  <Tag key={index} color="blue" className={styles.equipmentTag}>
                    {item.name}
                  </Tag>
                ))}
                {facility.equipment.length > 2 && (
                  <Tag className={styles.equipmentTag}>
                    +{facility.equipment.length - 2}
                  </Tag>
                )}
              </div>
            )}
          </Space>
        }
      />
      <div className={styles.cardFooter}>
        <Button 
          type="primary" 
          onClick={navigateToDetail}
          className={styles.detailButton}
        >
          Xem chi tiết <RightOutlined />
        </Button>
      </div>
    </Card>
  );
};

export default GymCard;