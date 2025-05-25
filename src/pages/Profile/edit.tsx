import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Select, DatePicker, Spin, Alert } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import moment from 'moment';
import useProfile from '@/models/profile';
import { getGyms } from '@/services/Member/index';

const { Option } = Select;

const EditProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const { memberData, loading, error, submitting, updateMemberData } = useProfile();
  const [gyms, setGyms] = useState<MemberAPI.GymData[]>([]);
  const [loadingGyms, setLoadingGyms] = useState<boolean>(false);
  
  // Lấy danh sách gym
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoadingGyms(true);
        const gymsData = await getGyms();
        setGyms(gymsData);
      } catch (gymError) {
        console.error('Lỗi khi lấy danh sách gym:', gymError);
      } finally {
        setLoadingGyms(false);
      }
    };
    
    fetchGyms();
  }, []);
  
  // Set form values khi member data thay đổi
  useEffect(() => {
    if (memberData) {
      form.setFieldsValue({
        name: memberData.name,
        email: memberData.email,
        phone: memberData.phone,
        gymId: memberData.gymId,
        membershipPackage: memberData.membershipPackage,
        startDate: memberData.startDate ? moment(memberData.startDate) : null,
      });
    }
  }, [memberData, form]);
  
  // Xử lý submit form
  const handleSubmit = async (values: any) => {
    const result = await updateMemberData(values);
    if (result) {
      history.push('/user/profile');
    }
  };
  
  return (
    <PageContainer title="Chỉnh sửa thông tin cá nhân">
      <Spin spinning={loading || loadingGyms}>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { min: 10, message: 'Số điện thoại phải có ít nhất 10 số' }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Cơ sở Gym"
              name="gymId"
            >
              <Select placeholder="Chọn cơ sở Gym" loading={loadingGyms}>
                {gyms.map(gym => (
                  <Option key={gym._id} value={gym._id}>{gym.name} - {gym.address}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Gói tập"
              name="membershipPackage"
            >
              <Select>
                <Option value="1 tháng">1 tháng</Option>
                <Option value="3 tháng">3 tháng</Option>
                <Option value="6 tháng">6 tháng</Option>
                <Option value="12 tháng">12 tháng</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Ngày bắt đầu"
              name="startDate"
              extra="Lưu ý: Thay đổi ngày bắt đầu và gói tập sẽ tính lại ngày kết thúc"
            >
              <DatePicker format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu mới (để trống nếu không đổi)"
              name="password"
              rules={[
                { min: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên' }
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Cập nhật thông tin
              </Button>
              <Button 
                style={{ marginLeft: 8 }} 
                onClick={() => history.push('/user/profile')}
              >
                Hủy
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </PageContainer>
  );
};

export default EditProfilePage;