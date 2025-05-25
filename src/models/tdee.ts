import { useState, useEffect } from 'react';
import { 
  getHistoryRecords, 
  saveHealthRecord
} from '@/services/TDEE/index';

// Define types locally if not exported from the service
type HealthFormData = {
  gender: string;
  weight: number;
  height: number;
  age: number;
  activityLevel: string;
  goal: 'lose_weight' | 'maintain' | 'gain_weight';
};

type HealthRecord = HealthFormData & {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  targetCalories: number;
  macroOption: string;
  macros: {
    carbs: number;
    protein: number;
    fat: number;
    carbsGrams: number;
    proteinGrams: number;
    fatGrams: number;
  };
  timestamp: string;
  id?: string | number;
};

const useHealthCalculator = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [historyRecords, setHistoryRecords] = useState<HealthRecord[]>([]);
  const [results, setResults] = useState<{
    bmi: number;
    bmiCategory: string;
    tdee: number;
    bmr: number;
    targetCalories: number;
    macroOption: string;
    macros: {
      carbs: number;
      protein: number;
      fat: number;
      carbsGrams: number;
      proteinGrams: number;
      fatGrams: number;
    };
  } | null>(null);

  // Load history records when component mounts
  const loadHistoryRecords = async () => {
    try {
      const records = await getHistoryRecords();
      setHistoryRecords(records);
    } catch (error) {
      console.error('Error loading history records:', error);
    }
  };

  useEffect(() => {
    loadHistoryRecords();
  }, []);

  // Tính BMI
  const calculateBMI = (height: number, weight: number): {value: number, category: string} => {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    let category = '';
    if (bmi < 18.5) category = 'Thiếu cân';
    else if (bmi < 24.9) category = 'Bình thường';
    else if (bmi < 29.9) category = 'Thừa cân';
    else category = 'Béo phì';
    
    return {
      value: parseFloat(bmi.toFixed(1)),
      category
    };
  };

  // Tính BMR sử dụng công thức Mifflin-St Jeor
  const calculateBMR = (gender: string, weight: number, height: number, age: number): number => {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  // Tính TDEE
  const calculateTDEE = (bmr: number, activityLevel: string): number => {
    const activityFactors: Record<string, number> = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very_active': 1.9
    };
    
    return bmr * activityFactors[activityLevel];
  };

  // Tính calories mục tiêu dựa trên mục tiêu
  const calculateTargetCalories = (tdee: number, goal: string): number => {
    switch (goal) {
      case 'lose_weight':
        return tdee - 500; // Giảm 500 calories/ngày để giảm cân
      case 'gain_weight':
        return tdee + 500; // Tăng 500 calories/ngày để tăng cân
      default:
        return tdee; // Duy trì cân nặng
    }
  };

  // Tính macros dựa trên phân phối và calories
  const calculateMacros = (calories: number, distribution: string): any => {
    let carbsPercentage, proteinPercentage, fatPercentage;
    
    switch (distribution) {
      case '40-40-20':
        carbsPercentage = 0.4;
        proteinPercentage = 0.4;
        fatPercentage = 0.2;
        break;
      case '33-35-30':
        carbsPercentage = 0.33;
        proteinPercentage = 0.35;
        fatPercentage = 0.32;
        break;
      case '50-30-20':
        carbsPercentage = 0.5;
        proteinPercentage = 0.3;
        fatPercentage = 0.2;
        break;
      default:
        carbsPercentage = 0.4;
        proteinPercentage = 0.4;
        fatPercentage = 0.2;
    }
    
    const carbCalories = calories * carbsPercentage;
    const proteinCalories = calories * proteinPercentage;
    const fatCalories = calories * fatPercentage;
    
    // Chuyển đổi calories thành grams
    const carbsGrams = Math.round(carbCalories / 4); // 1g carbs = 4 calories
    const proteinGrams = Math.round(proteinCalories / 4); // 1g protein = 4 calories
    const fatGrams = Math.round(fatCalories / 9); // 1g fat = 9 calories
    
    return {
      carbs: Math.round(carbsPercentage * 100),
      protein: Math.round(proteinPercentage * 100),
      fat: Math.round(fatPercentage * 100),
      carbsGrams,
      proteinGrams,
      fatGrams
    };
  };

  const calculateHealth = async (values: HealthFormData) => {
    setLoading(true);
    try {
      const bmiResult = calculateBMI(values.height, values.weight);
      const bmr = calculateBMR(values.gender, values.weight, values.height, values.age);
      const tdee = calculateTDEE(bmr, values.activityLevel);
      const targetCalories = calculateTargetCalories(tdee, values.goal);
      
      // Mặc định sử dụng tỷ lệ 40-40-20
      const macroDistribution = '40-40-20';
      const macros = calculateMacros(targetCalories, macroDistribution);
      
      const resultsData = {
        bmi: bmiResult.value,
        bmiCategory: bmiResult.category,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        targetCalories: Math.round(targetCalories),
        macroOption: macroDistribution,
        macros
      };
      
      setResults(resultsData);
      
      // Lưu kết quả vào lịch sử
      await saveHealthRecord({
        ...values,
        gender: values.gender as 'male' | 'female',
        activityLevel: values.activityLevel as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
        ...resultsData,
        timestamp: new Date().toISOString()
      });
      
      // Refresh danh sách lịch sử
      loadHistoryRecords();
    } catch (error) {
      console.error('Error calculating health metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMacros = (distribution: string) => {
    if (!results) return;
    
    const newMacros = calculateMacros(results.targetCalories, distribution);
    setResults({
      ...results,
      macroOption: distribution,
      macros: newMacros
    });
  };

  return {
    results,
    loading,
    historyRecords,
    calculateHealth,
    updateMacros,
    loadHistoryRecords
  };
};

export default useHealthCalculator;