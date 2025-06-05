import React from 'react';
import { Input, Select, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './styles.less';

const { Option } = Select;
const { Title } = Typography;

// Loại bỏ prop onAddNew và showAddButton vì không cần chức năng thêm bài tập
const SearchBar: React.FC<Components.SearchBarProps> = ({
  onSearch,
  onFilter,
  types,
}) => {
  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.titleSection}>
        <Title level={2}>Thư Viện Bài Tập</Title>
        <p>Khám phá các bài tập đa dạng để đạt được mục tiêu thể dục của bạn</p>
      </div>
      
      <div className={styles.searchSection}>
        <Space size="middle" className={styles.searchControls}>
          <Input
            placeholder="Tìm kiếm bài tập..."
            prefix={<SearchOutlined />}
            onChange={(e) => onSearch(e.target.value)}
            className={styles.searchInput}
            size="large"
          />
          
          <Select
            placeholder="Loại bài tập"
            style={{ width: 200 }}
            onChange={onFilter}
            allowClear
            size="large"
          >
            {types.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Space>
      </div>
    </div>
  );
};

export default SearchBar;