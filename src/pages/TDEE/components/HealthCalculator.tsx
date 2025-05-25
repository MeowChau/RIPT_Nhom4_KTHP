import React from 'react';
import { 
  Form, Input, Button, Card, Radio, Select, 
  Tabs, Divider, Row, Col, Tag, Statistic, Empty
} from 'antd';
import { 
  CalculatorOutlined, LineChartOutlined,
  ScheduleOutlined, AppleOutlined, HistoryOutlined 
} from '@ant-design/icons';
import WorkoutPlan from './WorkoutPlan';
import DietPlan from './DietPlan';
import HistoryRecord from './HistoryRecord';
import useHealthCalculator from '@/models/tdee';

// const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const HealthCalculator: React.FC = () => {
  const [form] = Form.useForm();
  const {
    results,
    loading,
    calculateHealth,
    updateMacros,
    historyRecords,
  } = useHealthCalculator();

  const handleSubmit = (values: any) => {
    calculateHealth(values);
  };

  return (
    <div className="health-calculator-container">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={10}>
          <Card 
            title={<><CalculatorOutlined /> Tính chỉ số sức khỏe</>}
            className="form-card"
            bordered={false}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                gender: 'male',
                activityLevel: 'moderate',
                goal: 'maintain'
              }}
            >
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
              >
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="male">Nam</Radio.Button>
                  <Radio.Button value="female">Nữ</Radio.Button>
                </Radio.Group>
              </Form.Item>
              
              <Form.Item
                name="age"
                label="Tuổi"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tuổi' },
                     {
                    validator: (_, value) => {
        const age = Number(value);
        if (isNaN(age) || !value) {
          return Promise.reject('Vui lòng nhập số hợp lệ');
        }
        if (age < 15 || age > 100) {
          return Promise.reject('Tuổi phải từ 15-100');
        }
        return Promise.resolve();
      }
    }
  ]}
              >
                <Input type="number" placeholder="Nhập tuổi" suffix="tuổi" />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="height"
                    label="Chiều cao"
                    rules={[
    { required: true, message: 'Vui lòng nhập chiều cao' },
    {
      validator: (_, value) => {
        const height = Number(value);
        if (isNaN(height) || !value) {
          return Promise.reject('Vui lòng nhập số hợp lệ');
        }
        if (height < 140 || height > 220) {
          return Promise.reject('Chiều cao phải từ 140-220cm');
        }
        return Promise.resolve();
      }
    }
  ]}
                  >
                    <Input type="number" placeholder="Nhập chiều cao" suffix="cm" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="weight"
                    label="Cân nặng"
                     rules={[
    { required: true, message: 'Vui lòng nhập cân nặng' },
    {
      validator: (_, value) => {
        const weight = Number(value);
        if (isNaN(weight) || !value) {
          return Promise.reject('Vui lòng nhập số hợp lệ');
        }
        if (weight < 40 || weight > 200) {
          return Promise.reject('Cân nặng phải từ 40-200kg');
        }
        return Promise.resolve();
      }
    }
  ]}
                  >
                    <Input type="number" placeholder="Nhập cân nặng" suffix="kg" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="activityLevel"
                label="Mức độ vận động"
                rules={[{ required: true, message: 'Vui lòng chọn mức độ vận động' }]}
              >
                <Select placeholder="Chọn mức độ vận động">
                  <Option value="sedentary">Ít vận động (Văn phòng, ít đi lại)</Option>
                  <Option value="light">Nhẹ (Tập 1-2 lần/tuần)</Option>
                  <Option value="moderate">Vừa phải (Tập 3-5 lần/tuần)</Option>
                  <Option value="active">Tích cực (Tập 6-7 lần/tuần)</Option>
                  <Option value="very_active">Rất tích cực (Vận động viên, tập nhiều lần/ngày)</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="goal"
                label="Mục tiêu"
                rules={[{ required: true, message: 'Vui lòng chọn mục tiêu' }]}
              >
                <Radio.Group>
                  <Radio.Button value="lose_weight">Giảm cân</Radio.Button>
                  <Radio.Button value="maintain">Duy trì</Radio.Button>
                  <Radio.Button value="gain_weight">Tăng cân</Radio.Button>
                </Radio.Group>
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading}>
                  Tính toán
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        
        <Col xs={24} lg={14}>
          {results ? (
            <Tabs defaultActiveKey="stats">
              <TabPane 
                tab={<span><LineChartOutlined /> Chỉ số</span>} 
                key="stats"
              >
                <Card bordered={false}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Card className="result-card">
                        <Statistic 
                          title="Chỉ số BMI" 
                          value={results.bmi}
                          precision={1}
                          suffix={
                            <Tag color={
                              results.bmiCategory === 'Bình thường' ? 'green' : 
                              results.bmiCategory === 'Thiếu cân' ? 'blue' : 'orange'
                            }>
                              {results.bmiCategory}
                            </Tag>
                          }
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Card className="result-card">
                        <Statistic 
                          title="Calo cơ bản (BMR)" 
                          value={results.bmr}
                          suffix="calo/ngày"
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Card className="result-card">
                        <Statistic 
                          title="Tổng calo tiêu thụ (TDEE)" 
                          value={results.tdee}
                          suffix="calo/ngày"
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Card className="result-card">
                        <Statistic 
                          title="Lượng calo theo mục tiêu" 
                          value={results.targetCalories}
                          suffix="calo/ngày"
                        />
                      </Card>
                    </Col>
                  </Row>
                  
                  <Divider orientation="left">Phân phối Macro</Divider>
                  
                  <div className="macro-options">
                    <Radio.Group 
                      value={results.macroOption}
                      onChange={(e) => updateMacros(e.target.value)}
                      buttonStyle="solid"
                    >
                      <Radio.Button value="40-40-20">Cân bằng (40-40-20)</Radio.Button>
                      <Radio.Button value="33-35-30">Giàu chất béo (33-35-30)</Radio.Button>
                      <Radio.Button value="50-30-20">Giàu carb (50-30-20)</Radio.Button>
                    </Radio.Group>
                  </div>
                  
                  <div className="macro-summary">
                    <Row gutter={16}>
                      <Col xs={24} sm={8}>
                        <Card className="macro-card carbs-card">
                          <Statistic 
                            title="Carbs" 
                            value={results.macros.carbs} 
                            suffix="%" 
                          />
                          <div className="gram-value">
                            {results.macros.carbsGrams}g ({Math.round(results.macros.carbsGrams * 4)} calo)
                          </div>
                        </Card>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Card className="macro-card protein-card">
                          <Statistic 
                            title="Protein" 
                            value={results.macros.protein} 
                            suffix="%" 
                          />
                          <div className="gram-value">
                            {results.macros.proteinGrams}g ({Math.round(results.macros.proteinGrams * 4)} calo)
                          </div>
                        </Card>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Card className="macro-card fat-card">
                          <Statistic 
                            title="Chất béo" 
                            value={results.macros.fat} 
                            suffix="%" 
                          />
                          <div className="gram-value">
                            {results.macros.fatGrams}g ({Math.round(results.macros.fatGrams * 9)} calo)
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </TabPane>
              
              <TabPane 
                tab={<span><ScheduleOutlined /> Lịch tập luyện</span>} 
                key="workout"
              >
                <Card bordered={false}>
                  <WorkoutPlan 
                    bmi={results.bmi}
                    goal={form.getFieldValue('goal')}
                    activityLevel={form.getFieldValue('activityLevel')}
                  />
                </Card>
              </TabPane>
              
              <TabPane 
                tab={<span><AppleOutlined /> Chế độ ăn uống</span>} 
                key="diet"
              >
                <Card bordered={false}>
                  <DietPlan 
                    calories={results.targetCalories}
                    macros={results.macros}
                    macroDistribution={results.macroOption}
                  />
                </Card>
              </TabPane>
              
              <TabPane 
                tab={<span><HistoryOutlined /> Lịch sử</span>} 
                key="history"
              >
                <Card bordered={false}>
                  <HistoryRecord records={historyRecords.map(r => ({
                    ...r,
                    id: typeof r.id === 'string' ? r.id : r.id !== undefined ? String(r.id) : '',
                    gender: r.gender === 'male' ? 'male' : 'female',
                    activityLevel: r.activityLevel as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
                  }))} />
                </Card>
              </TabPane>
            </Tabs>
          ) : (
            <Card bordered={false} className="empty-state-card">
              <Empty
                description="Nhập thông tin cá nhân và nhấn 'Tính toán' để xem kết quả"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default HealthCalculator;