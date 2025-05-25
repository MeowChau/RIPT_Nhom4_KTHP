import React, { useEffect, useState } from 'react';
import { Table, message, Row, Col, Card, Typography } from 'antd';
import RevenueColumn from './RevenueColumn';
import ExpenseInput from './ExpenseInput';
import ProfitColumn from './ProfitColumn';
import { queryPayments } from '@/services/payment';

const { Title } = Typography;

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Các phương án giá cho từng gói tập với kiểu dữ liệu rõ ràng hơn
  const membershipPricing: Record<string, number> = {
    '1 month': 500,
    '3 months': 1000,
    '6 months': 1500,
    '12 months': 2000,
  };

  // Các chi phí nhập vào
  const [expenses, setExpenses] = useState({
    rent: 0,
    salaries: 0,
    maintenance: 0,
    marketing: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await queryPayments();
      setPayments(data || []); // Đảm bảo không bị undefined
    } catch {
      message.error('Không tải được danh sách thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Mã hội viên', dataIndex: 'memberId', key: 'memberId' },
    { title: 'Gói tập', dataIndex: 'package', key: 'package' },
    { 
      title: 'Doanh thu từ Gói tập',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (_: any, record: any) => (
        <RevenueColumn 
          packageType={record.package} 
          memberCount={record.amount} 
          pricing={membershipPricing}
        />
      ),
    },
    { 
      title: 'Lợi nhuận',
      dataIndex: 'profit',
      key: 'profit',
      render: (_: any, record: any) => (
        <ProfitColumn 
          packageType={record.package}
          memberCount={record.amount}
          expenses={expenses}
          pricing={membershipPricing}
        />
      ),
    },
    { 
      title: 'Ngày', 
      dataIndex: 'date', 
      key: 'date', 
      render: (val: string) => val ? new Date(val).toLocaleDateString() : '' 
    },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
  ];

  // Tính tổng doanh thu
  const totalRevenue = payments.reduce((sum, payment) => {
    const packagePrice = membershipPricing[payment.package] || 0;
    return sum + (packagePrice * (payment.amount || 0));
  }, 0);

  // Tính tổng chi phí
  const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + (Number(value) || 0), 0);

  return (
    <div>
      <Row gutter={16}>
        {/* Cột Doanh thu */}
        <Col span={12}>
          <Card>
            <Title level={4}>Phương án Doanh thu</Title>
            {payments.map((payment) => {
              const membershipCost = membershipPricing[payment.package] || 0;
              const revenue = membershipCost * (payment.amount || 0);
              return (
                <div key={payment._id || payment.id}>
                  <p><strong>Gói tập:</strong> {payment.package}</p>
                  <p><strong>Doanh thu:</strong> {revenue.toLocaleString()}</p>
                </div>
              );
            })}
            <Title level={5}>Tổng Doanh thu: {totalRevenue.toLocaleString()}</Title>
          </Card>
        </Col>

        {/* Cột Chi phí */}
        <Col span={12}>
          <Card>
            <Title level={4}>Phương án Chi phí</Title>
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <label>Chi phí Mặt bằng:</label>
                <ExpenseInput 
                  value={expenses.rent} 
                  onChange={(value) => setExpenses({ ...expenses, rent: Number(value) || 0 })} 
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label>Chi phí Lương Nhân viên:</label>
                <ExpenseInput 
                  value={expenses.salaries} 
                  onChange={(value) => setExpenses({ ...expenses, salaries: Number(value) || 0 })} 
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label>Chi phí Bảo trì:</label>
                <ExpenseInput 
                  value={expenses.maintenance} 
                  onChange={(value) => setExpenses({ ...expenses, maintenance: Number(value) || 0 })} 
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label>Chi phí Marketing:</label>
                <ExpenseInput 
                  value={expenses.marketing} 
                  onChange={(value) => setExpenses({ ...expenses, marketing: Number(value) || 0 })} 
                />
              </div>
            </div>
            <div>
              <Title level={5}>Tổng Chi phí: {totalExpenses.toLocaleString()}</Title>
            </div>
          </Card>
        </Col>
      </Row>

      <Table
        dataSource={payments}
        columns={columns}
        rowKey={(record) => record._id || record.id}
        loading={loading}
      />
    </div>
  );
};

export default PaymentsPage;