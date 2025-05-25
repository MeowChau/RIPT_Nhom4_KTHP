import { useState, useCallback } from 'react';
import { getBinhLuansByBaiVietId, createBinhLuan, likeBinhLuan } from '@/services/Forum/index';
import type { BinhLuan } from '@/services/Forum/typings';
import { useModel } from 'umi';

export default function useBinhLuan(): {
  danhSachBinhLuan: BinhLuan[];
  dangTai: boolean;
  layDanhSachBinhLuan: (baiVietId: string) => Promise<void>;
  themBinhLuan: (data: { baiVietId: string; noiDung: string }) => Promise<boolean>;
  thichBinhLuan: (binhLuanId: string) => Promise<boolean>;
} {
  const { initialState } = useModel('@@initialState');
  const currentUser = (initialState?.currentUser as unknown as { id: string; name: string; email: string }) || { id: '', name: '', email: '' };

  const [danhSachBinhLuan, setDanhSachBinhLuan] = useState<BinhLuan[]>([]);
  const [dangTai, setDangTai] = useState(false);

  const layDanhSachBinhLuan = useCallback(async (baiVietId: string) => {
    setDangTai(true);
    try {
      const data = await getBinhLuansByBaiVietId(baiVietId);
      
      // Đánh dấu bình luận đã thích bởi người dùng hiện tại
      const likes = JSON.parse(localStorage.getItem('likes') || '{}');
      const binhLuanDaMark = data.map(binhLuan => ({
        ...binhLuan,
        daNhanThich: !!likes[`comment_${binhLuan.id}_${currentUser.id}`]
      }));
      
      setDanhSachBinhLuan(binhLuanDaMark);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bình luận:', error);
    } finally {
      setDangTai(false);
    }
  }, [currentUser.id]);

  const themBinhLuan = useCallback(async (data: { baiVietId: string; noiDung: string }) => {
    setDangTai(true);
    try {
      const binhLuanMoi = await createBinhLuan({
        ...data,
        nguoiBinhLuanId: currentUser.id,
        tenNguoiBinhLuan: currentUser.name,
        emailNguoiBinhLuan: currentUser.email
      });
      
      setDanhSachBinhLuan(prev => [
        { ...binhLuanMoi, daNhanThich: false }, 
        ...prev
      ]);
      
      return true;
    } catch (error) {
      console.error('Lỗi khi thêm bình luận:', error);
      return false;
    } finally {
      setDangTai(false);
    }
  }, [currentUser]);

  const thichBinhLuan = useCallback(async (binhLuanId: string) => {
    try {
      const { daThich, soLuotThich } = await likeBinhLuan(
        binhLuanId,
        currentUser.id,
        currentUser.name,
        currentUser.email
      );
      
      setDanhSachBinhLuan(prevList => 
        prevList.map(binhLuan => 
          binhLuan.id === binhLuanId 
            ? { ...binhLuan, daNhanThich: daThich, soLuotThich } 
            : binhLuan
        )
      );
      
      return true;
    } catch (error) {
      console.error('Lỗi khi thích/bỏ thích bình luận:', error);
      return false;
    }
  }, [currentUser]);

  return {
    danhSachBinhLuan,
    dangTai,
    layDanhSachBinhLuan,
    themBinhLuan,
    thichBinhLuan
  };
}