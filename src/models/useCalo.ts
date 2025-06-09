import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import {
  createCalorieEntry,
  updateCalorieEntry,
  getWeeklySummary,
  calculateCalories,
} from '@/services/Calo/index';

export default function useCalorieTracker() {
  const [weeklyData, setWeeklyData] = useState<API.DailyCalorieSummary[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<API.WeeklySummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [refreshFlag, setRefreshFlag] = useState<number>(0);

  const refreshData = useCallback(() => {
    setRefreshFlag(prev => prev + 1);
  }, []);

  // Fetch weekly summary
  useEffect(() => {
    const fetchWeeklyData = async () => {
      setLoading(true);
      try {
        const response = await getWeeklySummary();
        if (response.status === 'success') {
          setWeeklyData(response.weeklyData || []);
          setWeeklySummary(response.weeklySummary);
        }
      } catch (error) {
        console.error('Error fetching weekly data:', error);
        message.error('Failed to load calorie data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, [refreshFlag]);

  // Create a new calorie entry
  const addCalorieEntry = async (values: API.CalorieEntry) => {
    setSubmitting(true);
    try {
      const response = await createCalorieEntry(values);
      if (response.status === 'success') {
        message.success('Calorie entry created successfully');
        refreshData();
        return true;
      } else {
        message.error('Failed to create calorie entry');
        return false;
      }
    } catch (error: any) {
      console.error('Error creating calorie entry:', error);
      message.error(error.response?.data?.message || 'Failed to create calorie entry');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Update existing calorie entry
  const updateCalorie = async (date: string, values: Partial<API.CalorieEntry>) => {
    setSubmitting(true);
    try {
      const response = await updateCalorieEntry(date, values);
      if (response.status === 'success') {
        message.success('Calorie entry updated successfully');
        refreshData();
        return true;
      } else {
        message.error('Failed to update calorie entry');
        return false;
      }
    } catch (error: any) {
      console.error('Error updating calorie entry:', error);
      message.error(error.response?.data?.message || 'Failed to update calorie entry');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    weeklyData,
    weeklySummary,
    loading,
    submitting,
    addCalorieEntry,
    updateCalorie,
    calculateCalories,
    refreshData,
  };
}