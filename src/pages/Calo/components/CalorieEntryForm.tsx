import React, { useEffect, useState } from 'react';
import {
  Form,
  Button,
  DatePicker,
  InputNumber,
  Card,
  Row,
  Col,
  Statistic,
  Divider,
  Select,
} from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import moment from 'moment';
import { calculateCalories } from '@/services/Calo/index';
import styles from '@/pages/Calo/components/index.less';

interface CalorieFormProps {
  submitting: boolean;
  onSubmit: (values: any) => Promise<boolean>;
  initialValues?: Partial<API.CalorieEntry>;
  isUpdate?: boolean;
}

const CalorieEntryForm: React.FC<CalorieFormProps> = ({
  submitting,
  onSubmit,
  initialValues,
  isUpdate = false,
}) => {
  const [form] = Form.useForm();
  const [calculatedValues, setCalculatedValues] = useState({
    totalCaloIntake: 0,
    caloDiff: 0,
  });

  // Re-calculate whenever form values change
  const recalculate = () => {
    try {
      const protein = form.getFieldValue('protein') || 0;
      const carb = form.getFieldValue('carb') || 0;
      const fat = form.getFieldValue('fat') || 0;
      const caloTarget = form.getFieldValue('caloTarget') || 0;
      
      const { totalCaloIntake, caloDiff } = calculateCalories(protein, carb, fat, caloTarget);
      setCalculatedValues({ totalCaloIntake, caloDiff });
    } catch (error) {
      console.error('Error calculating values', error);
    }
  };

  useEffect(() => {
    // Set initial values if provided (for update mode)
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        date: initialValues.date ? moment(initialValues.date) : moment(),
      });
      recalculate();
    }
  }, [initialValues, form]);

  const handleFinish = async (values: any) => {
    const formattedValues = {
      ...values,
      date: values.date.format('YYYY-MM-DD'),
    };
    
    const success = await onSubmit(formattedValues);
    if (success && !isUpdate) {
      form.resetFields();
      setCalculatedValues({ totalCaloIntake: 0, caloDiff: 0 });
    }
  };

  const disabledDate = (current: moment.Moment) => {
    // Can't select days in the future
    return current && current > moment().endOf('day');
  };

  return (
    <Card 
      title={isUpdate ? 'Update Calorie Entry' : 'Add New Calorie Entry'}
      className={styles.formCard}
      bordered={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onValuesChange={recalculate}
        initialValues={{
          date: moment(),
          meals: 3,
          protein: 0,
          carb: 0,
          fat: 0,
          caloTarget: 2000,
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="YYYY-MM-DD" 
                disabledDate={disabledDate}
                disabled={isUpdate} // Can't change date in update mode
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="meals"
              label="Number of Meals"
              rules={[{ required: true, message: 'Please enter number of meals' }]}
            >
              <Select>
                <Select.Option value={1}>1 meal</Select.Option>
                <Select.Option value={2}>2 meals</Select.Option>
                <Select.Option value={3}>3 meals</Select.Option>
                <Select.Option value={4}>4 meals</Select.Option>
                <Select.Option value={5}>5 meals</Select.Option>
                <Select.Option value={6}>6+ meals</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item
              name="protein"
              label="Protein (g)"
              rules={[{ required: true, message: 'Please enter protein amount' }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0}
                addonAfter="g"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              name="carb"
              label="Carbs (g)"
              rules={[{ required: true, message: 'Please enter carb amount' }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0}
                addonAfter="g"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              name="fat"
              label="Fat (g)"
              rules={[{ required: true, message: 'Please enter fat amount' }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                min={0}
                addonAfter="g"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="caloTarget"
          label="Calorie Target (kcal)"
          rules={[{ required: true, message: 'Please enter your calorie target' }]}
        >
          <InputNumber 
            style={{ width: '100%' }} 
            min={500}
            step={100}
            addonAfter="kcal"
          />
        </Form.Item>

        <Divider />

        <Row gutter={24} className={styles.calculatedRow}>
          <Col xs={24} md={8}>
            <Statistic 
              title="Total Calorie Intake" 
              value={calculatedValues.totalCaloIntake} 
              suffix="kcal"
              precision={0}
            />
          </Col>
          <Col xs={24} md={8}>
            <Statistic 
              title="Calorie Difference" 
              value={calculatedValues.caloDiff} 
              precision={0}
              valueStyle={{ 
                color: calculatedValues.caloDiff > 0 ? '#cf1322' : calculatedValues.caloDiff < 0 ? '#3f8600' : undefined
              }}
              prefix={calculatedValues.caloDiff > 0 ? '+' : ''}
              suffix="kcal"
            />
          </Col>
          <Col xs={24} md={8} className={styles.submitButtonCol}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitting}
              icon={isUpdate ? <SaveOutlined /> : <PlusOutlined />}
              block
            >
              {isUpdate ? 'Update Entry' : 'Add Entry'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default CalorieEntryForm;