const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Plan = sequelize.define('Plan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  duration: {
    type: DataTypes.ENUM('free', 'monthly', 'yearly'),
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  storageLimit: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'plans',
  timestamps: true
});

module.exports = Plan;