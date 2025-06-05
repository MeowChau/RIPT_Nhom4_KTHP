import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Descriptions, Button, Spin, Tag } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { history, useLocation } from 'umi';
import { getExercise } from '@/services/exercise';

const ExerciseDetail: React.FC = () => {
  const [exercise, setExercise] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get('id');

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await getExercise(id);
          if (response.success) {
            setExercise(response.data);
          }
        } catch (error) {
          console.error('Error fetching exercise details:', error);
        } finally {
          setLoading(false);
        }
      } else {
        history.push('/exercises');
      }
    };

    fetchData();
  }, [id]);

  // Hàm embed YouTube video từ URL
  const getEmbedUrl = (url: string) => {
    // Kiểm tra nếu là URL YouTube
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url ? url.match(ytRegex) : null;
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return url || ''; // Trả về URL gốc nếu không phải YouTube
  };

  return (
    <PageContainer
      title="Chi tiết bài tập"
      onBack={() => history.push('/exercises')}
      backIcon={<ArrowLeftOutlined />}
      extra={[
        <Button
          key="edit"
          type="primary"
          icon={<EditOutlined />}
          onClick={() => history.push(`/exercises/edit?id=${id}`)}
        >
          Chỉnh sửa
        </Button>
      ]}
    >
      {loading ? (
        <Card>
          <Spin />
        </Card>
      ) : (
        <>
          <Card title="Thông tin cơ bản" style={{ marginBottom: 24 }}>
            <Descriptions column={2}>
              <Descriptions.Item label="Tên bài tập">{exercise.name}</Descriptions.Item>
              <Descriptions.Item label="Loại bài tập">
                <Tag color={exercise.type === 'Cardio' ? 'green' : exercise.type === 'BodyCombat' ? 'orange' : 'blue'}>
                  {exercise.type}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Số hiệp">{exercise.frequency?.sets || 0}</Descriptions.Item>
              <Descriptions.Item label="Số lần">{exercise.frequency?.reps || 0}</Descriptions.Item>
              <Descriptions.Item label="Thời gian nghỉ">{exercise.frequency?.rest || 0} giây</Descriptions.Item>
            </Descriptions>
          </Card>

          {exercise.image && (
            <Card title="Hình ảnh" style={{ marginBottom: 24 }}>
              <img src={exercise.image} alt={exercise.name} style={{ maxWidth: '100%', maxHeight: 400 }} />
            </Card>
          )}

          <Card title="Video hướng dẫn" style={{ marginBottom: 24 }}>
            <iframe
              width="100%"
              height="480"
              src={getEmbedUrl(exercise.videoUrl)}
              title={exercise.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Card>

          <Card title="Mô tả bài tập">
            <div dangerouslySetInnerHTML={{ 
              __html: exercise.description ? exercise.description.replace(/\n/g, '<br />') : ''
            }} />
          </Card>
        </>
      )}
    </PageContainer>
  );
};

export default ExerciseDetail;