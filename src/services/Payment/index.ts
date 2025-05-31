import { request } from 'umi';
import type { API } from '@/services/Payment/typings';
const API_URL = 'http://localhost:5000/api'; 
// Lấy danh sách các gói thanh toán
export async function getPaymentPlans() {
  return request<API.PaymentPlansResponse>(`${API_URL}/payment/plans`);
}

// Tạo link thanh toán MoMo
export async function createPaymentLink(params: API.CreatePaymentParams) {
  return request<API.PaymentLinkResponse>(`${API_URL}/payment/create`, {
    method: 'POST',
    data: params,
  });
}

// Kiểm tra trạng thái thanh toán
export async function checkPaymentStatus(orderId: string) {
  return request<API.PaymentStatusResponse>(`${API_URL}/payment/status/${orderId}`);
}

// Cập nhật API đăng ký để chấp nhận orderId
export async function register(params: API.RegisterParams) {
  return request<API.RegisterResponse>(`${API_URL}/members/register`, {
    method: 'POST',
    data: params,
  });
}