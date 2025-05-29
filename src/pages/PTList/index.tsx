import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Empty } from 'antd';
import usePT from '@/models/pt';
import PTGymFilter from './components/PTGymFilter';
import PTTable from './components/PTTable';
import '@/pages/PTList/components/style.less';

const PTListPage: React.FC = () => {
  const [selectedGym, setSelectedGym] = useState<string>();
  const { trainers, loading, fetchTrainers } = usePT();

  useEffect(() => {
    fetchTrainers({ gymId: selectedGym });
  }, [fetchTrainers, selectedGym]);

  const handleGymChange = (value: string) => {
    setSelectedGym(value);
  };

  const renderContent = () => {
    if (trainers.length === 0 && !loading) {
      return (
        <div className="empty-state">
          <Empty 
            description="Không tìm thấy huấn luyện viên nào" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      );
    }

    return (
      <PTTable 
        dataSource={trainers} 
        loading={loading} 
      />
    );
  };

  return (
    <PageContainer
      title="Danh sách huấn luyện viên cá nhân"
    >
      <div className="pt-list-container">
        <Card>
          <div className="pt-filter-row">
            <PTGymFilter value={selectedGym} onChange={handleGymChange} />
          </div>
          {renderContent()}
        </Card>
      </div>
    </PageContainer>
  );
};

export default PTListPage;