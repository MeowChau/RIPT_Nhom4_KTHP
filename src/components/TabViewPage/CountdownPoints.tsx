import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Typography } from 'antd';
import axios from 'axios';

const { Text } = Typography;

const COUNTDOWN_SECONDS = 60;

const CountdownPoints: React.FC = () => {
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const fetchPoints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/forum/posts/points', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      setPoints(res.data.points);
    } catch {
      setPoints(0);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  useEffect(() => {
    if (seconds === 0) {
      fetchPoints();
      setSeconds(COUNTDOWN_SECONDS);
    }
    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds, fetchPoints]);

  return (
    <Card style={{ maxWidth: 400, margin: '24px auto', textAlign: 'center' }}>
      <Text strong>Điểm năng nổ hiện tại: </Text>
      <Text type="success" style={{ fontSize: 20 }}>{points}</Text>
      <div style={{ margin: '16px 0' }}>
        <Text>Bộ đếm tự động: </Text>
        <Text code>{seconds}s</Text>
      </div>
      <Button onClick={fetchPoints} loading={loading} type="primary">Lấy lại điểm thủ công</Button>
    </Card>
  );
};

export default CountdownPoints; 