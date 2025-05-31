import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Button, Spin } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { getPaymentPlans, createPaymentLink } from '@/services/Payment/index';
import styles from '../index.less';

const { Title, Text } = Typography;

interface PaymentPlansProps {
  onSelect: (planId: string, paymentData: any) => void;
  onBack: () => void;
  loading: boolean;
}

const PaymentPlans: React.FC<PaymentPlansProps> = ({ onSelect, onBack, loading }) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [loadingPlans, setLoadingPlans] = useState<boolean>(false);
  const [creatingPayment, setCreatingPayment] = useState<boolean>(false);

  // Lấy danh sách gói thanh toán
  useEffect(() => {
    const fetchPaymentPlans = async () => {
      try {
        setLoadingPlans(true);
        const response: any = await getPaymentPlans();
        console.log('Payment plans response:', response);
        
        if (response?.success && Array.isArray(response.plans)) {
          setPlans(response.plans);
        } else if (Array.isArray(response)) {
          setPlans(response);
        } else {
          console.error('Định dạng dữ liệu gói thanh toán không hợp lệ:', response);
          setPlans([]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách gói thanh toán:', error);
        setPlans([]);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPaymentPlans();
  }, []);

  // Xử lý chọn gói
  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  // Xử lý thanh toán
  const handleCreatePayment = async () => {
    if (!selectedPlanId) {
      return;
    }

    try {
      setCreatingPayment(true);
      const response = await createPaymentLink({ planId: selectedPlanId });
      console.log('Payment link response:', response);

      if (response?.success && response.paymentUrl && response.orderId) {
        // Mở cửa sổ thanh toán
        window.open(response.paymentUrl, '_blank');
        
        // Chuyển sang bước tiếp theo
        onSelect(selectedPlanId, {
          paymentUrl: response.paymentUrl,
          orderId: response.orderId
        });
      } else {
        console.error('Không thể tạo link thanh toán:', response?.message);
      }
    } catch (error) {
      console.error('Lỗi tạo thanh toán:', error);
    } finally {
      setCreatingPayment(false);
    }
  };

  if (loadingPlans) {
    return (
      <div style={{ textAlign: 'center', padding: '30px' }}>
        <Spin size="large" tip="Đang tải danh sách gói đăng ký..." />
      </div>
    );
  }

  return (
    <div className={styles.paymentPlans}>
      <Title level={4}>Chọn gói đăng ký</Title>
      <Text type="secondary">Vui lòng chọn gói đăng ký phù hợp với nhu cầu của bạn</Text>
      
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {plans.map((plan) => (
          <Col xs={24} sm={12} md={8} lg={6} key={plan.id}>
            <Card
              hoverable
              className={`${styles.planCard} ${selectedPlanId === plan.id ? styles.selectedPlan : ''}`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              <Title level={4}>{plan.name}</Title>
              <Title level={3}>{plan.price.toLocaleString('vi-VN')} đ</Title>
              <Text>Thời hạn: {plan.duration} tháng</Text>
              {selectedPlanId === plan.id && (
                <div className={styles.selectedMark}>
                  <CheckCircleFilled />
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
      
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Button
          type="primary"
          onClick={handleCreatePayment}
          disabled={!selectedPlanId || creatingPayment || loading}
          loading={creatingPayment}
          size="large"
        >
          Thanh toán ngay
        </Button>
        <Button
          style={{ marginLeft: 16 }}
          onClick={onBack}
          disabled={creatingPayment || loading}
          size="large"
        >
          Quay lại
        </Button>
      </div>
    </div>
  );
};

export default PaymentPlans;