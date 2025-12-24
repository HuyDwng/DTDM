const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// GET /api/payment/momo/callback (public - MoMo redirect)
router.get('/momo/callback', paymentController.momoCallback);

// POST /api/payment/momo/notify (public - MoMo webhook)
router.post('/momo/notify', paymentController.momoNotify);

// ========== TEST ENDPOINT FOR DEMO ==========
router.get('/demo/success', async (req, res) => {
  try {
    const Transaction = require('../models/transaction.model');
    const billingService = require('../services/billing.service');
    const Plan = require('../models/plan.model');
    
    // Lấy transaction pending cuối cùng
    const transaction = await Transaction.findOne({
      where: { status: 'pending' },
      order: [['createdAt', 'DESC']]
    });
    
    if (!transaction) {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Test Payment</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              border-radius: 20px;
              padding: 60px 40px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              text-align: center;
              max-width: 500px;
            }
            .icon {
              font-size: 80px;
              margin-bottom: 20px;
            }
            h1 {
              color: #ef4444;
              font-size: 32px;
              margin: 0 0 20px 0;
            }
            p {
              color: #6b7280;
              font-size: 18px;
              line-height: 1.6;
              margin-bottom: 30px;
            }
            .btn {
              display: inline-block;
              padding: 16px 40px;
              background: #3b82f6;
              color: white;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 600;
              font-size: 16px;
              transition: all 0.3s;
            }
            .btn:hover {
              background: #2563eb;
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">⚠️</div>
            <h1>Chưa Có Giao Dịch</h1>
            <p>Vui lòng click <strong>"Nâng Cấp"</strong> ở trang Upgrade Storage trước khi test payment!</p>
            <a href="http://localhost:3000/dashboard/upgrade-storage" class="btn">
              Đi Đến Upgrade Storage
            </a>
          </div>
        </body>
        </html>
      `);
    }
    
    // Get plan info
    const plan = await Plan.findByPk(transaction.paymentData.planId);
    
    // Update thành success
    await transaction.update({ status: 'success' });
    
    // Upgrade plan
    await billingService.upgradePlan(
      transaction.userId,
      transaction.paymentData.planId,
      transaction.id
    );
    
    // Show success page with auto redirect
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Thanh Toán Thành Công</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            border-radius: 20px;
            padding: 60px 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 500px;
            animation: slideUp 0.5s ease;
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .icon {
            font-size: 80px;
            margin-bottom: 20px;
            animation: bounce 1s ease;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          h1 {
            color: #10b981;
            font-size: 32px;
            margin: 0 0 20px 0;
          }
          .info {
            background: #f3f4f6;
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
            text-align: left;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .label {
            color: #6b7280;
            font-weight: 500;
          }
          .value {
            color: #111827;
            font-weight: 600;
          }
          .countdown {
            color: #6b7280;
            font-size: 14px;
            margin-top: 20px;
          }
          .btn {
            display: inline-block;
            padding: 16px 40px;
            background: #10b981;
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s;
            margin-top: 20px;
          }
          .btn:hover {
            background: #059669;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">✅</div>
          <h1>Thanh Toán Thành Công!</h1>
          
          <div class="info">
            <div class="info-row">
              <span class="label">Gói đã mua:</span>
              <span class="value">${plan.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Số tiền:</span>
              <span class="value">${plan.price.toLocaleString('vi-VN')}đ</span>
            </div>
            <div class="info-row">
              <span class="label">Dung lượng:</span>
              <span class="value">${Math.round(plan.storageLimit / (1024*1024*1024))}GB</span>
            </div>
            <div class="info-row">
              <span class="label">Transaction ID:</span>
              <span class="value">#${transaction.id}</span>
            </div>
          </div>

          <p class="countdown">Tự động chuyển về Dashboard sau <strong id="countdown">3</strong> giây...</p>
          
          <a href="http://localhost:3000/dashboard/billing?payment=success" class="btn">
            Xem Chi Tiết Ngay
          </a>
        </div>
        
        <script>
          let count = 3;
          const countdownEl = document.getElementById('countdown');
          
          const interval = setInterval(() => {
            count--;
            countdownEl.textContent = count;
            
            if (count === 0) {
              clearInterval(interval);
              window.location.href = 'http://localhost:3000/dashboard/billing?payment=success';
            }
          }, 1000);
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Demo payment error:', error);
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Lỗi</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            border-radius: 20px;
            padding: 60px 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 500px;
          }
          .icon { font-size: 80px; margin-bottom: 20px; }
          h1 { color: #ef4444; font-size: 32px; margin: 0 0 20px 0; }
          p { color: #6b7280; font-size: 16px; }
          pre { 
            background: #fee; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: left;
            overflow: auto;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">❌</div>
          <h1>Có Lỗi Xảy Ra</h1>
          <p>Chi tiết lỗi:</p>
          <pre>${error.message}</pre>
        </div>
      </body>
      </html>
    `);
  }
});

module.exports = router;
