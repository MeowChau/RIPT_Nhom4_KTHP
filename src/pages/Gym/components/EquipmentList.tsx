import React, { useState } from 'react';
import { List, Card, Avatar, Tag, Input, Select, Empty, Typography } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
// Define Equipment type locally if typings file is missing
type Equipment = {
  name: string;
  quantity: number;
  image?: string;
};
import styles from './EquipmentList.less';
interface EquipmentListProps {
  equipment: Equipment[];
}
const { Search } = Input;
const { Title } = Typography;

const EquipmentList: React.FC<EquipmentListProps> = ({ equipment }) => {
  const [searchText, setSearchText] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');

  if (!equipment || equipment.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <Empty 
          description="Chưa có thông tin về trang thiết bị"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Lọc và sắp xếp thiết bị
  const getFilteredEquipment = () => {
    let filtered = [...equipment];
    
    // Lọc theo từ khóa
    if (searchText) {
      const keyword = searchText.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(keyword)
      );
    }
    
    // Sắp xếp
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'quantity-high':
          return b.quantity - a.quantity;
        case 'quantity-low':
          return a.quantity - b.quantity;
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const filteredEquipment = getFilteredEquipment();

  return (
    <div className={styles.equipmentContainer}>
      <div className={styles.equipmentHeader}>
        <ToolOutlined className={styles.equipmentIcon} />
        <Title level={4}>Danh sách trang thiết bị</Title>
      </div>

      <div className={styles.filterContainer}>
        <Search
          placeholder="Tìm kiếm thiết bị"
          allowClear
          onSearch={handleSearch}
          style={{ width: 250, marginRight: 16 }}
        />
        <Select 
          defaultValue="name" 
          style={{ width: 200 }}
          onChange={handleSortChange}
        >
          <Select.Option value="name">Sắp xếp theo tên (A-Z)</Select.Option>
          <Select.Option value="quantity-high">Số lượng (Cao → Thấp)</Select.Option>
          <Select.Option value="quantity-low">Số lượng (Thấp → Cao)</Select.Option>
        </Select>
      </div>

      {filteredEquipment.length === 0 ? (
        <Empty description={`Không tìm thấy thiết bị nào phù hợp với "${searchText}"`} />
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={filteredEquipment}
          renderItem={item => (
            <List.Item>
              <Card className={styles.equipmentCard}>
                <div className={styles.equipmentImageContainer}>
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className={styles.equipmentImage} 
                    />
                  ) : (
                    <Avatar 
                      icon={<ToolOutlined />} 
                      shape="square" 
                      size={80} 
                      className={styles.equipmentAvatar}
                    />
                  )}
                </div>
                <Title level={5} className={styles.equipmentName}>
                  {item.name}
                </Title>
                <div className={styles.equipmentQuantity}>
                  <Tag color="blue">
                    Số lượng: {item.quantity}
                  </Tag>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default EquipmentList;