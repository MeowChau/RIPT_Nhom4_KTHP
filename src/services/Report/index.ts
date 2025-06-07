import { request } from 'umi';
import type { API } from '@/services/Report/typings';

/** Lấy dữ liệu thống kê tổng quan */
export async function fetchReportSummary() {
  return request<API.ReportSummary>('/api/reports/summary');
}

/** Lấy phân bố hội viên theo phòng gym */
export async function fetchMembersByGym() {
  return request<API.GymDistribution[]>('/api/reports/members-by-gym');
}

/** Lấy phân bố huấn luyện viên theo phòng gym */
export async function fetchPTsByGym() {
  return request<API.GymDistribution[]>('/api/reports/pts-by-gym');
}

/** Lấy phân bố hội viên đang hoạt động theo phòng gym */
export async function fetchActiveMembersByGym() {
  return request<API.GymActiveDistribution[]>('/api/reports/active-members-by-gym');
}

/** Xuất dữ liệu báo cáo dạng Excel */
export async function exportReportData(): Promise<void> {
  window.open('/api/reports/export-overview', '_blank');
}