import React, { useEffect, useState } from 'react';
import { Select, Form } from 'antd';
import { request } from 'umi';
import './PTGymFilter.less';

interface Gym {
  _id: string;
  name: string;
}

interface PTGymFilterProps {
  value?: string;
  onChange?: (value: string) => void;
}

const PTGymFilter: React.FC<PTGymFilterProps> = ({ value, onChange }) => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchGyms = async () => {
    setLoading(true);
    try {
      const response = await request<Gym[]>('/api/gyms');
      setGyms(response || []);
    } catch (error) {
      console.error('Không thể tải danh sách cơ sở:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGyms();
  }, []);

  return (
    <Form.Item label="Lọc theo cơ sở" style={{ marginBottom: 16, minWidth: 200 }}>
      <Select
        value={value}
        onChange={onChange}
        placeholder="Chọn cơ sở"
        allowClear
        loading={loading}
        style={{ width: '100%' }}
      >
        {gyms.map(gym => (
          <Select.Option key={gym._id} value={gym._id}>{gym.name}</Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default PTGymFilter;