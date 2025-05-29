import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { 
  RobotOutlined, 
  AppleOutlined, 
  ThunderboltOutlined, 
  HeartOutlined, 
  BarChartOutlined 
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface AiMenuProps {
  selectedProfile: string;
  onSelectProfile: (profile: string) => void;
}

const AiMenu: React.FC<AiMenuProps> = ({ selectedProfile, onSelectProfile }) => {
  const menuItems = [
    {
      id: '1',
      name: 'Tổng quát',
      description: 'Trợ lý AI cho mọi chủ đề phòng gym',
      icon: <RobotOutlined style={{ fontSize: 24 }} />,
      profile: 'general'
    },
    {
      id: '2',
      name: 'Dinh dưỡng',
      description: 'Tư vấn về chế độ ăn uống, dinh dưỡng thể thao',
      icon: <AppleOutlined style={{ fontSize: 24 }} />,
      profile: 'nutrition'
    },
    {
      id: '3',
      name: 'Tập luyện',
      description: 'Hướng dẫn bài tập, kỹ thuật đúng, lịch tập',
      icon: <ThunderboltOutlined style={{ fontSize: 24 }} />,
      profile: 'fitness'
    },
    {
      id: '4',
      name: 'Sức khỏe',
      description: 'Tư vấn lối sống lành mạnh, quản lý stress',
      icon: <HeartOutlined style={{ fontSize: 24 }} />,
      profile: 'health'
    },
    {
      id: '5',
      name: 'Phân tích dữ liệu',
      description: 'Phân tích số liệu phòng gym và thành viên',
      icon: <BarChartOutlined style={{ fontSize: 24 }} />,
      profile: 'analysis'
    }
  ];

  return (
    <Row gutter={[16, 16]} className="ai-menu">
      {menuItems.map((item) => (
        <Col xs={24} sm={12} md={8} lg={8} xl={4} key={item.id}>
          <Card
            hoverable
            className={`ai-menu-item ${selectedProfile === item.profile ? 'active' : ''}`}
            onClick={() => onSelectProfile(item.profile)}
            style={{ 
              textAlign: 'center',
              background: selectedProfile === item.profile ? '#1890ff' : '#fff'
            }}
          >
            <div style={{ 
              color: selectedProfile === item.profile ? '#fff' : '#1890ff', 
              marginBottom: 16 
            }}>
              {item.icon}
            </div>
            <Title 
              level={4}
              style={{ 
                color: selectedProfile === item.profile ? '#fff' : undefined,
                marginTop: 0
              }}
            >
              {item.name}
            </Title>
            <Paragraph
              style={{ 
                color: selectedProfile === item.profile ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.45)',
                marginBottom: 0
              }}
            >
              {item.description}
            </Paragraph>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default AiMenu;