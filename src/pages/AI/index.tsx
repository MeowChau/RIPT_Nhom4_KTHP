import React, { useState } from 'react';
import { connect } from 'umi';
import type { ConnectProps, Loading, Dispatch } from 'umi';
import { Layout, Typography, Space, Select, Alert, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import AiHeader from '@/pages/AI/components/AiHeader';
import AiMenu from '@/pages/AI/components/AiMenu';
import AiChatBox from '@/pages/AI/components/AiChatBox';
import AiDataAnalysis from '@/pages/AI/components/AiDataAnalysis';
import type { AiModelState } from '@/models/ai';

const { Content } = Layout;
const { Option } = Select;

interface AiPageProps extends ConnectProps {
  ai: AiModelState;
  loading?: boolean;
  dispatch: Dispatch;
}

const AiPage: React.FC<AiPageProps> = ({ ai, loading, dispatch }) => {
  const [userId, setUserId] = useState('6831d5f3a7c426695dce161d'); // Chị Đào
  
  const { 
    messages,
    error,
    ollamaStatus,
    usageLimit,
    selectedProfile,
  } = ai;

  // Đổi người dùng
  const handleUserChange = (newUserId: string) => {
    setUserId(newUserId);
    
    dispatch({
      type: 'ai/fetchUsageLimit',
      payload: { userId: newUserId },
    });
    
    dispatch({
      type: 'ai/clearMessages',
    });
    
    dispatch({
      type: 'ai/fetchChatHistory',
      payload: { userId: newUserId, profile: selectedProfile },
    });
  };
  
  // Gửi tin nhắn
  const handleSendMessage = (message: string) => {
    dispatch({
      type: 'ai/sendMessage',
      payload: { userId, prompt: message, profile: selectedProfile },
    });
  };
  
  // Thay đổi profile
  const handleProfileChange = (profile: string) => {
    dispatch({
      type: 'ai/changeProfile',
      payload: { profile, userId },
    });
  };
  
  // Phân tích dữ liệu
  const handleAnalyze = (data: any) => {
    return dispatch({
      type: 'ai/analyzeData',
      payload: { userId, data },
    });
  };
  
  // Xóa lỗi
  const handleClearError = () => {
    dispatch({
      type: 'ai/clearError',
    });
  };

  return (
    <Layout className="ai-page" style={{ minHeight: '100vh', padding: '24px' }}>
      <Content style={{ maxWidth: 1200, margin: '0 auto' }}>
        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            closable
            onClose={handleClearError}
            style={{ marginBottom: 24 }}
          />
        )}
        
        <Row justify="end" style={{ marginBottom: 16 }}>
          <Col>
            <Space align="center">
              <Typography.Text>Người dùng:</Typography.Text>
              <Select 
                value={userId} 
                onChange={handleUserChange}
                style={{ width: 150 }}
              >
                <Option value="6831d5f3a7c426695dce161d">
                  <Space>
                    <UserOutlined />
                    Chị Đào
                  </Space>
                </Option>
                <Option value="6831d5f3a7c426695dce162e">
                  <Space>
                    <UserOutlined />
                    Anh Tuấn
                  </Space>
                </Option>
              </Select>
            </Space>
          </Col>
        </Row>
        
        <AiHeader 
          usageLimit={usageLimit} 
          ollamaStatus={ollamaStatus} 
        />
        
        <div style={{ margin: '24px 0' }}>
          <AiMenu 
            selectedProfile={selectedProfile} 
            onSelectProfile={handleProfileChange} 
          />
        </div>
        
        {selectedProfile === 'analysis' ? (
          <AiDataAnalysis 
            onAnalyze={handleAnalyze}
            isLoading={loading || false} 
          />
        ) : (
          <AiChatBox 
            messages={messages} 
            isLoading={loading || false} 
            onSendMessage={handleSendMessage}
            selectedProfile={selectedProfile} 
          />
        )}
      </Content>
    </Layout>
  );
};

export default connect(
  ({ ai, loading }: { ai: AiModelState; loading: Loading }) => ({
    ai,
    loading: loading.effects['ai/sendMessage'] || loading.effects['ai/analyzeData'],
  })
)(AiPage);