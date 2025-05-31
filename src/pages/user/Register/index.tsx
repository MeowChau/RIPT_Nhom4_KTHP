import React, { useState } from 'react';
import { Card, Steps } from 'antd';
import { history } from 'umi';
import RegisterForm from '@/pages/user/Register/components/ResgisterForm';
import PaymentPlans from './components/PaymentPlans';
import PaymentStatus from './components/PaymentStatus';
import RegisterResult from './components/RegisterResult';
import { register } from '@/services/Auth';
import moment from 'moment';
import styles from './index.less';

const { Step } = Steps;

// Định nghĩa các bước đăng ký
enum RegisterStep {
  FORM = 0,
  PAYMENT_PLAN = 1,
  PAYMENT_STATUS = 2,
  RESULT = 3
}

const RegisterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<RegisterStep>(RegisterStep.FORM);
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  // Removed unused state variable: paymentStatus

  // Xử lý khi nhận thông tin đăng ký từ form
  const handleInfoSubmit = (values: any) => {
    setUserInfo(values);
    setCurrentStep(RegisterStep.PAYMENT_PLAN);
  };

  // Xử lý khi nhận thông tin gói thanh toán đã chọn
  const handlePlanSelected = (planId: string, paymentData: any) => {
    setSelectedPlanId(planId);
    setPaymentUrl(paymentData.paymentUrl);
    setOrderId(paymentData.orderId);
    setCurrentStep(RegisterStep.PAYMENT_STATUS);
  };

  // Hoàn tất đăng ký - ĐỊNH NGHĨA TRƯỚC KHI SỬ DỤNG
  const completeRegistration = async () => {
    if (!userInfo || !orderId) return;

    try {
      setLoading(true);
      
      const formattedStartDate = userInfo.startDate 
        ? moment(userInfo.startDate).format('YYYY-MM-DD') 
        : moment().format('YYYY-MM-DD');
      
      const registerData = {
        ...userInfo,
        orderId,
        planId: selectedPlanId,
        startDate: formattedStartDate,
      };
      
      // Gọi API đăng ký
      const response = await register(registerData);
      
      if (response.success) {
        setCurrentStep(RegisterStep.RESULT);
      } else {
        // Xử lý lỗi đăng ký
        console.error('Đăng ký thất bại:', response.message);
      }
    } catch (error) {
      console.error('Lỗi hoàn tất đăng ký:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi nhận trạng thái thanh toán - SỬ DỤNG SAU KHI ĐÃ ĐỊNH NGHĨA
  const handlePaymentStatusChange = (status: 'pending' | 'completed' | 'failed') => {
    // Nếu thanh toán thành công, tiến hành đăng ký tài khoản
    if (status === 'completed') {
      completeRegistration();
    }
  };

  // Xử lý quay lại bước trước
  const handleGoBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => (prevStep - 1) as RegisterStep);
    }
  };

  // Nội dung các bước
  const steps = [
    {
      title: 'Thông tin',
      content: <RegisterForm onFinish={handleInfoSubmit} loading={loading} />,
    },
    {
      title: 'Chọn gói',
      content: (
        <PaymentPlans 
          onSelect={handlePlanSelected}
          onBack={handleGoBack}
          loading={loading}
        />
      ),
    },
    {
      title: 'Thanh toán',
      content: (
        <PaymentStatus
          paymentUrl={paymentUrl}
          orderId={orderId}
          onStatusChange={handlePaymentStatusChange}
          onBack={() => setCurrentStep(RegisterStep.PAYMENT_PLAN)}
          loading={loading}
        />
      ),
    },
    {
      title: 'Hoàn tất',
      content: <RegisterResult onLogin={() => history.push('/user/login')} />,
    },
  ];

  return (
    <div className={styles.container}>
      <Card title="Đăng ký hội viên" className={styles.card}>
        <Steps current={currentStep} className={styles.steps}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className={styles.stepsContent}>
          {steps[currentStep].content}
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;