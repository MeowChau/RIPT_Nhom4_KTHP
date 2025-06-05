import React from 'react';
import { Modal, Typography, Space, Tag, Divider, Button } from 'antd';
import { PlayCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import ReactPlayer from 'react-player/lazy';
import styles from './styles.less'; // Sửa đường dẫn nếu bạn đã gộp vào styles.less

const { Title, Paragraph } = Typography;

const getTagColor = (type: string) => {
  switch (type) {
    case 'Kháng lực': return 'blue';
    case 'Cardio': return 'green';
    case 'BodyCombat': return 'volcano';
    default: return 'default';
  }
};

const ExerciseDetail: React.FC<Components.ExerciseDetailProps> = ({
  exercise,
  visible,
  onClose,
}) => {
  if (!exercise) {
    return null;
  }

  const { name, type, videoUrl, description, frequency, image } = exercise;

  return (
    <Modal
      title={null}
      visible={visible}
      footer={null}
      onCancel={onClose}
      width={800}
      className={styles.detailModal}
      bodyStyle={{ padding: 0 }}
    >
      <div className={styles.modalHeader}>
        <div className={styles.playerWrapper}>
          <ReactPlayer
            url={videoUrl}
            controls
            width="100%"
            height="100%"
            className={styles.reactPlayer}
            light={image || true}
            playIcon={<PlayCircleOutlined className={styles.playButton} />}
          />
        </div>
      </div>

      <div className={styles.modalContent}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={2}>{name}</Title>
            <Tag color={getTagColor(type)} className={styles.typeTag}>
              {type}
            </Tag>
          </div>

          <Divider orientation="left">Mô tả</Divider>
          <Paragraph>{description}</Paragraph>

          <Divider orientation="left">Chỉ dẫn</Divider>
          <div className={styles.frequencyInfo}>
            <div className={styles.frequencyItem}>
              <div className={styles.frequencyIcon}>
                <span className={styles.frequencyValue}>{frequency.sets}</span>
              </div>
              <div className={styles.frequencyLabel}>Số hiệp</div>
            </div>
            <div className={styles.frequencyItem}>
              <div className={styles.frequencyIcon}>
                <span className={styles.frequencyValue}>{frequency.reps}</span>
              </div>
              <div className={styles.frequencyLabel}>Số lần lặp</div>
            </div>
            <div className={styles.frequencyItem}>
              <div className={styles.frequencyIcon}>
                <ClockCircleOutlined />
                <span className={styles.frequencyValue}>{frequency.rest}s</span>
              </div>
              <div className={styles.frequencyLabel}>Thời gian nghỉ</div>
            </div>
          </div>
          
          <div className={styles.modalFooter}>
            <Button type="primary" size="large" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </Space>
      </div>
    </Modal>
  );
};

export default ExerciseDetail;