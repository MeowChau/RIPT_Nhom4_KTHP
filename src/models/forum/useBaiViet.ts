import { useState, useCallback, useRef, useEffect } from 'react';
import { getBaiVietList, getBaiVietById, createBaiViet, likeBaiViet } from '@/services/Forum/index';
import type { BaiViet, CurrentUser } from '@/services/Forum/typings';
import { useModel } from 'umi';
import { message } from 'antd';

export default function useBaiViet(): {
  danhSachBaiViet: BaiViet[];
  baiVietHienTai: BaiViet | null;
  dangTai: boolean;
  tuKhoaTimKiem: string;
  layDanhSachBaiViet: (tuKhoa?: string, refresh?: boolean) => Promise<void>;
  layBaiVietTheoId: (id: string) => Promise<void>;
  taoBaiVietMoi: (data: { tieuDe: string; noiDung: string }) => Promise<boolean>;
  thichBaiViet: (baiVietId: string) => Promise<boolean>;
} {
  const { initialState } = useModel('@@initialState');
  
  // Đảm bảo luôn có thông tin người dùng hợp lệ từ localStorage nếu initialState không có
  const storedUserData = localStorage.getItem('currentUser');
  let storedUser = {} as CurrentUser;
  
  if (storedUserData) {
    try {
      storedUser = JSON.parse(storedUserData);
    } catch (e) {
      console.error('Lỗi khi parse thông tin người dùng từ localStorage:', e);
    }
  }
  
  // Sử dụng thông tin người dùng từ initialState hoặc localStorage
  const currentUser = (initialState?.currentUser || storedUser) as CurrentUser;
  
  // Log thông tin người dùng để debug
  useEffect(() => {
    console.log('Current user in useBaiViet:', currentUser);
  }, [currentUser]);

  const [danhSachBaiViet, setDanhSachBaiViet] = useState<BaiViet[]>([]);
  const [baiVietHienTai, setBaiVietHienTai] = useState<BaiViet | null>(null);
  const [dangTai, setDangTai] = useState(false);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
  
  // Sử dụng ref để tránh vòng lặp vô hạn
  const dangTaiRef = useRef(false);

// Lấy danh sách bài viết
const layDanhSachBaiViet = useCallback(async (tuKhoa?: string, refresh?: boolean) => {
  if (dangTaiRef.current && !refresh) return;
  
  setDangTai(true);
  dangTaiRef.current = true;
  
  if (tuKhoa !== undefined) {
    setTuKhoaTimKiem(tuKhoa);
  }
  
  try {
    // Sử dụng API thực tế thay vì giả lập
    const danhSach = await getBaiVietList(tuKhoa);
    
    // Đánh dấu bài viết đã thích bởi người dùng hiện tại
    const likes = JSON.parse(localStorage.getItem('likes') || '{}');
    const userId = currentUser?.id || '';
    
    const baiVietsDaMark = danhSach.map(baiViet => ({
      ...baiViet,
      daNhanThich: !!likes[`post_${baiViet.id}_${userId}`]
    }));
    
    setDanhSachBaiViet(baiVietsDaMark);
  } catch (error) {
    console.error('Lỗi khi tải danh sách bài viết:', error);
    message.error('Không thể tải danh sách bài viết. Vui lòng thử lại.');
  } finally {
    setDangTai(false);
    dangTaiRef.current = false;
  }
}, [currentUser?.id]); // Chỉ sử dụng currentUser?.id để tránh re-render không cần thiết

  // Lấy bài viết theo ID
  const layBaiVietTheoId = useCallback(async (id: string) => {
    setDangTai(true);
    try {
      const baiViet = await getBaiVietById(id);
      setBaiVietHienTai(baiViet || null);
    } catch (error) {
      console.error('Lỗi khi lấy bài viết:', error);
      message.error('Không thể tải thông tin bài viết. Vui lòng thử lại.');
    } finally {
      setDangTai(false);
    }
  }, []);

  // Tạo bài viết mới
  const taoBaiVietMoi = useCallback(async (data: { tieuDe: string; noiDung: string }) => {
    try {
      let userId = currentUser?.id;
      let userName = currentUser?.name;
      let userEmail = currentUser?.email;
      
      // Lấy thông tin từ localStorage nếu không có trong currentUser
      if (!userId) {
        const storedData = localStorage.getItem('currentUser');
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            userId = parsedData.id;
            userName = parsedData.name;
            userEmail = parsedData.email;
          } catch (e) {
            console.error('Lỗi khi parse currentUser từ localStorage:', e);
          }
        }
      }
      
      if (!userId) {
        message.error('Vui lòng đăng nhập để tạo bài viết.');
        return false;
      }
      
      await createBaiViet({
        ...data,
        nguoiDangId: userId,
        tenNguoiDang: userName || 'Người dùng ẩn danh',
        emailNguoiDang: userEmail || `user-${userId}@example.com`,
      });
      
      message.success('Tạo bài viết thành công!');
      return true;
    } catch (error) {
      console.error('Lỗi khi tạo bài viết mới:', error);
      message.error('Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại.');
      return false;
    }
  }, [currentUser]);

  const thichBaiViet = useCallback(async (baiVietId: string) => {
    try {
      // Lấy thông tin mới nhất từ localStorage để đảm bảo có thông tin đăng nhập
      let userId = currentUser?.id;
      let userName = currentUser?.name;
      let userEmail = currentUser?.email;
      
      // Nếu không có trong currentUser, thử lấy từ localStorage
      if (!userId) {
        const storedData = localStorage.getItem('currentUser');
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            userId = parsedData.id;
            userName = parsedData.name;
            userEmail = parsedData.email;
          } catch (e) {
            console.error('Lỗi khi parse currentUser từ localStorage:', e);
          }
        }
      }
      
      // Nếu vẫn không có userId, tạo giả lập cho development
      if (!userId && process.env.NODE_ENV === 'development') {
        userId = 'dev-user-id';
        userName = userName || 'Dev User';
        userEmail = userEmail || 'dev@example.com';
        
        // Lưu vào localStorage để dùng lần sau
        const tempUser = { id: userId, name: userName, email: userEmail };
        localStorage.setItem('currentUser', JSON.stringify(tempUser));
        console.warn('Đã tạo người dùng tạm thời cho development:', tempUser);
      }
      
      // Kiểm tra lần cuối
      if (!userId) {
        message.error('Vui lòng đăng nhập để thích bài viết.');
        console.error('Không tìm thấy ID người dùng trong cả currentUser và localStorage');
        return false;
      }

      // Đảm bảo có name và email
      userName = userName || `Người dùng ${userId.slice(0, 5)}`;
      userEmail = userEmail || `user-${userId}@example.com`;
      
      // Log để debug
      console.log('Thông tin khi thích bài viết:', {
        baiVietId,
        userId,
        userName,
        userEmail
      });
      
      // Gọi API thích bài viết
      const { daThich, soLuotThich } = await likeBaiViet(
        baiVietId,
        userId,
        userName,
        userEmail
      );
      
      // Cập nhật danh sách bài viết
      setDanhSachBaiViet(prevList => 
        prevList.map(baiViet => 
          baiViet.id === baiVietId 
            ? { ...baiViet, daNhanThich: daThich, soLuotThich } 
            : baiViet
        )
      );
      
      // Cập nhật bài viết hiện tại nếu đang xem
      if (baiVietHienTai && baiVietHienTai.id === baiVietId) {
        setBaiVietHienTai({ 
          ...baiVietHienTai, 
          daNhanThich: daThich, 
          soLuotThich 
        });
      }
      
      // Lưu trạng thái thích vào localStorage
      try {
        const likes = JSON.parse(localStorage.getItem('likes') || '{}');
        const likeKey = `post_${baiVietId}_${userId}`;
        
        if (daThich) {
          likes[likeKey] = true;
        } else {
          delete likes[likeKey];
        }
        
        localStorage.setItem('likes', JSON.stringify(likes));
      } catch (e) {
        console.error('Lỗi khi cập nhật localStorage likes:', e);
      }
      
      // Thông báo kết quả
      const actionText = daThich ? 'Đã thích' : 'Đã bỏ thích';
      message.success(`${actionText} bài viết thành công!`);
      
      return true;
    } catch (error) {
      console.error('Lỗi khi thích/bỏ thích bài viết:', error);
      message.error('Có lỗi xảy ra khi tương tác với bài viết. Vui lòng thử lại.');
      return false;
    }
  }, []); // Loại bỏ dependencies để tránh sử dụng giá trị cũ của currentUser
  
  return {
    danhSachBaiViet,
    baiVietHienTai,
    dangTai,
    tuKhoaTimKiem,
    layDanhSachBaiViet,
    layBaiVietTheoId,
    taoBaiVietMoi,
    thichBaiViet
  };
}