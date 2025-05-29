import React, { useState } from 'react';
import { Card, Input, Button, Typography, Alert, Space, Divider } from 'antd';
import { BarChartOutlined, ExperimentOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface AiDataAnalysisProps {
  onAnalyze: (data: any) => Promise<string | null>;
  isLoading: boolean;
}

const AiDataAnalysis: React.FC<AiDataAnalysisProps> = ({ onAnalyze, isLoading }) => {
  const [inputData, setInputData] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setError(null);
    
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(inputData);
      } catch (e) {
        setError('Dữ liệu không đúng định dạng JSON. Vui lòng kiểm tra lại.');
        return;
      }
      
      const analysis = await onAnalyze(parsedData);
      if (analysis) {
        setResult(analysis);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi phân tích dữ liệu.');
    }
  };

  const exampleData = {
    'gymAttendance': [
      { 'month': 'Tháng 1', 'count': 1200 },
      { 'month': 'Tháng 2', 'count': 1300 },
      { 'month': 'Tháng 3', 'count': 1400 },
      { 'month': 'Tháng 4', 'count': 1350 }
    ],
    'membershipStats': {
      'active': 450,
      'expired': 120,
      'new': 75
    },
    'popularClasses': [
      { 'name': 'Yoga', 'attendance': 210 },
      { 'name': 'Spinning', 'attendance': 180 },
      { 'name': 'HIIT', 'attendance': 150 }
    ]
  };

  const loadExampleData = () => {
    setInputData(JSON.stringify(exampleData, null, 2));
  };

  return (
    <Card 
      title={
        <Space>
          <BarChartOutlined />
          <Title level={4} style={{ margin: 0 }}>Phân tích dữ liệu</Title>
        </Space>
      }
      extra={
        <Button 
          type="link"
          onClick={loadExampleData}
          icon={<ExperimentOutlined />}
        >
          Dùng dữ liệu mẫu
        </Button>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>Nhập dữ liệu (định dạng JSON)</Text>
          <TextArea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="Nhập dữ liệu JSON cần phân tích..."
            autoSize={{ minRows: 10, maxRows: 20 }}
            style={{ fontFamily: 'monospace' }}
          />
        </div>
        
        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
          />
        )}
        
        <Button
          type="primary"
          onClick={handleAnalyze}
          disabled={isLoading || !inputData.trim()}
          loading={isLoading}
          block
        >
          {isLoading ? 'Đang phân tích...' : 'Phân tích dữ liệu'}
        </Button>
        
        {result && (
          <>
            <Divider orientation="left">Kết quả phân tích</Divider>
            <Card>
              <div className="markdown-result">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </Card>
          </>
        )}
      </Space>
    </Card>
  );
};

export default AiDataAnalysis;