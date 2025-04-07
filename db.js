const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');

// 检查是否在 Vercel 环境
const isVercel = process.env.VERCEL === '1';

// 数据库连接配置
let db;

if (isVercel) {
  // 在 Vercel 上使用 MongoDB
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-username:your-password@your-cluster.mongodb.net/autoganttchart?retryWrites=true&w=majority';
  
  // 连接 MongoDB
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
  
  // 导出 mongoose 连接
  db = mongoose;
} else {
  // 本地开发使用 SQLite
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
  
  // 测试连接
  sequelize.authenticate()
    .then(() => console.log('SQLite database connected'))
    .catch(err => console.error('SQLite connection error:', err));
  
  // 导出 Sequelize 实例
  db = sequelize;
}

module.exports = db; 