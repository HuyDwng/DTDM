const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const File = sequelize.define('File', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: { type: DataTypes.STRING, allowNull: false },       // Tên file gốc
    key: { type: DataTypes.STRING, allowNull: false },        // Tên file trên MinIO
    size: { type: DataTypes.INTEGER, allowNull: false },
    mimeType: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }     // Sau này liên kết với user table
}, {
    tableName: 'files'
});

module.exports = { File };
