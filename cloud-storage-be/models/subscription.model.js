const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  planId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'cancelled', 'expired'),
    defaultValue: 'active'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  storageUsed: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  }
}, {
  tableName: 'subscriptions',
  timestamps: true
});

const Plan = require('./plan.model');
Subscription.belongsTo(Plan, { foreignKey: 'planId', as: 'plan' });

module.exports = Subscription;

