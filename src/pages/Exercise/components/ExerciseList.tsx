import React from 'react';
import { Row, Col, Empty, Spin } from 'antd';
import ExerciseCard from './ExerciseCard';
import styles from './styles.less';


const ExerciseList: React.FC<Components.ExerciseListProps> = ({
  exercises,
  loading,
  onView,
  searchText,
}) => {
  if (loading) {
    return (
      <div className={styles.spinContainer}>
        <Spin size="large" tip="Đang tải bài tập..." />
      </div>
    );
  }

  if (!exercises.length) {
    return (
      <Empty
        description="Không tìm thấy bài tập nào"
        className={styles.emptyContainer}
      />
    );
  }

  return (
    <div className={styles.listContainer}>
      <Row gutter={[24, 24]}>
        {exercises.map(exercise => (
          <Col xs={24} sm={12} md={8} lg={6} key={exercise._id}>
            <ExerciseCard
              exercise={exercise}
              onView={onView}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ExerciseList;