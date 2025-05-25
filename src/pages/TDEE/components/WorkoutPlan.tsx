import React from 'react';
import { Typography, Table, Tag, List, Space, Button, message } from 'antd';
import { FireOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface WorkoutPlanProps {
  bmi: number;
  goal: string;
  activityLevel: string;
}

const WorkoutPlan: React.FC<WorkoutPlanProps> = ({ bmi, goal, activityLevel }) => {
  // Hàm lưu lịch tập (giả lập)
  const saveWorkoutPlan = (type: string) => {
    message.success('Đã lưu lịch tập thành công!');
  };

  // Xác định kiểu lịch tập dựa trên mục tiêu và mức độ hoạt động
  const getWorkoutType = () => {
    if (goal === 'lose_weight') {
      return activityLevel === 'sedentary' || activityLevel === 'light' 
        ? 'beginner' 
        : 'intermediate';
    } else if (goal === 'gain_weight') {
      return 'strength';
    } else {
      return 'balanced';
    }
  };

  const workoutType = getWorkoutType();
  
  // Lịch tập theo từng loại
  const workoutPlans = {
    beginner: {
      title: 'Lịch tập cho người mới bắt đầu (3-4 ngày/tuần)',
      description: 'Tập trung vào việc xây dựng thói quen và tạo nền tảng thể chất.',
      schedule: [
        {
          day: 'Thứ 2',
          workout: 'Cardio nhẹ (30 phút đi bộ nhanh hoặc đạp xe) + Cơ bản toàn thân',
          exercises: [
            'Đi bộ nhanh/đạp xe (30 phút)',
            'Squat đơn giản (3 hiệp x 10 lần)',
            'Hít đất biến thể (3 hiệp x 8 lần)',
            'Plank (3 hiệp x 30 giây)',
            'Crunches (3 hiệp x 12 lần)'
          ],
          intensity: 'Nhẹ đến vừa'
        },
        // ...các ngày khác trong tuần (tương tự ở các ví dụ trước)
      ]
    },
    intermediate: {
      title: 'Lịch tập trung cấp (4-5 ngày/tuần)',
      description: 'Tăng cường độ và đa dạng hóa bài tập để phát triển sức bền và cơ bắp.',
      schedule: [
        {
          day: 'Thứ 2',
          workout: 'Cardio vừa (40 phút chạy bộ/chạy xe) + Toàn thân nâng cao',
          exercises: [
            'Chạy bộ/chạy xe (40 phút)',
            'Squat (4 hiệp x 12 lần)',
            'Hít đất (4 hiệp x 10 lần)',
            'Plank (4 hiệp x 45 giây)',
            'Crunches (4 hiệp x 15 lần)'
          ],
          intensity: 'Vừa'
        },
        // ...các ngày khác trong tuần
      ]
    },
    strength: {
      title: 'Lịch tập tăng cơ (5 ngày/tuần)',
      description: 'Tập trung vào các bài tập sức mạnh và tăng cơ bắp.',
      schedule: [
        {
          day: 'Thứ 2',
          workout: 'Tập tạ toàn thân + Cardio nhẹ',
          exercises: [
            'Deadlift (4 hiệp x 8 lần)',
            'Bench Press (4 hiệp x 8 lần)',
            'Bent-over Row (4 hiệp x 10 lần)',
            'Đi bộ nhanh (20 phút)'
          ],
          intensity: 'Cao'
        },
        // ...các ngày khác trong tuần
      ]
    },
    balanced: {
      title: 'Lịch tập cân bằng (3-5 ngày/tuần)',
      description: 'Kết hợp giữa cardio, sức mạnh và linh hoạt.',
      schedule: [
        {
          day: 'Thứ 2',
          workout: 'Cardio + Sức mạnh cơ bản',
          exercises: [
            'Chạy bộ (30 phút)',
            'Squat (3 hiệp x 12 lần)',
            'Push-up (3 hiệp x 10 lần)',
            'Yoga giãn cơ (15 phút)'
          ],
          intensity: 'Vừa'
        },
        // ...các ngày khác trong tuần
      ]
    }
  };

  const plan = workoutPlans[workoutType];

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'day',
      key: 'day',
      width: 100
    },
    {
      title: 'Bài tập',
      dataIndex: 'workout',
      key: 'workout'
    },
    {
      title: 'Cường độ',
      dataIndex: 'intensity',
      key: 'intensity',
      width: 120,
      render: (intensity: string) => {
        let color = 'green';
        if (intensity.includes('Vừa')) color = 'blue';
        if (intensity.includes('Cao')) color = 'orange';
        if (intensity.includes('Rất cao')) color = 'red';
        return <Tag color={color} icon={<FireOutlined />}>{intensity}</Tag>;
      }
    }
  ];

  return (
    <div>
      <Title level={4}>{plan.title}</Title>
      <Paragraph>{plan.description}</Paragraph>
      
      <Table 
        dataSource={plan.schedule} 
        columns={columns}
        rowKey="day"
        pagination={false}
        expandable={{
          expandedRowRender: (record) => (
            <List
              size="small"
              header={<Text strong>Chi tiết bài tập:</Text>}
              dataSource={record.exercises}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          )
        }}
      />
      
      <Space direction="vertical" style={{ width: '100%', marginTop: 20 }}>
        <Button 
          type="primary" 
          onClick={() => saveWorkoutPlan(workoutType)}
        >
          Lưu lịch tập này
        </Button>
      </Space>
    </div>
  );
};

export default WorkoutPlan;