const billingService = require('../services/billing.service');
const paymentService = require('../services/payment.service');

class BillingController {
  // GET /api/billing/plans
  async getPlans(req, res) {
    try {
      const plans = await billingService.getAllPlans();
      res.json({ success: true, data: plans });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/billing/subscription
  async getCurrentSubscription(req, res) {
    try {
      const userId = req.user.id;
      const subscription = await billingService.getCurrentSubscription(userId);
      res.json({ success: true, data: subscription });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /api/billing/upgrade
  async upgradePlan(req, res) {
    try {
      const userId = req.user.id;
      const { planId } = req.body;

      const Plan = require('../models/plan.model');
      const plan = await Plan.findByPk(planId);
      
      if (!plan) {
        return res.status(404).json({ success: false, message: 'Plan not found' });
      }

      if (plan.price === 0) {
        return res.status(400).json({ success: false, message: 'Cannot upgrade to free plan' });
      }

      // Tạo payment URL MoMo
      const paymentData = await paymentService.createMoMoPayment(
        userId,
        planId,
        plan.price,
        plan.name
      );

      res.json({ 
        success: true, 
        message: 'Redirect to payment gateway',
        data: paymentData
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/billing/transactions
  async getTransactionHistory(req, res) {
    try {
      const userId = req.user.id;
      const transactions = await billingService.getTransactionHistory(userId);
      res.json({ success: true, data: transactions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new BillingController();