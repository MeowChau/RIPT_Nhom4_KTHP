import { useState, useEffect, useRef } from 'react';
import { message } from 'antd';
import { getPaymentPlans, createPaymentLink, checkPaymentStatus, register } from '@/services/Payment/index';
import type { API } from '@/services/Payment/typings';
import moment from 'moment';

export enum RegisterStep {
  FORM = 0,
  PAYMENT_PLAN = 1,
  PAYMENT_STATUS = 2,
  RESULT = 3,
}

export interface RegisterFormValues {
  name: string;
  email: string;
  phone: string;
  gymId: string;
  startDate?: moment.Moment;
}

export default function useRegisterPayment() {
  // State
  const [currentStep, setCurrentStep] = useState<RegisterStep>(RegisterStep.FORM);
  const [formValues, setFormValues] = useState<RegisterFormValues | null>(null);
  const [plans, setPlans] = useState<API.PaymentPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed' | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);

  // Refs
  const paymentCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Fetch payment plans
  useEffect(() => {
    async function fetchPaymentPlans() {
      try {
        setLoading(true);
        const response = await getPaymentPlans();
        if (response.success && response.plans) {
          setPlans(response.plans);
        } else {
          message.error('Không thể lấy thông tin gói đăng ký');
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách gói:', error);
        message.error('Không thể kết nối đến server');
      } finally {
        setLoading(false);
      }
    }

    if (currentStep === RegisterStep.PAYMENT_PLAN) {
      fetchPaymentPlans();
    }
  }, [currentStep]);

  // Cleanup interval when component unmounts
  useEffect(() => {
    return () => {
      if (paymentCheckInterval.current) {
        clearInterval(paymentCheckInterval.current);
      }
    };
  }, []);

  // Handle form submission
  const handleFormSubmit = (values: RegisterFormValues) => {
    setFormValues(values);
    setCurrentStep(RegisterStep.PAYMENT_PLAN);
  };

  // Handle plan selection
  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };
  // Complete registration after successful payment
  const completeRegistration = async (paymentOrderId: string) => {
    if (!formValues) {
      message.error('Không tìm thấy thông tin đăng ký');
      return;
    }

    try {
      setLoading(true);
      
      const { name, email, phone, gymId, startDate } = formValues;
      
      // Format date
      const formattedStartDate = startDate 
        ? startDate.format('YYYY-MM-DD') 
        : moment().format('YYYY-MM-DD');
      
      const registerParams: API.RegisterParams = {
        name,
        email,
        phone,
        password: phone, // Default password is phone number
        gymId,
        orderId: paymentOrderId,
        startDate: formattedStartDate,
      };

      const response = await register(registerParams);
      
      if (response.success) {
        setRegisterSuccess(true);
        message.success('Đăng ký thành công! Mật khẩu mặc định là số điện thoại của bạn.');
        setCurrentStep(RegisterStep.RESULT);
      } else {
        message.error(response.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      message.error('Có lỗi xảy ra khi đăng ký tài khoản');
    } finally {
      setLoading(false);
    }
  };
   // Check payment status
  const checkPayment = async (paymentOrderId: string) => {
    try {
      setLoading(true);
      const response = await checkPaymentStatus(paymentOrderId);

      if (response.success && response.data) {
        const { status } = response.data;
        
        if (status === 'completed') {
          // Payment successful
          setPaymentStatus('completed');
          
          // Stop checking
          if (paymentCheckInterval.current) {
            clearInterval(paymentCheckInterval.current);
            paymentCheckInterval.current = null;
          }
          
          // Complete registration
          completeRegistration(paymentOrderId);
        } else if (status === 'failed') {
          // Payment failed
          setPaymentStatus('failed');
          
          // Stop checking
          if (paymentCheckInterval.current) {
            clearInterval(paymentCheckInterval.current);
            paymentCheckInterval.current = null;
          }
          
          message.error('Thanh toán thất bại. Vui lòng thử lại.');
        } else {
          // Still pending
          setPaymentStatus('pending');
        }
      }
    } catch (error) {
      console.error('Lỗi kiểm tra thanh toán:', error);
    } finally {
      setLoading(false);
    }
  };


  // Start payment status check
  const startPaymentStatusCheck = (paymentOrderId: string) => {
    // Clear existing interval if any
    if (paymentCheckInterval.current) {
      clearInterval(paymentCheckInterval.current);
    }

    // Set up new interval
    paymentCheckInterval.current = setInterval(() => {
      checkPayment(paymentOrderId);
    }, 5000); // Check every 5 seconds
  };

  // Create payment
  const handleCreatePayment = async () => {
    if (!selectedPlanId) {
      message.error('Vui lòng chọn gói đăng ký');
      return;
    }

    try {
      setLoading(true);
      const response = await createPaymentLink({ planId: selectedPlanId });

      if (response.success && response.paymentUrl && response.orderId) {
        setPaymentUrl(response.paymentUrl);
        setOrderId(response.orderId);
        
        // Mở cửa sổ mới để thanh toán
        window.open(response.paymentUrl, '_blank');
        
        // Chuyển sang bước kiểm tra thanh toán
        setCurrentStep(RegisterStep.PAYMENT_STATUS);
        
        // Thiết lập interval để kiểm tra thanh toán
        startPaymentStatusCheck(response.orderId);
      } else {
        message.error(response.message || 'Không thể tạo link thanh toán');
      }
    } catch (error) {
      console.error('Lỗi tạo thanh toán:', error);
      message.error('Có lỗi xảy ra khi kết nối đến cổng thanh toán');
    } finally {
      setLoading(false);
    }
  };

 

  // Manual payment check
  const handleManualCheckPayment = () => {
    if (orderId) {
      checkPayment(orderId);
    }
  };

  // Cancel payment and go back to plan selection
  const handleCancelPayment = () => {
    if (paymentCheckInterval.current) {
      clearInterval(paymentCheckInterval.current);
      paymentCheckInterval.current = null;
    }
    
    setPaymentStatus(null);
    setCurrentStep(RegisterStep.PAYMENT_PLAN);
  };

  // Go back to previous step
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    formValues,
    plans,
    selectedPlanId,
    paymentUrl,
    orderId,
    loading,
    paymentStatus,
    registerSuccess,
    handleFormSubmit,
    handleSelectPlan,
    handleCreatePayment,
    handleManualCheckPayment,
    handleCancelPayment,
    handlePrev,
  };
}