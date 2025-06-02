import React from 'react';
import { Form, Input, Button, Alert, Select, Typography, DatePicker } from 'antd';
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { history } from 'umi';
import moment from 'moment';
import styles from './RegisterForm.less';

const { Option } = Select;
const { Text, Link: AntLink } = Typography;

// Định nghĩa interface
interface Gym {
  _id?: string;
  id?: string;
  name: string;
  address?: string;
}

interface RegisterFormProps {
  onSubmit: (values: any) => void;
  isLoading: boolean;
  error?: string | null;
  gymList: Gym[];
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSubmit, 
  isLoading, 
  error,
  gymList = [] 
}) => {
  const [form] = Form.useForm();

  // Hàm lấy ID phòng tập
  const getGymId = (gym: Gym): string => {
    return gym._id || gym.id || '';
  };

  // Xử lý khi form submit
  const onFinish = async (values: any) => {
    // Chuyển đổi moment object thành string date
    if (values.startDate && moment.isMoment(values.startDate)) {
      values.startDate = values.startDate.format('YYYY-MM-DD');
    }
    
    // Gọi hàm onSubmit từ props
    onSubmit(values);
  };

  // Chỉ giữ lại validator cơ bản
  const validateEmail = (_: any, value: string) => {
    // Kiểm tra định dạng email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!value) {
      return Promise.reject(new Error('Vui lòng nhập email!'));
    }
    
    if (!emailRegex.test(value)) {
      return Promise.reject(new Error('Email không đúng định dạng!'));
    }

    return Promise.resolve();
  };

  const validatePhone = (_: any, value: string) => {
    // Kiểm tra định dạng số điện thoại Việt Nam
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    
    if (!value) {
      return Promise.reject(new Error('Vui lòng nhập số điện thoại!'));
    }
    
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error('Số điện thoại không đúng định dạng! (VD: 0912345678)'));
    }

    return Promise.resolve();
  };

  return (
    <div className={styles.formContainer}>
      {/* Hiển thị lỗi từ API (nếu có) */}
      {error && (
        <Alert
          message="Lỗi đăng ký"
          description={error}
          type="error"
          showIcon
          className={styles.errorAlert}
        />
      )}

      <Form
        form={form}
        name="register"
        layout="vertical"
        onFinish={onFinish}
        scrollToFirstError
        requiredMark={false}
        initialValues={{
          membershipPackage: '1 tháng',
          startDate: moment()
        }}
      >
        <Form.Item
          name="name"
          label="Họ tên"
          rules={[
            { required: true, message: 'Vui lòng nhập họ tên!' },
            { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
          ]}
        >
          <Input 
            prefix={<UserOutlined className={styles.inputIcon} />} 
            placeholder="Nhập họ tên của bạn" 
            size="large" 
          />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { validator: validateEmail }
          ]}
        >
          <Input 
            prefix={<MailOutlined className={styles.inputIcon} />} 
            placeholder="Nhập email của bạn" 
            size="large"
          />
        </Form.Item>
        
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { validator: validatePhone }
          ]}
        >
          <Input 
            prefix={<PhoneOutlined className={styles.inputIcon} />} 
            placeholder="Nhập số điện thoại của bạn" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="gymId"
          label="Phòng tập"
          rules={gymList.length > 0 ? [
            { required: true, message: 'Vui lòng chọn phòng tập!' }
          ] : undefined}
        >
          {gymList.length > 0 ? (
            <Select
              placeholder="Chọn phòng tập bạn muốn tham gia"
              size="large"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
              }
            >
              {gymList.map(gym => (
                <Option key={getGymId(gym)} value={getGymId(gym)}>
                  {gym.name} {gym.address ? `- ${gym.address}` : ''}
                </Option>
              ))}
            </Select>
          ) : (
            <Input 
              placeholder="Không có phòng tập nào" 
              disabled
              size="large" 
            />
          )}
        </Form.Item>

        <Form.Item
          name="membershipPackage"
          label="Gói tập"
          rules={[{ required: true, message: 'Vui lòng chọn gói tập!' }]}
        >
          <Select size="large">
            <Option value="1 tháng">1 tháng</Option>
            <Option value="3 tháng">3 tháng</Option>
            <Option value="6 tháng">6 tháng</Option>
            <Option value="12 tháng">12 tháng</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Ngày bắt đầu"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
        >
          <DatePicker 
            className={styles.datePicker}
            format="DD/MM/YYYY"
            size="large"
            placeholder="Chọn ngày bắt đầu"
          />
        </Form.Item>

        <div className={styles.registerNote}>
          <Text type="secondary">
            Lưu ý: Số điện thoại sẽ được sử dụng làm mật khẩu ban đầu của bạn.
          </Text>
        </div>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            className={styles.registerButton} 
            loading={isLoading}
            block
            size="large"
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
      
      <div className={styles.loginLink}>
        <Text>
          Đã có tài khoản? <AntLink onClick={() => history.push('/user/login')}>Đăng nhập ngay</AntLink>
        </Text>
      </div>
    </div>
  );
};

export default RegisterForm;