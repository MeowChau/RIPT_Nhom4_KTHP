import React from 'react';
import { Row, Col } from 'antd';
import GymCard from './GymCard';
import type  API  from '@/services/Gym/typings';
import styles from './GymList.less';

interface GymListProps {
  facilities: API.GymFacility[];
}

const GymList: React.FC<GymListProps> = ({ facilities }) => {
  return (
    <div className={styles.gymListWrapper}>
      <Row gutter={[24, 24]}>
        {facilities.map(facility => (
          <Col 
            key={facility._id} 
            xs={24} 
            sm={12} 
            md={8} 
            lg={8} 
            xl={6}
            className={styles.gymCard}
          >
            <GymCard facility={facility} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default GymList;