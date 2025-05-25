import type { BaiViet, BinhLuan, ThongBao } from '@/services/Forum/typings';
import { getStorageData, setStorageData } from '@/utils/localStorangeUtils';

// API bài viết
export const getBaiVietList = async (tuKhoa?: string): Promise<BaiViet[]> => {
  let baiViets = getStorageData<BaiViet[]>('baiViets', []);
  
  if (tuKhoa) {
    baiViets = baiViets.filter((baiViet: BaiViet) => 
      baiViet.tieuDe.toLowerCase().includes(tuKhoa.toLowerCase()) || 
      baiViet.noiDung.toLowerCase().includes(tuKhoa.toLowerCase())
    );
  }
  
  return baiViets.sort((a: BaiViet, b: BaiViet) => 
    new Date(b.thoiGianDang).getTime() - new Date(a.thoiGianDang).getTime()
  );
};

export const getBaiVietById = async (id: string): Promise<BaiViet | undefined> => {
  const baiViets = getStorageData<BaiViet[]>('baiViets', []);
  return baiViets.find((bv: BaiViet) => bv.id === id);
};

export const createBaiViet = async (data: { 
  tieuDe: string; 
  noiDung: string;
  nguoiDangId: string;
  tenNguoiDang: string;
  emailNguoiDang: string;
}): Promise<BaiViet> => {
  const baiViets = getStorageData<BaiViet[]>('baiViets', []);
  
  const newBaiViet: BaiViet = {
    id: `post-${Date.now()}`,
    tieuDe: data.tieuDe,
    noiDung: data.noiDung,
    nguoiDangId: data.nguoiDangId,
    tenNguoiDang: data.tenNguoiDang,
    emailNguoiDang: data.emailNguoiDang,
    thoiGianDang: new Date().toISOString(),
    soLuotThich: 0,
    daNhanThich: false,
    soLuongBinhLuan: 0
  };
  
  baiViets.push(newBaiViet);
  setStorageData('baiViets', baiViets);
  
  return newBaiViet;
};

export const likeBaiViet = async (
  baiVietId: string, 
  userId: string,
  userName: string,
  userEmail: string
): Promise<{ daThich: boolean; soLuotThich: number }> => {
  const baiViets = getStorageData<BaiViet[]>('baiViets', []);
  const thongBaos = getStorageData<ThongBao[]>('thongBaos', []);
  
  const baiViet = baiViets.find((bv: BaiViet) => bv.id === baiVietId);
  if (!baiViet) throw new Error('Bài viết không tồn tại');
  
  // Lưu trạng thái like trong localStorage
  type LikesMap = Record<string, boolean>;
  const likes = getStorageData<LikesMap>('likes', {});
  const likeKey = `post_${baiVietId}_${userId}`;
  
  let daThich = false;
  
  if (likes[likeKey]) {
    // Hủy like
    delete likes[likeKey];
    baiViet.soLuotThich -= 1;
  } else {
    // Like mới
    likes[likeKey] = true;
    baiViet.soLuotThich += 1;
    daThich = true;
    
    // Tạo thông báo khi like bài viết của người khác
    if (baiViet.nguoiDangId !== userId) {
      const newThongBao: ThongBao = {
        id: `notify-${Date.now()}`,
        loaiThongBao: 'THICH_BAI_VIET',
        nguoiThichId: userId,
        tenNguoiThich: userName,
        emailNguoiThich: userEmail,
        baiVietId: baiVietId,
        noiDung: `${userName} đã thích bài viết "${baiViet.tieuDe}"`,
        thoiGian: new Date().toISOString(),
        daDoc: false
      };
      
      thongBaos.push(newThongBao);
      setStorageData('thongBaos', thongBaos);
    }
  }
  
  setStorageData('likes', likes);
  setStorageData('baiViets', baiViets);
  
  return {
    daThich,
    soLuotThich: baiViet.soLuotThich
  };
};

// API bình luận
export const getBinhLuansByBaiVietId = async (baiVietId: string): Promise<BinhLuan[]> => {
  const binhLuans = getStorageData('binhLuans', []);
  
  return binhLuans
    .filter((bl: BinhLuan) => bl.baiVietId === baiVietId)
    .sort((a: BinhLuan, b: BinhLuan) => 
      new Date(b.thoiGianBinhLuan).getTime() - new Date(a.thoiGianBinhLuan).getTime()
    );
};

