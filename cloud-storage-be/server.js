const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const { connectDB, sequelize } = require('./config/db');
const minioClient = require('./config/minio');

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Connect MySQL
connectDB();

// Sync models
sequelize.sync({ alter: true }).then(() => console.log('All models synced'));

// MinIO bucket check
minioClient.bucketExists(process.env.MINIO_BUCKET, (err, exists) => {
  if (err) return console.error('MinIO error:', err);
  if (!exists) {
    minioClient.makeBucket(process.env.MINIO_BUCKET, 'us-east-1', err => {
      if (err) return console.error(err);
      console.log('MinIO bucket created');
    });
  } else {
    console.log('MinIO bucket exists');
  }
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/files', require('./routes/file.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
