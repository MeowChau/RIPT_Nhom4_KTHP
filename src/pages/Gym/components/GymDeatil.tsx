import React from 'react';
import { Descriptions, Typography, Divider, Tag, Card } from 'antd';
import { BorderOutlined, FieldTimeOutlined } from '@ant-design/icons';
import type API  from '@/services/Gym/typings';
import styles from './GymDetail.less';

interface GymDetailProps {
  facility: API.GymFacility;
}

const { Title, Paragraph } = Typography;

const GymDetail: React.FC<GymDetailProps> = ({ facility }) => {
  const getOpenDaysCount = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.filter(day => 
      facility.workingHours[day as keyof API.WorkingHours].active
    ).length;
  };

  return (
    <div className={styles.detailContainer}>
      <section className={styles.overviewSection}>
        <Title level={4}>Thông tin cơ sở</Title>
        <Divider />

        <Descriptions column={{ xs: 1, sm: 2 }} bordered>
          <Descriptions.Item 
            label={<span><BorderOutlined /> Diện tích</span>} 
            labelStyle={{ fontWeight: 'bold' }}
          >
            {facility.area} m²
          </Descriptions.Item>
          <Descriptions.Item 
            label={<span><FieldTimeOutlined /> Ngày hoạt động</span>}
            labelStyle={{ fontWeight: 'bold' }}
          >
            {getOpenDaysCount()}/7 ngày trong tuần
          </Descriptions.Item>
        </Descriptions>

        <Divider dashed />
        
        <Title level={4}>Mô tả chi tiết</Title>
        <Paragraph className={styles.description}>
          Đây là cơ sở gym hiện đại, được trang bị đầy đủ thiết bị và dụng cụ tập luyện chất lượng cao.
          Với không gian rộng rãi, thoáng mát và đội ngũ huấn luyện viên chuyên nghiệp, 
          chúng tôi cam kết mang đến trải nghiệm tập luyện tốt nhất cho khách hàng.
        </Paragraph>

        <Paragraph className={styles.description}>
          Cơ sở được thiết kế với các khu vực chức năng riêng biệt: khu vực tập cardio, 
          khu vực tập luyện sức mạnh, khu vực tập luyện chức năng và phòng tập nhóm. 
          Ngoài ra còn có khu vực phòng thay đồ, phòng tắm và khu vực nghỉ ngơi tiện nghi.
        </Paragraph>
      </section>

      <section className={styles.facilitiesSection}>
        <Title level={4}>Tiện ích cơ sở</Title>
        <Divider />
        
        <div className={styles.facilitiesList}>
          <Tag color="blue" className={styles.facilityTag}>Máy lạnh</Tag>
          <Tag color="blue" className={styles.facilityTag}>Phòng tắm</Tag>
          <Tag color="blue" className={styles.facilityTag}>Phòng thay đồ</Tag>
          <Tag color="blue" className={styles.facilityTag}>Khu vực để đồ</Tag>
          <Tag color="blue" className={styles.facilityTag}>Nước uống miễn phí</Tag>
          <Tag color="blue" className={styles.facilityTag}>Wifi miễn phí</Tag>
          <Tag color="blue" className={styles.facilityTag}>Bãi đỗ xe</Tag>
          <Tag color="blue" className={styles.facilityTag}>Khu vực nghỉ ngơi</Tag>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <Title level={4}>Dịch vụ</Title>
        <Divider />
        
        <div className={styles.serviceCards}>
          {[
            { title: 'Huấn luyện cá nhân', description: 'Chương trình tập luyện được thiết kế riêng theo mục tiêu và thể trạng của từng cá nhân.' },
            { title: 'Lớp học nhóm', description: 'Đa dạng các lớp học: Yoga, Zumba, Boxing, HIIT, Pilates...' },
            { title: 'Tư vấn dinh dưỡng', description: 'Chế độ dinh dưỡng phù hợp kết hợp với lịch tập để đạt hiệu quả tối ưu.' }
          ].map((service, index) => (
            <Card key={index} title={service.title} className={styles.serviceCard}>
              <Paragraph>{service.description}</Paragraph>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GymDetail;