import React from 'react';
import { Card, Typography, Space, Tooltip, Badge } from 'antd';
import { EyeOutlined, PlayCircleOutlined } from '@ant-design/icons';
import styles from './styles.less';

const { Meta } = Card;
const { Text } = Typography;

const getTagColor = (type: string) => {
  switch (type) {
    case 'Kháng lực': return 'blue';
    case 'Cardio': return 'green';
    case 'BodyCombat': return 'volcano';
    default: return 'default';
  }
};

const ExerciseCard: React.FC<Components.ExerciseCardProps> = ({
  exercise,
  onView,
}) => {
  const { _id, name, type, image, frequency, description } = exercise;
  
  const defaultImage = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
  const imageUrl = image || defaultImage;
  
  return (
    <Badge.Ribbon text={type} color={getTagColor(type)}>
      <Card
        hoverable
        className={styles.exerciseCard}
        cover={
          <div className={styles.cardImageContainer}>
            <img 
              alt={name} 
              src={imageUrl} 
              className={styles.cardImage} 
            />
            <div className={styles.cardOverlay}>
              <PlayCircleOutlined className={styles.playIcon} />
            </div>
          </div>
        }
        actions={[
          <Tooltip title="Xem chi tiết" key="view">
            <EyeOutlined onClick={() => onView(_id)} />
          </Tooltip>
        ]}
        onClick={() => onView(_id)} // Thêm click vào card để xem chi tiết
      >
        <Meta
          title={<Typography.Title level={4}>{name}</Typography.Title>}
          description={
            <Space direction="vertical">
              <Text ellipsis={{ tooltip: description }}>
                {description.length > 80 ? `${description.substring(0, 80)}...` : description}
              </Text>
              
              <div className={styles.exerciseStats}>
                {frequency.sets > 0 && (
                  <Tooltip title="Số hiệp">
                    <div className={styles.statItem}>
                      <Text strong>{frequency.sets}</Text>
                      <Text type="secondary">hiệp</Text>
                    </div>
                  </Tooltip>
                )}
                
                {frequency.reps > 0 && (
                  <Tooltip title="Số lần lặp">
                    <div className={styles.statItem}>
                      <Text strong>{frequency.reps}</Text>
                      <Text type="secondary">lần</Text>
                    </div>
                  </Tooltip>
                )}
                
                {frequency.rest > 0 && (
                  <Tooltip title="Thời gian nghỉ">
                    <div className={styles.statItem}>
                      <Text strong>{frequency.rest}</Text>
                      <Text type="secondary">giây</Text>
                    </div>
                  </Tooltip>
                )}
              </div>
            </Space>
          }
        />
      </Card>
    </Badge.Ribbon>
  );
};

export default ExerciseCard;