import { useState, useCallback, useEffect } from 'react';
import { getThongBaoList, markThongBaoAsRead, getSoThongBaoChuaDoc } from '@/services/Forum/index';
import type { ThongBao } from '@/services/Forum/typings';
import { useModel } from 'umi';

export default function useThongBao() {
  const { initialState } = useModel('@@initialState');
  type CurrentUser = { id?: string } & Record<string, any>;
  const currentUser: CurrentUser = initialState?.currentUser || {};

  const [danhSachThongBao, setDanhSachThongBao] = useState<ThongBao[]>([]);
  const [soThongBaoChuaDoc, setSoThongBaoChuaDoc] = useState(0);
  const [dangTai, setDangTai] = useState(false);

  const layDanhSachThongBao = useCallback(async () => {
    if (!currentUser.id) return;
    
    setDangTai(true);
    try {
      const data = await getThongBaoList(currentUser.id);
      setDanhSachThongBao(data);
      const chuaDoc = data.filter(tb => !tb.daDoc).length;
      setSoThongBaoChuaDoc(chuaDoc);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thông báo:', error);
    } finally {
      setDangTai(false);
    }
  }, [currentUser.id]);

  const danhDauDaDoc = useCallback(async (thongBaoId: string) => {
    try {
      const result = await markThongBaoAsRead(thongBaoId);
      if (result) {
        setDanhSachThongBao(prevList => 
          prevList.map(thongBao => 
            thongBao.id === thongBaoId 
              ? { ...thongBao, daDoc: true } 
              : thongBao
          )
        );
        setSoThongBaoChuaDoc(prev => Math.max(0, prev - 1));
      }
      return result;
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc:', error);
      return false;
    }
  }, []);

  const capNhatSoThongBaoChuaDoc = useCallback(async () => {
    if (!currentUser.id) return;
    
    try {
      const count = await getSoThongBaoChuaDoc(currentUser.id);
      setSoThongBaoChuaDoc(count);
    } catch (error) {
      console.error('Lỗi khi cập nhật số thông báo:', error);
    }
  }, [currentUser.id]);

  useEffect(() => {
    if (currentUser.id) {
      // Cập nhật số thông báo mỗi khi mở ứng dụng
      capNhatSoThongBaoChuaDoc();
      
      // Thiết lập interval để kiểm tra thông báo mới mỗi 30 giây
      const interval = setInterval(capNhatSoThongBaoChuaDoc, 30000);
      
      return () => clearInterval(interval);
    }
    return undefined;
  }, [capNhatSoThongBaoChuaDoc, currentUser.id]);

  return {
    danhSachThongBao,
    soThongBaoChuaDoc,
    dangTai,
    layDanhSachThongBao,
    danhDauDaDoc,
    capNhatSoThongBaoChuaDoc
  };
}