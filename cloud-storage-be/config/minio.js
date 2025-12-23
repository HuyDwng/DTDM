const Minio = require('minio');
const dotenv = require('dotenv');
dotenv.config();

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: process.env.MINIO_USE_SSL === 'true', // nếu bạn bật HTTPS
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  useAWS4: true // <-- BẮT BUỘC nếu server yêu cầu AWSv4
});

module.exports = minioClient;
