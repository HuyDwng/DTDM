const paymentService = require('../services/payment.service');
const billingService = require('../services/billing.service');

class PaymentController {
  // GET /api/payment/momo/callback
  async momoCallback(req, res) {
    try {
      const result = await paymentService.handleMoMoCallback(req.query);

      if (result.success) {
        // Upgrade plan cho user
        await billingService.upgradePlan(
          result.userId,
          result.planId,
          result.transactionId
        );

        // Redirect về frontend với success
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/dashboard/billing?payment=success`);
      } else {
        // Redirect về frontend với error
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/dashboard/billing?payment=failed&reason=${result.message}`);
      }
    } catch (error) {
      console.error('Payment callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/dashboard/billing?payment=error`);
    }
  }

  // POST /api/payment/momo/notify (webhook từ MoMo)
  async momoNotify(req, res) {
    try {
      const result = await paymentService.handleMoMoCallback(req.body);

      if (result.success) {
        await billingService.upgradePlan(
          result.userId,
          result.planId,
          result.transactionId
        );
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Payment notify error:', error);
      res.json({ success: false });
    }
  }
}

module.exports = new PaymentController();