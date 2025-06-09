declare namespace API {
  /**
   * Thông tin một bản ghi theo dõi calo
   */
  interface CalorieEntry {
    _id?: string;
    // Đã loại bỏ userId vì không cần thiết
    date: string;
    meals: number;
    protein: number;
    carb: number;
    fat: number;
    caloTarget: number;
    totalCaloIntake?: number; 
    caloDiff?: number;
    createdAt?: string;
    updatedAt?: string;
  }

  /**
   * Dữ liệu tổng hợp calo hàng ngày
   */
  interface DailyCalorieSummary {
    date: string;
    totalCaloIntake: number;
    caloTarget: number;
    caloDiff: number;
  }
  
  /**
   * Dữ liệu tổng hợp calo theo tuần
   */
  interface WeeklySummary {
    totalCaloIntake: number;
    totalCaloTarget: number;
    caloDiff: number;
  }

  /**
   * Phản hồi API tổng quan theo tuần
   */
  interface WeeklySummaryResponse {
    status: string;
    weeklyData: DailyCalorieSummary[];
    weeklySummary: WeeklySummary;
  }

  /**
   * Phản hồi API cho một bản ghi calo đơn lẻ
   */
  interface CalorieEntryResponse {
    status: string;
    data: CalorieEntry;
  }

  /**
   * Phản hồi API cho danh sách bản ghi calo
   */
  interface CalorieEntriesResponse {
    status: string;
    data: CalorieEntry[];
  }

  /**
   * Phản hồi API lỗi
   */
  interface ErrorResponse {
    status: string;
    message: string;
  }
}