const crypto = require('crypto');
const axios = require('axios');
const Transaction = require('../models/transaction.model');
const dotenv = require('dotenv');
dotenv.config();

class PaymentService {
  constructor() {
    // MoMo config (test mode)
    this.partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMO';
    this.accessKey = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85';
    this.secretKey = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    this.momoEndpoint = 'https://test-payment.momo.vn/v2/gateway/api/create';
    this.returnUrl = process.env.MOMO_RETURN_URL || 'http://localhost:5000/api/payment/momo/callback';
    this.notifyUrl = process.env.MOMO_NOTIFY_URL || 'http://localhost:5000/api/payment/momo/notify';
  }

  // Tạo payment URL cho MoMo
  async createMoMoPayment(userId, planId, amount, planName) {
    try {
      // Tạo transaction
      const transaction = await Transaction.create({
        userId,
        amount,
        status: 'pending',
        paymentMethod: 'momo',
        paymentData: { planId, planName }
      });

      const orderId = `ORDER${transaction.id}${Date.now()}`;
      const requestId = orderId;
      const orderInfo = `Thanh toan ${planName}`;
      const redirectUrl = this.returnUrl;
      const ipnUrl = this.notifyUrl;
      const requestType = 'captureWallet';
      const extraData = '';
      
      // Set timeout 5 minutes (300000 milliseconds)
      const expireTime = 300000;

      // Tạo signature
      const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
      
      const signature = crypto
        .createHmac('sha256', this.secretKey)
        .update(rawSignature)
        .digest('hex');

      // Request body gửi tới MoMo
      const requestBody = {
        partnerCode: this.partnerCode,
        accessKey: this.accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType,
        signature,
        lang: 'vi',
        autoCapture: true,
        orderExpireTime: expireTime
      };

      // Gọi API MoMo
      const response = await axios.post(this.momoEndpoint, requestBody);

      if (response.data.resultCode === 0) {
        // Lưu orderId vào transaction
        await transaction.update({
          transactionId: orderId,
          paymentData: { ...transaction.paymentData, orderId, requestId }
        });

        return {
          paymentUrl: response.data.payUrl,
          transactionId: transaction.id,
          orderId
        };
      } else {
        throw new Error(response.data.message || 'MoMo payment creation failed');
      }
    } catch (error) {
      console.error('MoMo payment error:', error);
      throw error;
    }
  }

  // Xử lý MoMo callback/notify
  async handleMoMoCallback(data) {
    try {
      const {
        orderId,
        requestId,
        amount,
        orderInfo,
        orderType,
        transId,
        resultCode,
        message,
        payType,
        responseTime,
        extraData,
        signature
      } = data;

      // Verify signature
      const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${this.partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
      
      const expectedSignature = crypto
        .createHmac('sha256', this.secretKey)
        .update(rawSignature)
        .digest('hex');

      if (signature !== expectedSignature) {
        return { success: false, message: 'Invalid signature' };
      }

      // Tìm transaction
      const transaction = await Transaction.findOne({
        where: { transactionId: orderId }
      });

      if (!transaction) {
        return { success: false, message: 'Transaction not found' };
      }

      // Check resultCode
      if (resultCode === 0) {
        // Thanh toán thành công
        await transaction.update({ 
          status: 'success',
          paymentData: { ...transaction.paymentData, transId, payType }
        });
        
        return {
          success: true,
          transactionId: transaction.id,
          userId: transaction.userId,
          planId: transaction.paymentData.planId
        };
      } else {
        // Thanh toán thất bại
        await transaction.update({ status: 'failed' });
        return { success: false, message: message || 'Payment failed', code: resultCode };
      }
    } catch (error) {
      console.error('MoMo callback error:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();