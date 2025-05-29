import { useState, useCallback } from 'react';
import { message } from 'antd';
import { getPTs } from '@/services/PT/index';

export default function usePT() {
  const [loading, setLoading] = useState<boolean>(false);
  const [trainers, setTrainers] = useState<PT.PersonalTrainer[]>([]);
  
  /**
   * Lấy danh sách PT
   */
  const fetchTrainers = useCallback(async (params?: PT.QueryParams) => {
    setLoading(true);
    try {
      const data = await getPTs(params);
      setTrainers(data || []);
      return data;
    } catch (error) {
      message.error('Không thể tải danh sách PT');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    trainers,
    fetchTrainers,
  };
}