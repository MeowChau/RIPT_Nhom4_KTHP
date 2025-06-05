import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Button, Card, Select, 
  InputNumber, message, Upload, Space 
} from 'antd';
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { history, useLocation } from 'umi';
import { getExercise, addExercise, updateExercise } from '@/services/exercise';

const { Option } = Select;
const { TextArea } = Input;

const ExerciseForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get('id');

  useEffect(() => {
    const fetchExercise = async () => {
      if (id) {
        setIsEditing(true);
        setLoading(true);
        try {
          const response = await getExercise(id);
          if (response.success) {
            const { name, type, image, videoUrl, description, frequency } = response.data;
            form.setFieldsValue({
              name,
              type,
              videoUrl,
              description,
              'frequency.sets': frequency.sets,
              'frequency.reps': frequency.reps,
              'frequency.rest': frequency.rest,
            });
            setImageUrl(image || '');
          }
        } catch (error) {
          message.error('Không thể tải thông tin bài tập');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchExercise();
  }, [id, form]);

  // Hàm chuyển đổi file thành base64
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Xử lý tải ảnh lên
  const handleImageBeforeUpload = async (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Chỉ chấp nhận file JPG/PNG!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Kích thước hình ảnh phải nhỏ hơn 2MB!');
      return false;
    }

    try {
      const base64 = await getBase64(file);
      setImageUrl(base64);
    } catch (error) {
      message.error('Lỗi chuyển đổi file.');
    }
    return false; // Không tải lên tự động
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        image: imageUrl,
        frequency: {
          sets: values['frequency.sets'],
          reps: values['frequency.reps'],
          rest: values['frequency.rest'],
        }
      };

      // Xóa các trường không cần thiết
      delete data['frequency.sets'];
      delete data['frequency.reps'];
      delete data['frequency.rest'];

      if (isEditing) {
        await updateExercise(id || '', data);
        message.success('Cập nhật bài tập thành công');
      } else {
        await addExercise(data);
        message.success('Thêm bài tập mới thành công');
      }
      history.push('/exercises');
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title={isEditing ? 'Chỉnh sửa bài tập' : 'Thêm bài tập mới'}
      onBack={() => history.push('/exercises')}
      backIcon={<ArrowLeftOutlined />}
    >
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            'frequency.sets': 3,
            'frequency.reps': 10,
            'frequency.rest': 60,
          }}
        >
          <Form.Item
            label="Tên bài tập"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên bài tập' }]}
          >
            <Input placeholder="Nhập tên bài tập" />
          </Form.Item>

          <Form.Item
            label="Loại bài tập"
            name="type"
            rules={[{ required: true, message: 'Vui lòng chọn loại bài tập' }]}
          >
            <Select placeholder="Chọn loại bài tập">
              <Option value="Kháng lực">Kháng lực</Option>
              <Option value="Cardio">Cardio</Option>
              <Option value="BodyCombat">BodyCombat</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Hình ảnh">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={handleImageBeforeUpload}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                )}
              </Upload>
              {imageUrl && <Button onClick={() => setImageUrl('')}>Xóa hình</Button>}
            </Space>
          </Form.Item>

          <Form.Item
            label="URL Video"
            name="videoUrl"
            rules={[{ required: true, message: 'Vui lòng nhập URL video' }]}
          >
            <Input placeholder="Nhập đường dẫn video YouTube hoặc URL khác" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả bài tập' }]}
          >
            <TextArea rows={4} placeholder="Mô tả chi tiết về bài tập" />
          </Form.Item>

          <Form.Item label="Tần suất">
            <Input.Group compact>
              <Form.Item
                name="frequency.sets"
                noStyle
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <InputNumber min={0} placeholder="Hiệp" style={{ width: '30%' }} />
              </Form.Item>
              <span style={{ padding: '0 8px' }}>hiệp x</span>
              <Form.Item
                name="frequency.reps"
                noStyle
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <InputNumber min={0} placeholder="Lần" style={{ width: '30%' }} />
              </Form.Item>
              <span style={{ padding: '0 8px' }}>lần</span>
            </Input.Group>
          </Form.Item>

          <Form.Item
            label="Thời gian nghỉ (giây)"
            name="frequency.rest"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian nghỉ' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
              {isEditing ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default ExerciseForm;