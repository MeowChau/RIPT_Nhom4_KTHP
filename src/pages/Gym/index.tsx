import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Input, Select, Spin, Empty, Pagination } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { useGymFacilities } from '@/models/gym';
import GymList from './components/GymList';
import styles from '@/pages/Gym/components/index.less';

const { Search } = Input;
const { Option } = Select;

const GymPage: React.FC = () => {
  const { facilities, loading } = useGymFacilities();
  const [searchText, setSearchText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(12);
  const [sortBy, setSortBy] = useState<string>('name');

  // Lọc và sắp xếp danh sách gym
  const getFilteredGyms = () => {
    let filtered = [...facilities];
    
    // Lọc theo từ khóa tìm kiếm
    if (searchText) {
      const keyword = searchText.toLowerCase();
      filtered = filtered.filter(gym => 
        gym.name.toLowerCase().includes(keyword) || 
        gym.address.toLowerCase().includes(keyword)
      );
    }
    
    // Sắp xếp
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'area-asc':
          return a.area - b.area;
        case 'area-desc':
          return b.area - a.area;
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  // Phân trang
  const paginatedGyms = () => {
    const filtered = getFilteredGyms();
    const startIndex = (currentPage - 1) * pageSize;
    return filtered.slice(startIndex, startIndex + pageSize);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredGyms = getFilteredGyms();
  
  return (
    <PageContainer
      header={{
        title: 'Danh Sách Các Cơ Sở Gym',
        ghost: false,
      }}
    >
      <Card className={styles.searchCard}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12} lg={14} xl={16}>
            <Search
              placeholder="Tìm kiếm theo tên hoặc địa chỉ"
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
            />
          </Col>
          <Col xs={24} md={12} lg={10} xl={8}>
            <div className={styles.sortWrapper}>
              <FilterOutlined className={styles.filterIcon} />
              <Select 
                defaultValue="name" 
                style={{ width: '100%' }}
                size="large"
                onChange={handleSortChange}
              >
                <Option value="name">Sắp xếp theo tên (A-Z)</Option>
                <Option value="area-asc">Diện tích (Nhỏ → Lớn)</Option>
                <Option value="area-desc">Diện tích (Lớn → Nhỏ)</Option>
              </Select>
            </div>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : filteredGyms.length === 0 ? (
        <div className={styles.emptyContainer}>
          <Empty 
            description={
              searchText 
                ? `Không tìm thấy kết quả phù hợp với "${searchText}"` 
                : "Không có cơ sở gym nào"
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      ) : (
        <>
          <div className={styles.resultCount}>
            Hiển thị {paginatedGyms().length} trong số {filteredGyms.length} kết quả
          </div>
          
          <GymList facilities={paginatedGyms()} />
          
          {filteredGyms.length > pageSize && (
            <div className={styles.paginationContainer}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredGyms.length}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total) => `Tổng số: ${total} cơ sở`}
              />
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default GymPage;