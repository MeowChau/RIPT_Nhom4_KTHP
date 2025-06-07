declare namespace API {
  export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
  }

  export interface ReportSummary {
    gyms: number;
    members: number;
    personalTrainers: number;
    totalEquipment: number;
    totalRevenue: number;
  }

  export interface ChartData {
    name: string;
    value: number;
    color?: string;
  }
  
  export interface GymDistribution {
    _id: string;
    gymName: string;
    count: number;
  }
  
  export interface GymActiveDistribution {
    _id: string;
    gymName: string;
    activeCount: number;
  }
 export interface Summary {
  gyms: number;
  members: number;
  personalTrainers: number;
  totalEquipment: number;
  totalRevenue: number;
}
}
export { API };