const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subscriptionId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'success', 'failed'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'vnpay'
  },
  transactionId: {
    type: DataTypes.STRING,
    unique: true
  },
  paymentData: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'transactions',
  timestamps: true
});

module.exports = Transaction;