import React, { useState, useEffect, useCallback } from 'react';
import { List, Comment, Avatar, Form, Button, Input, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { getBinhLuansByBaiVietId as getBinhLuanList, createBinhLuan } from '@/services/Forum/index';
import type { BinhLuanProps, BinhLuan as IBinhLuan, IUser } from '@/services/Forum/typings';

const { TextArea } = Input;


const BinhLuan: React.FC<BinhLuanProps> = ({ baiVietId }) => {
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  
  // Lấy thông tin người dùng từ nhiều nguồn
  const getUser = (): IUser => {
    // Thử lấy từ initialState
    if (initialState?.currentUser) {
      const user = initialState.currentUser as any;
      if (user.id || user.userid) {
        console.log('Lấy user từ initialState:', user);
        return {
          ...user,
          id: user.id || user.userid // Đảm bảo luôn có trường id
        };
      }
    }
    
    // Nếu không có, thử lấy từ localStorage
    try {
      const storedUserData = localStorage.getItem('currentUser');
      if (storedUserData) {
        const storedUser = JSON.parse(storedUserData);
        if (storedUser?.userid || storedUser?.id) {
          console.log('Lấy user từ localStorage:', storedUser);
          return {
            ...storedUser,
            id: storedUser.id || storedUser.userid // Đảm bảo luôn có trường id
          };
        }
        return storedUser;
      }
    } catch (e) {
      console.error('Lỗi khi lấy user từ localStorage:', e);
    }
    
    // Nếu đang ở chế độ development, tạo user giả
    if (process.env.NODE_ENV === 'development') {
      const devUser = {
        id: 'dev-user',
        name: 'Người dùng Dev',
        email: 'dev@example.com'
      };
      console.log('Tạo user cho development:', devUser);
      return devUser;
    }
    
    console.log('Không tìm thấy thông tin người dùng');
    return {}; // Trả về đối tượng rỗng thay vì null
  };
  
  const currentUser = getUser();
  
  const [danhSachBinhLuan, setDanhSachBinhLuan] = useState<IBinhLuan[]>([]);
  const [dangTai, setDangTai] = useState(false);

  // Định nghĩa hàm lấy danh sách bình luận với useCallback
  const layDanhSachBinhLuan = useCallback(async () => {
    setDangTai(true);
    try {
      const data = await getBinhLuanList(baiVietId);
      setDanhSachBinhLuan(data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bình luận:', error);
      message.error('Không thể tải bình luận');
    } finally {
      setDangTai(false);
    }
  }, [baiVietId]);
  
  // Lấy danh sách bình luận khi component mount hoặc baiVietId thay đổi
  useEffect(() => {
    if (baiVietId) {
      layDanhSachBinhLuan();
    }
  }, [baiVietId, layDanhSachBinhLuan]);
  
  // Định nghĩa hàm thêm bình luận
  const themBinhLuan = async (values: { noiDung: string }) => {
    if (!values.noiDung.trim()) {
      message.error('Nội dung bình luận không được để trống');
      return;
    }
    
    // Kiểm tra đăng nhập
    if (!currentUser?.id) {
      console.error('Thông tin user hiện tại:', currentUser);
      
      // Kiểm tra lại từ localStorage một lần nữa
      const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!storedUser?.id) {
        message.error('Bạn cần đăng nhập để bình luận');
        return;
      }
      
      // Nếu có thông tin trong localStorage nhưng không có trong currentUser
      console.log('Tìm thấy user trong localStorage:', storedUser);
      
      // Sử dụng thông tin từ localStorage
      try {
        const binhLuanMoi = await createBinhLuan({
          baiVietId,
          noiDung: values.noiDung,
          nguoiBinhLuanId: storedUser.id,
          tenNguoiBinhLuan: storedUser.name || 'Người dùng ẩn danh',
          emailNguoiBinhLuan: storedUser.email || `user-${storedUser.id}@example.com`
        });
        
        // Cập nhật danh sách bình luận
        setDanhSachBinhLuan(prev => [binhLuanMoi, ...prev]);
        form.resetFields();
        message.success('Đăng bình luận thành công!');
      } catch (error) {
        console.error('Lỗi khi thêm bình luận:', error);
        message.error('Có lỗi xảy ra khi đăng bình luận');
      }
      return;
    }
    
    // Nếu có currentUser, sử dụng thông tin từ đó
    setDangTai(true);
    try {
      const binhLuanMoi = await createBinhLuan({
        baiVietId,
        noiDung: values.noiDung,
        nguoiBinhLuanId: currentUser.id,
        tenNguoiBinhLuan: currentUser.name || 'Người dùng ẩn danh',
        emailNguoiBinhLuan: currentUser.email || `user-${currentUser.id}@example.com`
      });
      
      // Cập nhật danh sách bình luận
      setDanhSachBinhLuan(prev => [binhLuanMoi, ...prev]);
      form.resetFields();
      message.success('Đăng bình luận thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm bình luận:', error);
      message.error('Có lỗi xảy ra khi đăng bình luận');
    } finally {
      setDangTai(false);
    }
  };
  
  // Kiểm tra người dùng hiện tại khi component mount
  useEffect(() => {
    console.log('Thông tin người dùng hiện tại:', currentUser);
    
    // Nếu không có thông tin người dùng trong cả initialState và localStorage
    // và không phải môi trường development, hiển thị thông báo
    if (!currentUser?.id && process.env.NODE_ENV !== 'development') {
      message.warning('Bạn cần đăng nhập để có thể bình luận', 3);
    }
  }, [currentUser]);
  
  return (
    <>
      <Form form={form} onFinish={themBinhLuan}>
        <Form.Item
          name="noiDung"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung bình luận' }]}
        >
          <TextArea 
            placeholder="Viết bình luận của bạn..." 
            autoSize={{ minRows: 3, maxRows: 6 }} 
            showCount 
            maxLength={1000}
          />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={dangTai}
            disabled={!currentUser?.id && process.env.NODE_ENV !== 'development'}
          >
            Đăng bình luận
          </Button>
        </Form.Item>
      </Form>
      
      <List
        loading={dangTai}
        dataSource={danhSachBinhLuan}
        header={`${danhSachBinhLuan.length} bình luận`}
        itemLayout="horizontal"
        renderItem={(item: IBinhLuan) => (
          <Comment
            author={<strong>{item.tenNguoiBinhLuan || 'Người dùng ẩn danh'}</strong>}
            avatar={<Avatar icon={<UserOutlined />}>{(item.tenNguoiBinhLuan || 'U')[0]}</Avatar>}
            content={<p>{item.noiDung}</p>}
            datetime={
              <span>
                {item.thoiGianBinhLuan ? new Date(item.thoiGianBinhLuan).toLocaleString() : 'Vừa xong'}
              </span>
            }
          />
        )}
        locale={{ emptyText: 'Chưa có bình luận nào' }}
      />
    </>
  );
};

export default BinhLuan;