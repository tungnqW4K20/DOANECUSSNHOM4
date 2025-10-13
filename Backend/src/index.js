require('dotenv').config();
const corsMiddleware = require('./config/cors.config');
const express = require('express');
const path = require('path');
const db = require('./models');

const authRoutes = require('./routes/auth.routes');
const uploadRoutes = require('./routes/upload.routes');
const doanhnghiepRoutes = require('./routes/doanhnghiep.routes')
const tienteRoutes = require('./routes/tiente.routes')
const tygiaRoutes = require('./routes/tygia.routes')
const donvitinhHaiQuanRoutes = require('./routes/donvitinhHaiQuan.routes')
const QuyDoiDonViSPRoutes = require('./routes/quydoi_sp.routes')
const QuyDoiDonViDNRoutes = require('./routes/quydoi_dn.routes')
const dinhmucRoutes = require('./routes/dinhmuc.route')
const nguyenlieuRoutes = require('./routes/nguyenlieu.route')
const hopdongRoutes = require('./routes/hopdong.route')

const SanPhamRoutes = require('./routes/sanpham.route')

const scheduleTyGiaUpdate = require('./cron/tygia.cron');

// const donvitinhhaiquanRoutes = require('./routes/dvtinh.routes')

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
app.use('/api/tygia', tygiaRoutes)

app.use('/api/don-vi-tinh-hai-quan',donvitinhHaiQuanRoutes )
app.use('/api/quydoidonvisanpham',QuyDoiDonViSPRoutes )
app.use('/api/quydoidonvidoanhnghiep',QuyDoiDonViDNRoutes )
app.use('/api/dinh-muc',dinhmucRoutes )
app.use('/api/nguyen-lieu',nguyenlieuRoutes )
app.use('/api/hop-dong', hopdongRoutes )

app.use('/api/san-pham',SanPhamRoutes )

// --- Kết nối DB và khởi động Server ---
db.sequelize.authenticate()
  .then(() => {
    console.log(' Kết nối MySQL thành công!');
    return db.sequelize.sync(); // có thể dùng { alter: true } trong dev
     //return db.sequelize.sync({ alter: true })
  })

  .then(() => {
    console.log('✅ Đồng bộ bảng thành công!');

    

    app.listen(port, () => {
      console.log(` Server chạy tại http://localhost:${port}`);
      scheduleTyGiaUpdate(); 
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

