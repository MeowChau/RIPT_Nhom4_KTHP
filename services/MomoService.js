const crypto = require('crypto');
const axios = require('axios');
const momoConfig = require('../config/momo.config');

class MomoService {
  constructor() {
    this.config = momoConfig;
  }

  // Tạo chuỗi signature để xác thực với MoMo
  createSignature(rawSignature) {
    return crypto
      .createHmac('sha256', this.config.secretKey)
      .update(rawSignature)
      .digest('hex');
  }

  // Tạo requestId ngẫu nhiên
  generateRequestId() {
    return `${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
  }

  // Tạo orderId ngẫu nhiên
  generateOrderId() {
    return `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
  }

  // Tạo link thanh toán
  async createPaymentRequest(userId, planId) {
    const plan = this.config.paymentPlans.find(p => p.id === planId);
    
    if (!plan) {
      throw new Error('Gói không hợp lệ');
    }

    const requestId = this.generateRequestId();
    const orderId = this.generateOrderId();
    const amount = plan.price;
    const orderInfo = `Thanh toán gói ${plan.name}`;
    const extraData = Buffer.from(JSON.stringify({
      userId,
      planId,
      duration: plan.duration
    })).toString('base64');

    const rawSignature = [
      'accessKey=' + this.config.accessKey,
      'amount=' + amount,
      'extraData=' + extraData,
      'ipnUrl=' + this.config.ipnUrl,
      'orderId=' + orderId,
      'orderInfo=' + orderInfo,
      'partnerCode=' + this.config.partnerCode,
      'redirectUrl=' + this.config.redirectUrl,
      'requestId=' + requestId,
      'requestType=' + this.config.requestType
    ].join('&');

    const signature = this.createSignature(rawSignature);

    const requestBody = {
      partnerCode: this.config.partnerCode,
      partnerName: this.config.partnerName,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: this.config.redirectUrl,
      ipnUrl: this.config.ipnUrl,
      extraData: extraData,
      requestType: this.config.requestType,
      signature: signature,
      lang: this.config.lang
    };

    try {
      const response = await axios.post(
        `${this.config.endpoint}/create`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        payUrl: response.data.payUrl,
        requestId,
        orderId,
        amount,
        planId,
        duration: plan.duration
      };
    } catch (error) {
      console.error('Lỗi tạo yêu cầu thanh toán MoMo:', error.response ? error.response.data : error.message);
      throw new Error('Lỗi kết nối đến cổng thanh toán');
    }
  }

  // Xác minh callback từ MoMo
  verifyIpnCallback(body) {
    // MoMo sẽ gửi lại các thông tin bao gồm signature
    const { signature, ...data } = body;

    // Sắp xếp các trường theo thứ tự alphabet để tạo rawSignature
    const keys = Object.keys(data).sort();
    const rawSignature = keys.map(key => `${key}=${data[key]}`).join('&');

    // Tính toán signature
    const calculatedSignature = this.createSignature(rawSignature);

    // So sánh signature nhận được với signature tính toán
    if (signature !== calculatedSignature) {
      return {
        isValid: false,
        message: 'Chữ ký không hợp lệ'
      };
    }

    // Kiểm tra trạng thái thanh toán
    if (data.resultCode !== 0) {
      return {
        isValid: false,
        message: `Thanh toán thất bại với mã lỗi: ${data.resultCode}`
      };
    }

    try {
      // Giải mã extraData để lấy thông tin user và plan
      const extraData = JSON.parse(Buffer.from(data.extraData, 'base64').toString());
      
      return {
        isValid: true,
        data: {
          userId: extraData.userId,
          planId: extraData.planId,
          duration: extraData.duration,
          amount: data.amount,
          orderId: data.orderId,
          transId: data.transId
        }
      };
    } catch (error) {
      return {
        isValid: false,
        message: 'Dữ liệu không hợp lệ'
      };
    }
  }
}

module.exports = new MomoService();