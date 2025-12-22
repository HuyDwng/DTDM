const { Sequelize } = require('sequelize');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

// Lấy config từ .env
const DB_NAME = process.env.MYSQL_DB;
const DB_USER = process.env.MYSQL_USER;
const DB_PASSWORD = process.env.MYSQL_PASSWORD;
const DB_HOST = process.env.MYSQL_HOST;
const DB_PORT = parseInt(process.env.MYSQL_PORT, 10) || 3306;

// Nếu MySQL cloud yêu cầu SSL, bạn có thể dùng certificate
 //const sslCert = fs.readFileSync('./certs/ca.pem'); // nếu có certificate từ MySQL server

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
  define: { timestamps: true },
  dialectOptions: {
    ssl: {
      // Nếu MySQL cloud yêu cầu SSL nhưng không có certificate
      // Node vẫn kết nối bằng rejectUnauthorized: false
      rejectUnauthorized: false

      // Nếu có certificate:
      // ca: sslCert,
    }
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ MySQL connected: ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME} (SSL enabled)`);
  } catch (err) {
    console.error(`❌ Unable to connect to MySQL as ${DB_USER}@${DB_HOST}:${DB_PORT}`);
    console.error(err.message || err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
