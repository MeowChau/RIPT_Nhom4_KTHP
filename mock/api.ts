import { Request, Response } from 'express';
import { HealthRecord, WorkoutPlan } from '@/services/TDEE/typings';

// Mock database
const healthRecords: HealthRecord[] = [];
const workoutPlans: WorkoutPlan[] = [];

// Tạo ID duy nhất
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

export default {
  // Health Records API
  'GET /api/health-records': (req: Request, res: Response) => {
    res.json(healthRecords);
  },
  
  'POST /api/health-records': (req: Request, res: Response) => {
    const newRecord: HealthRecord = {
      ...req.body,
      id: generateId(),
    };
    
    healthRecords.unshift(newRecord); // Thêm vào đầu mảng để hiển thị các bản ghi mới nhất trước
    
    // Giữ tối đa 10 bản ghi
    if (healthRecords.length > 10) {
      healthRecords.pop();
    }
    
    res.status(201).json(newRecord);
  },
  
  'DELETE /api/health-records/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const index = healthRecords.findIndex(record => record.id === id);
    
    if (index !== -1) {
      healthRecords.splice(index, 1);
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Bản ghi không tồn tại' });
    }
  },
  
  // Workout Plans API
  'GET /api/workout-plans': (req: Request, res: Response) => {
    res.json(workoutPlans);
  },
  
  'POST /api/workout-plans': (req: Request, res: Response) => {
    const newPlan: WorkoutPlan = {
      ...req.body,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    workoutPlans.unshift(newPlan);
    
    // Giữ tối đa 5 lịch tập
    if (workoutPlans.length > 5) {
      workoutPlans.pop();
    }
    
    res.status(201).json(newPlan);
  },
  
  'DELETE /api/workout-plans/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    const index = workoutPlans.findIndex(plan => plan.id === id);
    
    if (index !== -1) {
      workoutPlans.splice(index, 1);
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Lịch tập không tồn tại' });
    }
  },
}