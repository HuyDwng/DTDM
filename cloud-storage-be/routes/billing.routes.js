const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billing.controller');
const authenticate = require('../middleware/auth.middleware');

// GET /api/billing/plans (public)
router.get('/plans', billingController.getPlans);

// GET /api/billing/subscription (auth required)
router.get('/subscription', authenticate, billingController.getCurrentSubscription);

// POST /api/billing/upgrade (auth required)
router.post('/upgrade', authenticate, billingController.upgradePlan);

// GET /api/billing/transactions (auth required)
router.get('/transactions', authenticate, billingController.getTransactionHistory);

module.exports = router;