const Plan = require('../models/plan.model');
const Subscription = require('../models/subscription.model');
const Transaction = require('../models/transaction.model');

class BillingService {
  // Lấy tất cả plans
  async getAllPlans() {
    return await Plan.findAll({ 
      where: { isActive: true },
      order: [['price', 'ASC']]
    });
  }

  // Lấy subscription hiện tại của user
  async getCurrentSubscription(userId) {
    let subscription = await Subscription.findOne({
      where: { 
        userId,
        status: 'active'
      },
      include: [{ 
        model: Plan,
        as: 'plan'
      }],
      order: [['createdAt', 'DESC']]
    });

    // Nếu không có, tạo Free plan mặc định
    if (!subscription) {
      const freePlan = await Plan.findOne({ where: { duration: 'free' } });
      subscription = await Subscription.create({
        userId,
        planId: freePlan.id,
        status: 'active',
        startDate: new Date(),
        endDate: null,
        storageUsed: 0
      });
      
      subscription = await Subscription.findByPk(subscription.id, {
        include: [{ model: Plan, as: 'plan' }]
      });
    }

    return subscription;
  }

  // Check storage quota
  async checkStorageQuota(userId, fileSize) {
    const subscription = await this.getCurrentSubscription(userId);
    const plan = subscription.plan || await Plan.findByPk(subscription.planId);
    
    const newStorageUsed = subscription.storageUsed + fileSize;
    
    if (newStorageUsed > plan.storageLimit) {
      return { 
        allowed: false, 
        message: 'Storage quota exceeded',
        used: subscription.storageUsed,
        limit: plan.storageLimit,
        needed: fileSize
      };
    }

    return { allowed: true };
  }

  // Update storage used
  async updateStorageUsed(userId, sizeChange) {
    const subscription = await Subscription.findOne({
      where: { userId, status: 'active' }
    });

    if (subscription) {
      subscription.storageUsed = Math.max(0, subscription.storageUsed + sizeChange);
      await subscription.save();
    }
  }

  // Upgrade plan
  async upgradePlan(userId, planId, transactionId = null) {
    const plan = await Plan.findByPk(planId);
    if (!plan) throw new Error('Plan not found');

    // Hủy subscription cũ
    await Subscription.update(
      { status: 'cancelled' },
      { where: { userId, status: 'active' } }
    );

    // Tính ngày hết hạn
    const startDate = new Date();
    let endDate = null;
    
    if (plan.duration === 'monthly') {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan.duration === 'yearly') {
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Tạo subscription mới
    const newSubscription = await Subscription.create({
      userId,
      planId,
      status: 'active',
      startDate,
      endDate,
      storageUsed: 0
    });

    // Cập nhật transaction nếu có
    if (transactionId) {
      await Transaction.update(
        { subscriptionId: newSubscription.id, status: 'success' },
        { where: { id: transactionId } }
      );
    }

    return newSubscription;
  }

  // Lấy lịch sử transactions
  async getTransactionHistory(userId) {
    return await Transaction.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 50
    });
  }
}

module.exports = new BillingService();