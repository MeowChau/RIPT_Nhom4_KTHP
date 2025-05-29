import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Typography, Avatar, Spin, Empty } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import type { Message } from '@/services/AI/typings';
import ReactMarkdown from 'react-markdown';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface AiChatBoxProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  selectedProfile: string;
}

// Ensure Message type has an id property
interface MessageWithId extends Message {
  id: string;
}

const AiChatBox: React.FC<AiChatBoxProps> = ({ 
  messages, 
  isLoading, 
  onSendMessage,
  selectedProfile
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  // Profile title mapping
  const getProfileTitle = () => {
    switch(selectedProfile) {
      case 'nutrition': return 'Tư vấn dinh dưỡng';
      case 'fitness': return 'Tư vấn tập luyện';
      case 'health': return 'Tư vấn sức khỏe';
      case 'analysis': return 'Phân tích dữ liệu';
      default: return 'Trợ lý AI';
    }
  };

  // Convert markdown to HTML for assistant messages
  const renderAssistantMessage = (content: string) => {
    return <ReactMarkdown>{content}</ReactMarkdown>;
  };

  return (
    <Card 
      title={
        <Title level={4} style={{ margin: 0 }}>{getProfileTitle()}</Title>
      }
      className="chat-card"
      bodyStyle={{ 
        height: 500, 
        display: 'flex', 
        flexDirection: 'column',
        padding: 0
      }}
    >
      <div className="chat-messages" style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '16px 24px'
      }}>
        {messages.length === 0 ? (
          <Empty description="Chưa có tin nhắn nào" />
        ) : (
          <>
            {messages.map((msg, index) => (
              <div 
                key={('id' in msg) ? (msg as MessageWithId).id : `${msg.role}-${index}-${Date.now()}`}
                className={`message ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}
                style={{
                  display: 'flex',
                  marginBottom: 16,
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <Avatar 
                  icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                  style={{ 
                    backgroundColor: msg.role === 'user' ? '#1890ff' : '#52c41a',
                    marginRight: msg.role === 'user' ? 0 : 12,
                    marginLeft: msg.role === 'user' ? 12 : 0
                  }}
                />
                <div
                  style={{
                    maxWidth: '70%',
                    padding: 12,
                    borderRadius: 8,
                    backgroundColor: msg.role === 'user' ? '#e6f7ff' : '#f6ffed',
                    border: `1px solid ${msg.role === 'user' ? '#91d5ff' : '#b7eb8f'}`,
                  }}
                >
                  {msg.role === 'assistant' 
                    ? renderAssistantMessage(msg.content)
                    : <Text>{msg.content}</Text>
                  }
                </div>
              </div>
            ))}
          </>
        )}
        
        {isLoading && (
          <div className="loading-indicator" style={{ textAlign: 'center', padding: '10px 0' }}>
            <Spin size="small" />
            <Text type="secondary" style={{ marginLeft: 10 }}>
              AI đang phản hồi...
            </Text>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input" style={{ padding: 16, borderTop: '1px solid #f0f0f0' }}>
        <div style={{ width: '100%', display: 'flex' }}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            autoSize={{ minRows: 1, maxRows: 3 }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isLoading}
            style={{ resize: 'none', flexGrow: 1 }}
          />
          <Button 
            type="primary" 
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            icon={<SendOutlined />}
          />
        </div>
      </div>
    </Card>
  );
};

export default AiChatBox;