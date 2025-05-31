export namespace API {
  // Gói thanh toán
  export interface PaymentPlan {
    id: string;
    name: string;
    duration: number;
    price: number;
  }

  // Request tạo thanh toán
  export interface CreatePaymentParams {
    planId: string;
    userId?: string;
  }

  // Response khi lấy danh sách gói
  export interface PaymentPlansResponse {
    success: boolean;
    plans: PaymentPlan[];
    message?: string;
  }

  // Response khi tạo link thanh toán
  export interface PaymentLinkResponse {
    success: boolean;
    paymentUrl?: string;
    orderId?: string;
    message?: string;
  }

  // Response khi kiểm tra trạng thái thanh toán
  export interface PaymentStatusResponse {
    success: boolean;
    data?: {
      orderId: string;
      status: 'pending' | 'completed' | 'failed' | 'expired';
      planId: string;
      amount: number;
      used: boolean;
      createdAt: string;
    };
    message?: string;
  }

  // Params cho API đăng ký
  export interface RegisterParams {
    name: string;
    email: string;
    phone: string;
    password: string;
    gymId: string;
    orderId: string; // OrderId từ thanh toán
    startDate?: string;
  }

  // Response từ API đăng ký
  export interface RegisterResponse {
    success: boolean;
    token?: string;
    data?: any;
    message?: string;
  }
}