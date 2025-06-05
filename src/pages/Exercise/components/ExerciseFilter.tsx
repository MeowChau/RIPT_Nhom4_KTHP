import React from 'react';
import { Radio, Space, Divider, Card, Typography } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import styles from './styles.less'; // Sửa đường dẫn sang styles.less

const { Title } = Typography;

const ExerciseFilter: React.FC<Components.ExerciseFilterProps> = ({
  types,
  selectedType,
  onTypeChange,
}) => {
  return (
    <Card className={styles.filterCard}>
      <div className={styles.filterHeader}>
        <FilterOutlined />
        <Title level={4}>Bộ lọc</Title>
      </div>

      <Divider />

      <div className={styles.filterSection}>
        <Title level={5}>Loại bài tập</Title>
        <Radio.Group
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className={styles.typeRadioGroup}
        >
          <Space direction="vertical">
            <Radio value="">Tất cả</Radio>
            {types.map(type => (
              <Radio key={type} value={type}>{type}</Radio>
            ))}
          </Space>
        </Radio.Group>
      </div>
    </Card>
  );
};

export default ExerciseFilter;