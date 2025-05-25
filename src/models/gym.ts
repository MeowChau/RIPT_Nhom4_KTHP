import { useState, useEffect, useCallback } from 'react';
import { getGymFacilities, getGymFacilityById, createGymFacility, updateGymFacility, deleteGymFacility } from '@/services/Gym/index';
import { message } from 'antd';
import API from '@/services/Gym/typings'
// Define the API namespace and GymFacility type if not already imported


/**
 * Custom hook để quản lý danh sách gym facilities
 */
export function useGymFacilities() {
  // Sử dụng type API.GymFacility cho nhất quán với phần còn lại của file
  const [facilities, setFacilities] = useState<API.GymFacility[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch danh sách gym facilities
   */
  const fetchFacilities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGymFacilities();
      setFacilities(data || []);
    } catch (err) {
      console.error('Error fetching gym facilities:', err);
      setError('Không thể tải danh sách cơ sở gym. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  return {
    facilities,
    loading,
    error,
    refresh: fetchFacilities,
  };
}

/**
 * Custom hook để quản lý chi tiết một gym facility
 * @param id ID của gym facility (có thể undefined nếu không cần tải ngay)
 * @param initialLoad Có tải dữ liệu ngay khi khởi tạo hook không
 */
export function useGymFacilityDetail(id?: string, initialLoad = true) {
  const [facility, setFacility] = useState<API.GymFacility | null>(null);
  const [loading, setLoading] = useState<boolean>(initialLoad);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch chi tiết gym facility
   */
  const fetchFacilityDetail = useCallback(async (facilityId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGymFacilityById(facilityId);
      setFacility(data);
    } catch (err) {
      console.error('Error fetching gym facility detail:', err);
      setError('Không thể tải thông tin chi tiết cơ sở gym.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id && initialLoad) {
      fetchFacilityDetail(id);
    }
  }, [id, initialLoad, fetchFacilityDetail]);

  /**
   * Lưu thông tin gym facility
   */
  const saveFacility = useCallback(async (data: Partial<API.GymFacility>, facilityId?: string) => {
    setLoading(true);
    setError(null);
    try {
      let savedData: API.GymFacility;
      
      if (facilityId) {
        // Cập nhật
        savedData = await updateGymFacility(facilityId, data);
        message.success('Đã cập nhật thông tin cơ sở gym thành công!');
      } else {
        // Tạo mới
        savedData = await createGymFacility(data as Omit<API.GymFacility, '_id' | 'createdAt' | 'updatedAt'>);
        message.success('Đã thêm cơ sở gym mới thành công!');
      }
      
      setFacility(savedData);
      return savedData;
    } catch (err) {
      console.error('Error saving gym facility:', err);
      setError('Không thể lưu thông tin cơ sở gym.');
      message.error('Có lỗi xảy ra khi lưu thông tin.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Xóa gym facility
   */
  const removeFacility = useCallback(async (facilityId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteGymFacility(facilityId);
      setFacility(null);
      message.success('Đã xóa cơ sở gym thành công!');
      return true;
    } catch (err) {
      console.error('Error deleting gym facility:', err);
      setError('Không thể xóa cơ sở gym.');
      message.error('Có lỗi xảy ra khi xóa cơ sở gym.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    facility,
    loading,
    error,
    fetchFacilityDetail,
    saveFacility,
    removeFacility,
  };
}