import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import HealthCalculator from './components/HealthCalculator';
import '@/pages/TDEE/components/index.less';

const TDEEPage: React.FC = () => {
  return (
    <PageContainer
      header={{
        title: 'Tính toán chỉ số sức khỏe',
        subTitle: 'BMI - TDEE - Lịch tập - Chế độ ăn',
      }}
    >
      <HealthCalculator />
    </PageContainer>
  );
};

export default TDEEPage;