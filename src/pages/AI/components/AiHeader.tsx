import React from 'react';
import { Typography, Badge, Space, Card, Progress, Row, Col } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import type { UsageLimit } from '@/services/AI/typings';

const { Title, Text } = Typography;

interface AiHeaderProps {
  usageLimit: UsageLimit | null;
  ollamaStatus: { running: boolean; models: string[]; error?: string } | null;
}

const AiHeader: React.FC<AiHeaderProps> = ({ usageLimit, ollamaStatus }) => {
  const usagePercentage = usageLimit 
    ? Math.round((usageLimit.current / usageLimit.max) * 100)
    : 0;
    
  return (
    <Card 
      className="ai-header"
      bordered={false}
    >
      <Row align="middle" justify="space-between">
        <Col xs={24} md={16}>
          <Space align="center">
            <RobotOutlined style={{ fontSize: 32, marginRight: 12 }} />
            <div>
              <Title level={2} style={{ margin: 0 }}>Trợ lý AI Phòng Gym</Title>
              <Text type="secondary">
                Hỏi đáp và nhận tư vấn về dinh dưỡng, tập luyện và sức khỏe
              </Text>
            </div>
          </Space>
        </Col>
        
        <Col xs={24} md={8} style={{ textAlign: 'right', marginTop: 16 }}>
          <Space direction="vertical" align="end">
            <Badge 
              status={ollamaStatus?.running ? 'success' : 'error'} 
              text={
                <Text strong>
                  {ollamaStatus?.running ? 'AI đang hoạt động' : 'AI không hoạt động'}
                </Text>
              }
            />
            
            {usageLimit && (
              <div style={{ width: 200 }}>
                <Space>
                  <Text>Đã sử dụng:</Text>
                  <Text strong>{usageLimit.current}/{usageLimit.max}</Text>
                </Space>
                <Progress 
                  percent={usagePercentage} 
                  size="small"
                  status={usagePercentage > 80 ? 'exception' : 'active'}
                  showInfo={false}
                />
              </div>
            )}
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default AiHeader;