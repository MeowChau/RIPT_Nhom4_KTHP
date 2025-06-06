declare namespace API {
  /** 
   * Thông tin giờ hoạt động của một ngày
   */
  interface WorkingHour {
    open: string;      // Giờ mở cửa, định dạng "HH:MM"
    close: string;     // Giờ đóng cửa, định dạng "HH:MM"
    active: boolean;   // Trạng thái hoạt động của ngày
  }

  /**
   * Thiết bị/dụng cụ tại phòng gym
   */
  interface Equipment {
    _id?: string;         // MongoDB ObjectId
    name: string;         // Tên thiết bị
    quantity: number;     // Số lượng
    image?: string;       // URL hình ảnh thiết bị
  }

  /**
   * Lịch hoạt động theo các ngày trong tuần
   */
  interface WorkingHours {
    Monday: WorkingHour;
    Tuesday: WorkingHour;
    Wednesday: WorkingHour;
    Thursday: WorkingHour;
    Friday: WorkingHour;
    Saturday: WorkingHour;
    Sunday: WorkingHour;
    [key: string]: WorkingHour;  // Cho phép truy cập động
  }

  /**
   * Thông tin chi tiết của một cơ sở gym
   */
   interface GymFacility {
    _id: string;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    description?: string;
    openTime?: string;
    closeTime?: string;
    status?: 'active' | 'inactive';
  }
   interface GymResponse {
    success: boolean;
    data: GymFacility[];
    message?: string;
  }

  /**
   * Response khi có lỗi
   */
  interface ErrorResponse {
    message: string;                 // Thông báo lỗi
    errors?: Record<string, any>;    // Chi tiết lỗi theo trường dữ liệu
  }

  /**
   * Tham số phân trang
   */
  interface PaginationParams {
    current?: number;   // Trang hiện tại
    pageSize?: number;  // Số mục trên trang
  }

  /**
   * Cấu trúc dữ liệu response chuẩn
   */
  interface ResponseData<T> {
    data: T;               // Dữ liệu trả về
    success: boolean;      // Trạng thái thành công
    message?: string;      // Thông báo
  }

  /**
   * Tham số lọc và sắp xếp
   */
  interface FilterParams {
    sortBy?: string;       // Trường cần sắp xếp
    sortOrder?: 'asc' | 'desc';  // Thứ tự sắp xếp
    keyword?: string;      // Từ khóa tìm kiếm
  }
}
export type { API as default };