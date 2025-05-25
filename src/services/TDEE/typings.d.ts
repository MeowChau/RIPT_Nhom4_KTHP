export interface HealthFormData {
  gender: 'male' | 'female';
  age: number;
  weight: number; // kg
  height: number; // cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_weight' | 'maintain' | 'gain_weight';
}

export interface HealthRecord extends HealthFormData {
  id: string;
  timestamp: string;
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
}

export type WorkoutPlanType = 'beginner' | 'intermediate' | 'strength' | 'balanced';

export interface WorkoutPlan {
  id: string;
  userId?: string;
  type: WorkoutPlanType;
  createdAt: string;
}