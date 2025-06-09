import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Button, Tabs } from 'antd';
import { 
  PlusOutlined, 
  LineChartOutlined, 
  TableOutlined 
} from '@ant-design/icons';
import styles from '@/pages/Calo/components/index.less';

// Import components
import CalorieEntryForm from './components/CalorieEntryForm';
import CalorieStatistics from './components/CalorieStatistics';
import WeeklyChart from './components/WeeklyChart';
import CalorieTable from './components/CalorieTable';

// Import model
import useCalorieTracker from '@/models/useCalo';

const { TabPane } = Tabs;

const CalorieTracker: React.FC = () => {
  const {
    weeklyData,
    weeklySummary,
    loading,
    submitting,
    addCalorieEntry,
    updateCalorie,
  } = useCalorieTracker();

  const [activeTab, setActiveTab] = useState('1');
  const [editMode, setEditMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  // Find the entry being edited
  const entryToEdit = selectedDate 
    ? weeklyData.find(item => item.date === selectedDate) 
    : undefined;

  const handleEdit = (date: string) => {
    setSelectedDate(date);
    setEditMode(true);
    setActiveTab('1'); // Switch to form tab
  };

  const handleSubmit = async (values: any) => {
    if (editMode && selectedDate) {
      const success = await updateCalorie(selectedDate, values);
      if (success) {
        setEditMode(false);
        setSelectedDate('');
      }
      return success;
    } else {
      return await addCalorieEntry(values);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedDate('');
  };

  return (
    <PageContainer
      title="Calorie Tracker"
      subTitle="Track and manage your daily calorie intake"
      header={{
        extra: [
          editMode && (
            <Button key="cancel" onClick={handleCancelEdit}>
              Cancel Edit
            </Button>
          ),
        ],
      }}
      content={
        <div className={styles.pageHeader}>
          <CalorieStatistics weeklySummary={weeklySummary} loading={loading} />
        </div>
      }
    >
      <div className={styles.mainContainer}>
        <div className={styles.tabsContainer}>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            type="card"
            size="large"
            tabBarGutter={8}
          >
            <TabPane 
              tab={
                <span>
                  <PlusOutlined /> {editMode ? 'Edit Entry' : 'Add Entry'}
                </span>
              } 
              key="1"
            >
              {editMode && (
                <Alert
                  message="Edit Mode"
                  description={`You are editing the entry for ${selectedDate}. Click Cancel Edit to go back.`}
                  type="warning"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}
              <CalorieEntryForm 
                submitting={submitting}
                onSubmit={handleSubmit}
                isUpdate={editMode}
                initialValues={entryToEdit as any}
              />
            </TabPane>
            <TabPane 
              tab={
                <span>
                  <LineChartOutlined /> Weekly Chart
                </span>
              } 
              key="2"
            >
              <WeeklyChart weeklyData={weeklyData} loading={loading} />
            </TabPane>
            <TabPane 
              tab={
                <span>
                  <TableOutlined /> Records Table
                </span>
              } 
              key="3"
            >
              <CalorieTable 
                weeklyData={weeklyData} 
                loading={loading} 
                onEdit={handleEdit}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
};

export default CalorieTracker;