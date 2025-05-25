import React, { useState } from 'react';
import { 
  Typography, Table, 
  Divider, Collapse, Radio
} from 'antd';
import { 
  AppleOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { Panel } = Collapse;

interface DietPlanProps {
  calories: number;
  macros: {
    carbs: number;
    protein: number;
    fat: number;
    carbsGrams: number;
    proteinGrams: number;
    fatGrams: number;
  };
  macroDistribution: string;
}

const DietPlan: React.FC<DietPlanProps> = ({ calories, macros, macroDistribution }) => {
  const [mealFrequency, setMealFrequency] = useState<string>('three');

  // Danh sách thực phẩm theo macro
  const foodLists = {
    protein: [
      { name: 'Ức gà', serving: '100g', protein: 31, carbs: 0, fat: 3.6 },
      { name: 'Thịt bò nạc', serving: '100g', protein: 26, carbs: 0, fat: 15 },
      // ...
    ],
    carbs: [
      { name: 'Gạo lứt', serving: '100g (nấu chín)', protein: 2.6, carbs: 25, fat: 0.8 },
      { name: 'Khoai lang', serving: '100g', protein: 1.6, carbs: 20, fat: 0.1 },
      // ...
    ],
    fat: [
      { name: 'Bơ', serving: '1/2 quả', protein: 2, carbs: 9, fat: 15 },
      { name: 'Dầu oliu', serving: '1 muỗng canh', protein: 0, carbs: 0, fat: 14 },
      // ...
    ]
  };

  // Logic hiển thị thực đơn mẫu dựa trên phân phối macros
  // ...

  return (
    <div>
      {/* Phần hiển thị thông tin chế độ ăn uống */}
      <Title level={4}>Chế độ ăn uống ({calories} calo/ngày)</Title>
      
      <Radio.Group 
        value={mealFrequency}
        onChange={(e) => setMealFrequency(e.target.value)}
        style={{ marginBottom: 16 }}
      >
        <Radio.Button value="three">3 bữa/ngày</Radio.Button>
        <Radio.Button value="five">5 bữa/ngày</Radio.Button>
        <Radio.Button value="intermittent">Nhịn ăn gián đoạn</Radio.Button>
      </Radio.Group>
      
      {/* Bảng thực đơn mẫu */}
      {/* ... */}
      
      <Divider orientation="left">Thực phẩm được khuyến nghị</Divider>
      
      <Collapse defaultActiveKey={['1']}>
        <Panel 
          header={<><AppleOutlined /> Nguồn Protein chất lượng cao</>} 
          key="1"
        >
          <Table 
            dataSource={foodLists.protein}
            columns={[
              { title: 'Thực phẩm', dataIndex: 'name', key: 'name' },
              { title: 'Khẩu phần', dataIndex: 'serving', key: 'serving' },
              { title: 'Protein (g)', dataIndex: 'protein', key: 'protein' },
              { title: 'Carbs (g)', dataIndex: 'carbs', key: 'carbs' },
              { title: 'Chất béo (g)', dataIndex: 'fat', key: 'fat' }
            ]}
            pagination={false}
            size="small"
          />
        </Panel>
        {/* Tương tự cho Carbs và Fat */}
      </Collapse>
    </div>
  );
};

export default DietPlan;