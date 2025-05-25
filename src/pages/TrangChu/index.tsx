import React from 'react';
import { Layout, Typography, Divider, Row, Col, Card, Button, Carousel } from 'antd';
import {
  FireFilled,
  ThunderboltFilled,
  TrophyFilled,
  RightOutlined
} from '@ant-design/icons';
import MembershipPlans from '@/pages/TrangChu/components/MembershipPlans';
import styles from '@/pages/TrangChu/components/style.less';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
  return (
    <Layout className={styles.homePage}>


{/* Hero Banner đã điều chỉnh */}
<div className={styles.heroBanner}>
  <div className={styles.heroContent}>
    <Title className={styles.heroTitle}>Earn Pain. Gain Power.</Title>
  </div>
</div>

      {/* Intro Section */}
      <Content className={styles.content}>
        <section className={styles.introSection}>
          <Title level={2} className={styles.sectionTitle}>Chào mừng đến với GYM MASTER</Title>
          <Divider className={styles.divider} />
          <Paragraph className={styles.introParagraph}>
            Chúng tôi không chỉ là một phòng tập thông thường. Chúng tôi là cộng đồng 
            những người đam mê lối sống khỏe mạnh, nơi bạn sẽ tìm thấy sự hỗ trợ và 
            động lực để đạt được mục tiêu của mình.
          </Paragraph>
          
          <Row gutter={[32, 32]} className={styles.introFeatures}>
            <Col xs={24} md={8}>
              <Card className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <FireFilled />
                </div>
                <Title level={4}>Trang thiết bị hiện đại</Title>
                <Paragraph>
                  Máy móc nhập khẩu từ châu Âu, đảm bảo hiệu quả và an toàn trong mỗi buổi tập.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <ThunderboltFilled />
                </div>
                <Title level={4}>Huấn luyện viên chuyên nghiệp</Title>
                <Paragraph>
                  Đội ngũ PT được đào tạo bài bản, giàu kinh nghiệm và tận tâm với từng hội viên.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <TrophyFilled />
                </div>
                <Title level={4}>Không gian rộng rãi</Title>
                <Paragraph>
                  Phòng tập rộng trên 2000m², được thiết kế khoa học với nhiều khu vực chức năng.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Membership Section - Sử dụng Component MembershipPlans từ các files đã tách */}
        <section className={styles.membershipSection}>
          <MembershipPlans />
        </section>

        {/* Testimonials */}
        <section className={styles.testimonialsSection}>
          <Title level={2} className={styles.sectionTitle}>Hội viên nói gì về chúng tôi</Title>
          <Divider className={styles.divider} />
          
          <Carousel autoplay className={styles.testimonialCarousel}>
            <div>
              <Card className={styles.testimonialCard}>
                <Paragraph className={styles.testimonialText}>
                  &quot;Tôi đã tập ở đây được 6 tháng và giảm được 12kg. Huấn luyện viên rất 
                  tận tâm và luôn động viên tôi vượt qua giới hạn bản thân.&quot;
                </Paragraph>
                <div className={styles.testimonialAuthor}>
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="Nguyễn Thị Hương"
                    className={styles.testimonialAvatar}
                  />
                  <div>
                    <Title level={5} className={styles.testimonialName}>Nguyễn Thị Hương</Title>
                    <Paragraph className={styles.testimonialRole}>Hội viên 6 tháng</Paragraph>
                  </div>
                </div>
              </Card>
            </div>
            <div>
              <Card className={styles.testimonialCard}>
                <Paragraph className={styles.testimonialText}>
                  &quot;Phòng tập có đầy đủ trang thiết bị, không gian thoáng mát và sạch sẽ. 
                  Nhân viên rất thân thiện và nhiệt tình hỗ trợ.&quot;
                </Paragraph>
                <div className={styles.testimonialAuthor}>
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="Trần Văn Nam"
                    className={styles.testimonialAvatar}
                  />
                  <div>
                    <Title level={5} className={styles.testimonialName}>Trần Văn Nam</Title>
                    <Paragraph className={styles.testimonialRole}>Hội viên 3 tháng</Paragraph>
                  </div>
                </div>
              </Card>
            </div>
          </Carousel>
        </section>

        {/* Call to action */}
        <section className={styles.ctaSection}>
          <Title level={2} className={styles.ctaTitle}>
            Sẵn sàng thay đổi bản thân?
          </Title>
          <Paragraph className={styles.ctaText}>
            Đăng ký ngay hôm nay để nhận ưu đãi đặc biệt cho hội viên mới
          </Paragraph>
          <Button type="primary" size="large" className={styles.ctaButton}>
            Đăng ký tư vấn <RightOutlined />
          </Button>
        </section>
      </Content>
    </Layout>
  );
};

export default HomePage;