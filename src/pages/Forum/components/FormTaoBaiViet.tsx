import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { history } from 'umi';
import { FormTaoBaiVietProps } from '@/services/Forum/typings';

const { TextArea } = Input;

const FormTaoBaiViet: React.FC<FormTaoBaiVietProps> = ({ onSubmit, dangTai }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: { tieuDe: string; noiDung: string }) => {
    try {
      const result = await onSubmit(values);
      
      if (result) {
        message.success('Đăng bài viết thành công!');
        form.resetFields();
        
        // Điều hướng về trang diễn đàn
        history.push('/user/forum');
      } else {
        message.error('Đăng bài viết không thành công, vui lòng thử lại');
      }
    } catch (error) {
      console.error('Lỗi khi xử lý đăng bài:', error);
      message.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  return (
    <Card title="Tạo bài viết mới" bordered={false}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="tieuDe"
          label="Tiêu đề"
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề bài viết' },
            { min: 10, message: 'Tiêu đề phải có ít nhất 10 ký tự' }
          ]}
        >
          <Input placeholder="Nhập tiêu đề bài viết" />
        </Form.Item>

        <Form.Item
          name="noiDung"
          label="Nội dung"
          rules={[
            { required: true, message: 'Vui lòng nhập nội dung bài viết' },
            { min: 20, message: 'Nội dung phải có ít nhất 20 ký tự' }
          ]}
        >
          <TextArea
            placeholder="Nhập nội dung bài viết"
            autoSize={{ minRows: 6, maxRows: 12 }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={dangTai}>
            Đăng bài
          </Button>
          <Button 
            style={{ marginLeft: 8 }} 
            onClick={() => history.push('/user/forum')}
          >
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormTaoBaiViet;