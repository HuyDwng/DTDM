const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const { connectDB, sequelize } = require('./config/db');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // nếu muốn dùng cookie/token sau này
}));

app.use(express.json());

// Connect MySQL
connectDB();

// Đồng bộ model với DB
sequelize.sync({ alter: true }).then(() => {
  console.log('All models synced');
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
