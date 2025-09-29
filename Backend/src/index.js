require('dotenv').config();
const corsMiddleware = require('./config/cors.config');
const express = require('express');
const path = require('path');
const db = require('./models');

const authRoutes = require('./routes/auth.routes');
const uploadRoutes = require('./routes/upload.routes');
const doanhnghiepRoutes = require('./routes/doanhnghiep.routes')
const tienteRoutes = require('./routes/tiente.routes')
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(corsMiddleware);
app.use(express.json()); 
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes); 
app.use('/api/uploads', uploadRoutes);
app.use('/api/doanh-nghiep',doanhnghiepRoutes)
app.use('/api/tiente',tienteRoutes)

// --- Kết nối DB và khởi động Server ---
db.sequelize.authenticate()
  .then(() => {
    console.log(' Kết nối MySQL thành công!');
    //return db.sequelize.sync(); // có thể dùng { alter: true } trong dev
     return db.sequelize.sync({ alter: true })
  })

  .then(() => {
    console.log('✅ Đồng bộ bảng thành công!');

    

    app.listen(port, () => {
      console.log(` Server chạy tại http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error(' Lỗi khởi tạo:', err);
    process.exit(1);
  });

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).send('Có lỗi xảy ra!');
});

