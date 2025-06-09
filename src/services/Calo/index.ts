import { request } from 'umi';

/**
 * Tạo mới một bản ghi calo
 * @param data Dữ liệu bản ghi calo
 */
export async function createCalorieEntry(data: API.CalorieEntry) {
  return request<API.CalorieEntryResponse>('/api/calories', {
    method: 'POST',
    data,
  });
}

/**
 * Cập nhật bản ghi calo cho một ngày cụ thể
 * @param date Ngày cần cập nhật (YYYY-MM-DD)
 * @param data Dữ liệu cần cập nhật
 */
export async function updateCalorieEntry(date: string, data: Partial<API.CalorieEntry>) {
  return request<API.CalorieEntryResponse>(`/api/calories/${date}`, {
    method: 'PUT',
    data,
  });
}

/**
 * Lấy tổng hợp calo theo tuần
 * Đã loại bỏ tham số userId
 */
export async function getWeeklySummary() {
  return request<API.WeeklySummaryResponse>('/api/calories/weekly-summary', {
    method: 'GET',
  });
}

/**
 * Tính toán giá trị calo dựa trên macronutrient
 * @param protein Lượng protein (g)
 * @param carb Lượng carb (g)
 * @param fat Lượng chất béo (g)
 * @param caloTarget Mục tiêu calo
 */
export function calculateCalories(protein: number, carb: number, fat: number, caloTarget: number) {
  const totalCaloIntake = (protein * 4) + (carb * 4) + (fat * 9);
  const caloDiff = totalCaloIntake - caloTarget;
  return { totalCaloIntake, caloDiff };
}