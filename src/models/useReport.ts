import { useState, useEffect } from 'react';
import { message } from 'antd';
import {
  fetchReportSummary,
  fetchMembersByGym,
  fetchPTsByGym,
  fetchActiveMembersByGym
} from '@/services/Report/index';
import type { API } from '@/services/Report/typings';

export default function useReport() {
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<API.ReportSummary | null>(null);
  const [membersByGym, setMembersByGym] = useState<API.ChartData[]>([]);
  const [ptsByGym, setPTsByGym] = useState<API.ChartData[]>([]);
  const [activeMembersByGym, setActiveMembersByGym] = useState<API.ChartData[]>([]);

  const fetchAllData = async (): Promise<void> => {
    setLoading(true);
    try {
      // Thêm trường hợp API không trả về cấu trúc success/data
      const summaryRes = await fetchReportSummary() as API.ApiResponse<API.ReportSummary> | API.ReportSummary;
      const membersRes = await fetchMembersByGym() as API.ApiResponse<API.GymDistribution[]> | API.GymDistribution[];
      const ptsRes = await fetchPTsByGym() as API.ApiResponse<API.GymDistribution[]> | API.GymDistribution[];
      const activeRes = await fetchActiveMembersByGym() as API.ApiResponse<API.GymActiveDistribution[]> | API.GymActiveDistribution[];
      
      console.log('API Responses:', { 
        summary: summaryRes, 
        members: membersRes, 
        pts: ptsRes, 
        active: activeRes 
      });
      
      // Kiểm tra xem API trả về cấu trúc gì
      if (summaryRes) {
        // Nếu API trả về cấu trúc {success, data}
        if ('success' in summaryRes && 'data' in summaryRes) {
          setSummary(summaryRes.data);
        } else {
          // Nếu API trả về trực tiếp dữ liệu
          setSummary(summaryRes as API.ReportSummary);
        }
      }

      // Xử lý dữ liệu biểu đồ hội viên
      if (membersRes) {
  let responseData;
  
  if ('data' in membersRes) {
    responseData = membersRes.data;
  } else {
    responseData = membersRes;
  }
  
  console.log('Members response data:', responseData);
  
  if (Array.isArray(responseData)) {
    const chartData = responseData.map(item => ({
      name: item.gymName,
      value: item.count
    }));
    console.log('Members chart data:', chartData);
    setMembersByGym(chartData);
  } else {
    console.error('Members data is not an array:', responseData);
    setMembersByGym([]);
  }
}

      // Xử lý dữ liệu biểu đồ huấn luyện viên
      if (ptsRes) {
        const data = 'data' in ptsRes ? ptsRes.data : ptsRes;
        const chartData = Array.isArray(data) ?
          data.map((item: API.GymDistribution) => ({
            name: item.gymName,
            value: item.count
          })) : [];
        setPTsByGym(chartData);
      }

      // Xử lý dữ liệu biểu đồ hội viên đang hoạt động
      if (activeRes) {
        const data = 'data' in activeRes ? activeRes.data : activeRes;
        const chartData = Array.isArray(data) ?
          data.map((item: API.GymActiveDistribution) => ({
            name: item.gymName,
            value: item.activeCount
          })) : [];
        setActiveMembersByGym(chartData);
      }
      
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu báo cáo:', error);
      message.error('Không thể tải dữ liệu báo cáo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    loading,
    summary,
    membersByGym,
    ptsByGym,
    activeMembersByGym,
    refresh: fetchAllData
  };
}