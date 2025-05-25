declare namespace API {
  export interface LoginParams {
    email: string;
    password: string;
  }

  export interface RegisterParams {
    name: string;
    email: string;
    phone: string;
    password: string;
    gymId: string;             // Thêm gymId theo schema
    membershipPackage: string; // Đổi từ membershipPlan thành membershipPackage theo schema
    startDate: string;         // Ngày bắt đầu
  }

  export interface UserInfo {
    id: string;
    name: string;
    email: string;
    phone: string;
    gymId: string;
    membershipPackage: string;
    startDate: string;
    endDate: string;
    avatar?: string;
  }
  export interface Response<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    token?: string;
    status?: number;
  }
  
  export interface LoginFormProps {
    onFinish: (values: LoginParams) => Promise<void>;
    loading: boolean;
  }
  
  export interface RegisterFormProps {
    onFinish: (values: any) => Promise<void>;
    loading: boolean;
  }
}

export default API;