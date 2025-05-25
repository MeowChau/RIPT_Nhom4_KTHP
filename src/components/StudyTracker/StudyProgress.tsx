import { useState, useEffect } from 'react'; 
import { Table, Modal, Form, Input, DatePicker, Button, Progress, InputNumber } from 'antd';

const StudyProgress = () => {
  const [progressData, setProgressData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [studyGoal, setStudyGoal] = useState<number>(0);
  const [completedHours, setCompletedHours] = useState<number>(0);
  const [form] = Form.useForm();
  const [goalForm] = Form.useForm();

  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem('studyProgressData') || '[]');
    setProgressData(savedProgress);
    const savedGoal = Number(localStorage.getItem('studyGoal')) || 0;
    setStudyGoal(savedGoal);
    calculateCompletedHours(savedProgress);
  }, []);

  const saveToLocalStorage = (updatedProgress: any[]) => {
    localStorage.setItem('studyProgressData', JSON.stringify(updatedProgress));
  };

  const addProgress = (values: any) => {
    const updatedProgress = [...progressData, values];
    setProgressData(updatedProgress);
    saveToLocalStorage(updatedProgress);
    calculateCompletedHours(updatedProgress);
    setModalVisible(false);
    form.resetFields();
  };

  const calculateCompletedHours = (data: any[]) => {
    const totalHours = data.reduce((sum, entry) => sum + (parseFloat(entry.hours) || 0), 0);
    setCompletedHours(totalHours);
  };

  const setGoal = (values: any) => {
    setStudyGoal(values.goal);
    localStorage.setItem('studyGoal', values.goal.toString());
    setGoalModalVisible(false);
    goalForm.resetFields();
  };

  const columns = [
    { title: 'Môn học', dataIndex: 'subject', key: 'subject' },
    { title: 'Ngày học', dataIndex: 'date', key: 'date' },
    { title: 'Nội dung', dataIndex: 'content', key: 'content' },
    { title: 'Số giờ', dataIndex: 'hours', key: 'hours' },
  ];

  return (
    <div>
      <h2>Mục tiêu học tập</h2>
      <Button type="primary" onClick={() => setModalVisible(true)}>Thêm tiến độ</Button>
      <Button type="default" onClick={() => setGoalModalVisible(true)} style={{ marginLeft: '10px' }}>Thiết lập mục tiêu</Button>
      <Progress percent={studyGoal ? (completedHours / studyGoal) * 100 : 0} status={completedHours >= studyGoal ? 'success' : 'active'} style={{ marginTop: '10px' }} />
      <p>{`Đã học: ${completedHours} giờ / Mục tiêu: ${studyGoal} giờ`}</p>
      <Table dataSource={progressData} columns={columns} rowKey="date" style={{ marginTop: '10px' }} />
      
      <Modal title="Thêm tiến độ học tập" visible={modalVisible} onCancel={() => setModalVisible(false)} onOk={() => form.submit()}>
        <Form form={form} onFinish={addProgress}>
          <Form.Item name="subject" label="Môn học" rules={[{ required: true }]}> 
            <Input /> 
          </Form.Item>
          <Form.Item name="date" label="Ngày học" rules={[{ required: true }]}> 
            <DatePicker style={{ width: '100%' }} /> 
          </Form.Item>
          <Form.Item name="content" label="Nội dung"> 
            <Input.TextArea /> 
          </Form.Item>
          <Form.Item name="hours" label="Số giờ" rules={[{ required: true, type: 'number', min: 0 }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
      
      <Modal title="Thiết lập mục tiêu học tập" visible={goalModalVisible} onCancel={() => setGoalModalVisible(false)} onOk={() => goalForm.submit()}>
        <Form form={goalForm} onFinish={setGoal}>
          <Form.Item name="goal" label="Mục tiêu (giờ)" rules={[{ required: true, type: 'number', min: 1 }]}> 
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudyProgress;
