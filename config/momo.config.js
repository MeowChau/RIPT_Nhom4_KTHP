module.exports = {
  partnerCode: 'MOMONPMB20210629',
  partnerName: 'Tên doanh nghiệp SDK4ME',
  accessKey: 'Q2XhhSdgpKUlQ4Ky',
  secretKey: 'k6B53GQKSjktZGJBK2MyrDa7w9S6RyCf',
  endpoint: 'https://test-payment.momo.vn/v2/gateway/api',
  ipnUrl: 'https://your-domain.com/api/payment/notify', // Cần thay thế bằng domain thực
  redirectUrl: 'https://your-domain.com/payment/result', // Cần thay thế bằng domain thực
  requestType: 'captureWallet',
  lang: 'vi',
  paymentPlans: [
    {
      id: 'plan_1m',
      name: 'Gói 1 tháng',
      duration: 1,
      price: 500
    },
    {
      id: 'plan_3m',
      name: 'Gói 3 tháng',
      duration: 3,
      price: 1000
    },
    {
      id: 'plan_6m',
      name: 'Gói 6 tháng',
      duration: 6,
      price: 1500
    },
    {
      id: 'plan_12m',
      name: 'Gói 12 tháng',
      duration: 12,
      price: 2000
    }
  ]
};