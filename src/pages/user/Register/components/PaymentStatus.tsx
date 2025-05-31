import React, { useState, useEffect, useRef } from 'react';
import { Typography, Button, Spin, Result } from 'antd';
import { checkPaymentStatus } from '@/services/Payment';
import styles from '../index.less';

const { Title, Text } = Typography;

interface PaymentStatusProps {
  paymentUrl: string;
  orderId: string;
  onStatusChange: (status: 'pending' | 'completed' | 'failed') => void;
  onBack: () => void;
  loading: boolean;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ 
  paymentUrl, 
  orderId, 
  onStatusChange, 
  onBack,
  loading 
}) => {
  const [checkingPayment, setCheckingPayment] = useState<boolean>(false);
  const [status, setStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Kiểm tra kết quả thanh toán
  const checkPayment = async () => {
    if (!orderId || status === 'completed') return;
    
    try {
      setCheckingPayment(true);
      const response = await checkPaymentStatus(orderId);
      console.log('Payment status response:', response);

      if (response?.success && response.data) {
        const newStatus = response.data.status as 'pending' | 'completed' | 'failed';
        setStatus(newStatus);
        
        if (newStatus !== 'pending') {
          // Nếu trạng thái khác pending, thông báo lên component cha
          onStatusChange(newStatus);
          
          // Dừng interval kiểm tra
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }
    } catch (error) {
      console.error('Lỗi kiểm tra thanh toán:', error);
    } finally {
      setCheckingPayment(false);
    }
  };

  // Kiểm tra thanh toán định kỳ
  useEffect(() => {
    // Kiểm tra ngay khi component được mount
    checkPayment();
    
    // Thiết lập interval kiểm tra mỗi 5 giây
    intervalRef.current = setInterval(() => {
      checkPayment();
    }, 5000);
    
    // Dọn dẹp interval khi component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [orderId]);

  // Kiểm tra thanh toán thủ công
  const handleManualCheck = () => {
    checkPayment();
  };

  if (status === 'completed') {
    return (
      <Result
        status="success"
        title="Thanh toán thành công!"
        subTitle="Đang hoàn tất đăng ký tài khoản của bạn..."
      />
    );
  }

  if (status === 'failed') {
    return (
      <Result
        status="error"
        title="Thanh toán thất bại"
        subTitle="Vui lòng thử lại hoặc chọn gói khác."
        extra={[
          <Button
            type="primary"
            key="retry"
            onClick={() => window.open(paymentUrl, '_blank')}
            disabled={loading}
          >
            Thử thanh toán lại
          </Button>,
          <Button
            key="back"
            onClick={onBack}
            disabled={loading}
          >
            Chọn gói khác
          </Button>
        ]}
      />
    );
  }

  return (
    <div className={styles.paymentStatus}>
      <Title level={4}>Xác nhận thanh toán</Title>
      
      {checkingPayment ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" tip="Đang kiểm tra thanh toán..." />
        </div>
      ) : (
        <>
          <Text>Vui lòng hoàn tất thanh toán trong cửa sổ đã mở.</Text>
          <div style={{ marginTop: 16 }}>
            <Button
              type="primary"
              onClick={handleManualCheck}
              disabled={loading || checkingPayment}
            >
              Tôi đã thanh toán xong
            </Button>
            
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => window.open(paymentUrl, '_blank')}
              disabled={loading || checkingPayment}
            >
              Mở lại cổng thanh toán
            </Button>
            
            <Button
              style={{ marginLeft: 8 }}
              onClick={onBack}
              disabled={loading || checkingPayment}
            >
              Hủy và chọn gói khác
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentStatus;