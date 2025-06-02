module.exports = {
  // Thông tin tài khoản MoMo test
  partnerCode: 'MOMONPMB20210629',  // Thay bằng thông tin tài khoản test được cung cấp
  partnerName: 'Gym Management System',
  storeId: 'MOMONPMB20210629_store',
  accessKey: 'F8BBA842ECF85', // Thay bằng accessKey được cấp
  secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz', // Thay bằng secretKey được cấp
  
  // API endpoints
  endpoint: 'https://test-payment.momo.vn/v2/gateway/api',
  ipnUrl: 'https://your-domain.com/api/payment/notify', // Cần thay bằng domain thật khi lên production
  redirectUrl: 'http://localhost:8000/payment-result',
  
  // Các thông số giao dịch
  requestType: 'captureWallet',
  lang: 'vi',
  
  // Danh sách gói thanh toán
  paymentPlans: [
    { id: "basic", name: "Gói 1 tháng", price: 300000, duration: 1 },
    { id: "standard", name: "Gói 3 tháng", price: 750000, duration: 3 },
    { id: "premium", name: "Gói 6 tháng", price: 1350000, duration: 6 },
    { id: "yearly", name: "Gói 12 tháng", price: 2400000, duration: 12 }
  ]
};