export const createBinhLuan = async (data: { 
  baiVietId: string; 
  noiDung: string;
  nguoiBinhLuanId: string;
  tenNguoiBinhLuan: string;
  emailNguoiBinhLuan: string;
}): Promise<BinhLuan> => {
  const binhLuans = getStorageData<BinhLuan[]>('binhLuans', []);
  const baiViets = getStorageData<BaiViet[]>('baiViets', []);
  
  const newBinhLuan: BinhLuan = {
    id: `comment-${Date.now()}`,
    baiVietId: data.baiVietId,
    noiDung: data.noiDung,
    nguoiBinhLuanId: data.nguoiBinhLuanId,
    tenNguoiBinhLuan: data.tenNguoiBinhLuan,
    emailNguoiBinhLuan: data.emailNguoiBinhLuan,
    thoiGianBinhLuan: new Date().toISOString(),
    soLuotThich: 0,
    daNhanThich: false
  };
  
  // Tăng số lượng bình luận của bài viết
  const baiViet = baiViets.find((bv: BaiViet) => bv.id === data.baiVietId);
  if (baiViet) {
    baiViet.soLuongBinhLuan += 1;
    setStorageData('baiViets', baiViets);
  }
  
  binhLuans.push(newBinhLuan);
  setStorageData('binhLuans', binhLuans);
  
  return newBinhLuan;
};

export const likeBinhLuan = async (
  binhLuanId: string,
  userId: string,
  userName: string,
  userEmail: string
): Promise<{ daThich: boolean; soLuotThich: number }> => {
  const binhLuans = getStorageData<BinhLuan[]>('binhLuans', []);
  const thongBaos = getStorageData<ThongBao[]>('thongBaos', []);
  
  const binhLuan = binhLuans.find((bl: BinhLuan) => bl.id === binhLuanId);
  if (!binhLuan) throw new Error('Bình luận không tồn tại');
  
  // Lưu trạng thái like trong localStorage
  type LikesMap = Record<string, boolean>;
  const likes = getStorageData<LikesMap>('likes', {});
  const likeKey = `comment_${binhLuanId}_${userId}`;
  
  let daThich = false;
  
  if (likes[likeKey]) {
    // Hủy like
    delete likes[likeKey];
    binhLuan.soLuotThich -= 1;
  } else {
    // Like mới
    likes[likeKey] = true;
    binhLuan.soLuotThich += 1;
    daThich = true;
    
    // Tạo thông báo khi like bình luận của người khác
    if (binhLuan.nguoiBinhLuanId !== userId) {
      const newThongBao: ThongBao = {
        id: `notify-${Date.now()}`,
        loaiThongBao: 'THICH_BINH_LUAN',
        nguoiThichId: userId,
        tenNguoiThich: userName,
        emailNguoiThich: userEmail,
        binhLuanId: binhLuanId,
        noiDung: `${userName} đã thích bình luận của bạn`,
        thoiGian: new Date().toISOString(),
        daDoc: false
      };
      
      thongBaos.push(newThongBao);
      setStorageData('thongBaos', thongBaos);
    }
  }
  
  setStorageData('likes', likes);
  setStorageData('binhLuans', binhLuans);
  
  return {
    daThich,
    soLuotThich: binhLuan.soLuotThich
  };
};

// API thông báo
export const getThongBaoList = async (userId: string): Promise<ThongBao[]> => {
  const thongBaos = getStorageData('thongBaos', []);
  
  // Lọc thông báo của người dùng hiện tại
  return thongBaos
    .filter((tb: ThongBao) => {
      // Các thông báo về bài viết hoặc bình luận của người dùng hiện tại
      const baiViets = getStorageData<BaiViet[]>('baiViets', []);
      const binhLuans = getStorageData<BinhLuan[]>('binhLuans', []);
      
      if (tb.loaiThongBao === 'THICH_BAI_VIET' && tb.baiVietId) {
        const baiViet = baiViets.find((bv: BaiViet) => bv.id === tb.baiVietId);
        return baiViet && baiViet.nguoiDangId === userId;
      }
      
      if (tb.loaiThongBao === 'THICH_BINH_LUAN' && tb.binhLuanId) {
        const binhLuan = binhLuans.find((bl: BinhLuan) => bl.id === tb.binhLuanId);
        return binhLuan && binhLuan.nguoiBinhLuanId === userId;
      }
      
      return false;
    })
    .sort((a: ThongBao, b: ThongBao) => 
      new Date(b.thoiGian).getTime() - new Date(a.thoiGian).getTime()
    );
};

export const markThongBaoAsRead = async (thongBaoId: string): Promise<boolean> => {
  const thongBaos = getStorageData<ThongBao[]>('thongBaos', []);
  const thongBao = thongBaos.find((tb: ThongBao) => tb.id === thongBaoId);
  
  if (thongBao) {
    thongBao.daDoc = true;
    setStorageData('thongBaos', thongBaos);
    return true;
  }
  
  return false;
};

export const getSoThongBaoChuaDoc = async (userId: string): Promise<number> => {
  const thongBaos = await getThongBaoList(userId);
  return thongBaos.filter(tb => !tb.daDoc).length;
};