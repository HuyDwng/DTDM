const billingService = require('../services/billing.service');

// Middleware check storage quota trước khi upload
const checkStorageQuota = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Tính tổng size của files cần upload
    const files = req.files;
    if (!files || files.length === 0) {
      return next();
    }

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    // Check quota
    const quotaCheck = await billingService.checkStorageQuota(userId, totalSize);

    if (!quotaCheck.allowed) {
      return res.status(403).json({
        success: false,
        message: 'Storage quota exceeded. Please upgrade your plan.',
        details: {
          used: quotaCheck.used,
          limit: quotaCheck.limit,
          attempting: totalSize
        }
      });
    }

    next();
  } catch (error) {
    console.error('Storage quota check error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { checkStorageQuota };