import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Spin, message, Card, Select, Upload, Row, Col } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import { createPT, updatePT, getPTById } from '@/services/personalTrainer';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import ScheduleEditor from './components/ScheduleEditor';

const { TextArea } = Input;
const { Option } = Select;

// Hàm convert ảnh sang Base64
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const PTForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [gyms, setGyms] = useState<any[]>([]);
  const [ptId, setPtId] = useState<string | null>(null);

  // Lấy thông tin PT khi chỉnh sửa
  const fetchPTDetails = async (id: string) => {
    setLoading(true);
    try {
      const pt = await getPTById(id);
      form.setFieldsValue({
        name: pt.name,
        gymId: pt.gymId?._id || pt.gymId,
        description: pt.description,
        schedule: pt.schedule || [],
      });
      
      if (pt.image) {
        setImageUrl(pt.image);
      }
    } catch (error) {
      console.error('Không thể tải thông tin PT:', error);
      message.error('Không thể tải thông tin huấn luyện viên');
    } finally {
      setLoading(false);
    }
  };

  // Lấy ID từ query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setPtId(id);
      fetchPTDetails(id);
    }
  }, []);

  // Fetch gyms từ API thật
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const res = await fetch('/api/gyms');
        if (!res.ok) throw new Error('Failed to fetch gyms');
        const data = await res.json();
        setGyms(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Không thể tải danh sách phòng tập:', error);
        message.error('Không thể tải danh sách phòng tập');
      }
    };
    
    fetchGyms();
  }, []);

  // Kiểm tra file trước khi upload
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Hình ảnh phải nhỏ hơn 2MB!');
    }
    
    return isJpgOrPng && isLt2M;
  };

  // Xử lý khi chọn ảnh
  const handleChange = async (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    
    if (info.file.originFileObj) {
      try {
        const base64 = await getBase64(info.file.originFileObj);
        setImageUrl(base64);
      } catch (error) {
        console.error('Lỗi chuyển đổi ảnh:', error);
        message.error('Có lỗi khi xử lý ảnh');
      } finally {
        setUploadLoading(false);
      }
    }
  };

  // Dummy Upload handler - không gửi file lên server
  const customRequest = ({ onSuccess }: any) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  // Xử lý khi submit form
  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      // Chuẩn bị dữ liệu với URL ảnh Base64
      const data = {
        ...values,
        image: imageUrl, // Base64 string
      };

      if (ptId) {
        await updatePT(ptId, data);
        message.success('Cập nhật huấn luyện viên thành công');
      } else {
        await createPT(data);
        message.success('Thêm huấn luyện viên thành công');
      }
      history.push('/personalTrainers');
    } catch (error) {
      console.error('Lỗi khi lưu thông tin PT:', error);
      message.error('Có lỗi xảy ra khi lưu thông tin');
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải ảnh</div>
    </div>
  );

  return (
    <PageContainer title={ptId ? 'Chỉnh sửa huấn luyện viên' : 'Thêm huấn luyện viên mới'}>
      <Card>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              schedule: [],
            }}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Tên huấn luyện viên"
                  rules={[{ required: true, message: 'Vui lòng nhập tên PT' }]}
                >
                  <Input placeholder="Nhập tên huấn luyện viên" />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="gymId"
                  label="Cơ sở phòng tập"
                  rules={[{ required: true, message: 'Vui lòng chọn cơ sở phòng tập' }]}
                >
                  <Select placeholder="Chọn cơ sở phòng tập">
                    {gyms.map(gym => (
                      <Option key={gym._id} value={gym._id}>{gym.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
            >
              <TextArea rows={4} placeholder="Nhập mô tả về huấn luyện viên" />
            </Form.Item>
            
            <Form.Item
              label="Hình ảnh"
              extra="Tải lên ảnh đại diện cho huấn luyện viên (JPG/PNG, tối đa 2MB)"
            >
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                customRequest={customRequest}  // Không gửi lên server
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
            
            <Form.Item
              name="schedule"
              label="Lịch làm việc"
            >
              <ScheduleEditor />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {ptId ? 'Cập nhật' : 'Tạo mới'}
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => history.push('/personalTrainers')}>
                Hủy
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </PageContainer>
  );
};

export default PTForm;