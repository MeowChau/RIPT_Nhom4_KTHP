import React from 'react';
import { useParams, history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { 
  Row, 
  Col, 
  Typography, 
  Spin, 
  Result, 
  Button, 
  Tabs, 
  Space,
  Card,
  Tag
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EnvironmentOutlined,
  PhoneOutlined,
  GlobalOutlined,
  MailOutlined
} from '@ant-design/icons';
import { useGymFacilityDetail } from '@/models/gym';
import GymDetail from './components/GymDeatil';
import WorkingHoursTable from './components/WorkingHoursTable';
import EquipmentList from './components/EquipmentList';
import styles from '@/pages/Gym/components/id.less';

const { Paragraph } = Typography;
const { TabPane } = Tabs;

interface GymDetailParams {
  id: string;
}

const GymDetailPage: React.FC = () => {
  const { id } = useParams<GymDetailParams>();
  const { facility, loading, error } = useGymFacilityDetail(id);

  const handleBack = () => {
    history.push('/gym');
  };

  if (loading) {
    return (
      <PageContainer>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <Typography.Text className={styles.loadingText}>
            Đang tải thông tin chi tiết...
          </Typography.Text>
        </div>
      </PageContainer>
    );
  }

  if (error || !facility) {
    return (
      <PageContainer>
        <Result
          status="error"
          title="Không thể tải thông tin"
          subTitle={error || "Không tìm thấy thông tin cơ sở gym"}
          extra={[
            <Button type="primary" key="back" onClick={handleBack} icon={<ArrowLeftOutlined />}>
              Quay lại danh sách
            </Button>,
          ]}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      header={{
        title: facility.name,
        onBack: handleBack,
        tags: [
          <Tag color="green" key="status">
            Đang hoạt động
          </Tag>
        ],
      }}
    >
      <div className={styles.detailWrapper}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <div className={styles.mainImageContainer}>
              <img 
                src={facility.image || '/images/gym-placeholder.jpg'}
                alt={facility.name}
                className={styles.mainImage}
              />
            </div>
            
            <div className={styles.contentSection}>
              <Tabs defaultActiveKey="overview" size="large" className={styles.detailTabs}>
                <TabPane tab="Tổng quan" key="overview">
                  <GymDetail facility={facility} />
                </TabPane>
                <TabPane tab="Trang thiết bị" key="equipment">
                  <EquipmentList equipment={facility.equipment} />
                </TabPane>
                <TabPane tab="Lịch hoạt động" key="schedule">
                  <WorkingHoursTable workingHours={facility.workingHours} />
                </TabPane>
              </Tabs>
            </div>
          </Col>
          
          <Col xs={24} lg={8}>
            <div className={styles.sidebarSection}>
              <Card title="Thông tin liên hệ" className={styles.contactCard}>
                <Space direction="vertical" size={16} className={styles.contactInfo}>
                  <div>
                    <Space>
                      <EnvironmentOutlined className={styles.contactIcon} />
                      <Typography.Text strong>Địa chỉ:</Typography.Text>
                    </Space>
                    <Paragraph>{facility.address}</Paragraph>
                  </div>

                  <div>
                    <Space>
                      <PhoneOutlined className={styles.contactIcon} />
                      <Typography.Text strong>Hotline:</Typography.Text>
                    </Space>
                    <Paragraph>0123 456 789</Paragraph>
                  </div>

                  <div>
                    <Space>
                      <MailOutlined className={styles.contactIcon} />
                      <Typography.Text strong>Email:</Typography.Text>
                    </Space>
                    <Paragraph>contact@gymfitness.com</Paragraph>
                  </div>

                  <div>
                    <Space>
                      <GlobalOutlined className={styles.contactIcon} />
                      <Typography.Text strong>Website:</Typography.Text>
                    </Space>
                    <Paragraph>www.gymfitness.com</Paragraph>
                  </div>
                </Space>
              </Card>

              <Card title="Đặt lịch tham quan" className={styles.bookingCard}>
                <Paragraph>
                  Đặt lịch tham quan để được tư vấn chi tiết về các dịch vụ và gói tập luyện phù hợp với bạn.
                </Paragraph>
                <Button type="primary" size="large" block>
                  Đặt lịch ngay
                </Button>
              </Card>

              <Card title="Khuyến mãi đặc biệt" className={styles.promotionCard}>
                <Paragraph>
                  <Typography.Text strong mark>Ưu đãi 30%</Typography.Text> cho khách hàng đăng ký thành viên mới trong tháng này.
                </Paragraph>
                <Button type="default" size="middle" block>
                  Xem chi tiết
                </Button>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default GymDetailPage;