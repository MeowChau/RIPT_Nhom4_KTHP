export interface BaiViet {
  id: string;
  tieuDe: string;
  noiDung: string;
  nguoiDangId: string;
  tenNguoiDang: string;
  emailNguoiDang: string;
  thoiGianDang: string;
  soLuotThich: number;
  daNhanThich: boolean;
  soLuongBinhLuan: number;
}

export interface BinhLuan {
  id: string;
  baiVietId: string;
  noiDung: string;
  nguoiBinhLuanId: string;
  tenNguoiBinhLuan: string;
  emailNguoiBinhLuan: string;
  thoiGianBinhLuan: string;
  soLuotThich: number;
  daNhanThich: boolean;
}

export interface ThongBao {
  id: string;
  noiDung: string;
  thoiGian: string;
  daDoc: boolean;
  loaiThongBao: 'THICH_BAI_VIET' | 'THICH_BINH_LUAN';
  nguoiThichId: string;
  tenNguoiThich: string;
  emailNguoiThich: string;
  baiVietId?: string;
  binhLuanId?: string;
}


export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  // Các thuộc tính khác của currentUser
}

interface User {
  userid?: string;
  id?: string;
  name?: string;
  email?: string;
}

export interface InitialState {
  currentUser?: CurrentUser | null;
}