// Định nghĩa các gói tập có sẵn
export type MembershipPackage = '1 tháng' | '3 tháng' | '6 tháng' | '12 tháng';
export const MEMBERSHIP_PACKAGES: MembershipPackage[] = ['1 tháng', '3 tháng', '6 tháng', '12 tháng'];

// Interface cho lịch sử gia hạn
export interface Renewal {
  date: string; // ISO Date string
  package: string;
  status: string;
}

// Interface cho hội viên
export interface Member {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  gymId: string;
  membershipPackage: MembershipPackage;
  startDate: string; // ISO Date string
  endDate: string;   // ISO Date string
  renewalHistory?: Renewal[];
  role?: 'user' | 'admin' | 'trainer';
}

// Interface cho form thêm/sửa hội viên
export interface MemberFormData {
  name: string;
  email?: string;
  phone?: string;
  password?: string; // Chỉ yêu cầu khi tạo mới
  gymId: string;
  membershipPackage: string;
  startDate: string;
  role?: 'user' | 'admin' | 'trainer';
}

// Interface cho phòng tập
export interface Gym {
  _id: string;
  name: string;
  address?: string;
}