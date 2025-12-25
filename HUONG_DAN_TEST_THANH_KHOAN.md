# HƯỚNG DẪN TEST CHỨC NĂNG THANH KHOẢN

## 🔧 CÁC BƯỚC SỬA LỖI ĐÃ THỰC HIỆN

### 1. **Backend - Sửa logic cảnh báo NPL (Mẫu 15b)**
- ❌ Trước: So sánh `xuat_san_pham > nhap_khac` (SAI)
- ✅ Sau: So sánh `xuat_san_pham > tong_npl_kha_dung` (ĐÚNG)
- Thêm cảnh báo phát hiện sử dụng NPL không có nhập khẩu

### 2. **Backend - Sửa getBaoCaoById**
- Thêm parse JSON cho `data_snapshot` nếu là string
- Đảm bảo trả về đúng cấu trúc dữ liệu

### 3. **Frontend - Sửa handleViewReport**
- Reconstruct data từ `data_snapshot` đúng cách
- Thêm console.log để debug
- Đảm bảo 3 mảng dữ liệu được gán đúng

---

## 📋 CHUẨN BỊ TRƯỚC KHI TEST

### 1. Cập nhật Database Schema
```sql
-- Chạy migration để cập nhật bảng BaoCaoThanhKhoan
ALTER TABLE BaoCaoThanhKhoan 
ADD COLUMN tu_ngay DATE NOT NULL COMMENT 'Kỳ báo cáo: Từ ngày',
ADD COLUMN den_ngay DATE NOT NULL COMMENT 'Kỳ báo cáo: Đến ngày',
ADD COLUMN data_snapshot JSON COMMENT 'Lưu toàn bộ dữ liệu JSON của 3 mẫu báo cáo',
MODIFY COLUMN ket_luan_tong_the ENUM('HopLe','CanhBao','ViPham') DEFAULT 'HopLe';

-- Xóa các cột cũ không dùng nữa
ALTER TABLE BaoCaoThanhKhoan
DROP COLUMN tong_npl_nhap,
DROP COLUMN tong_npl_su_dung,
DROP COLUMN tong_npl_ton,
DROP COLUMN tong_sp_xuat;
```

### 2. Khởi động Backend
```bash
cd Backend
npm install
npm start
```

### 3. Khởi động Frontend
```bash
cd Frontend-User
npm install
npm run dev
```

---

## 🧪 KỊCH BẢN TEST

### **TEST 1: Tạo báo cáo thanh khoản mới**

**Bước 1:** Đăng nhập với tài khoản doanh nghiệp

**Bước 2:** Vào menu "Thanh khoản"

**Bước 3:** Chọn hợp đồng từ dropdown

**Bước 4:** Chọn kỳ báo cáo (từ ngày - đến ngày)

**Bước 5:** Click "Thực hiện Tính toán"

**Kết quả mong đợi:**
- ✅ Hiển thị 3 tab: Mẫu 15a, 15b, 16
- ✅ Mẫu 15a: Có danh sách SP đã xuất khẩu
- ✅ Mẫu 15b: Có danh sách NPL đã sử dụng
- ✅ Mẫu 16: Có bảng định mức
- ✅ Cảnh báo hiển thị nếu có tồn âm

**Debug:** Mở Console (F12) xem log:
```javascript
// Kiểm tra response từ API calculate
console.log('Response:', response)
console.log('baoCaoNXT_SP:', response.baoCaoNXT_SP)
console.log('baoCaoSD_NPL:', response.baoCaoSD_NPL)
console.log('dinhMucThucTe:', response.dinhMucThucTe)
```

---

### **TEST 2: Lưu báo cáo**

**Bước 1:** Sau khi tính toán xong, click "Lưu Báo cáo"

**Kết quả mong đợi:**
- ✅ Thông báo "Lưu báo cáo thành công!"
- ✅ Báo cáo xuất hiện trong bảng "Lịch sử các Báo cáo đã tạo"

**Kiểm tra Database:**
```sql
SELECT id_bc, id_hd, tu_ngay, den_ngay, ket_luan_tong_the, 
       JSON_LENGTH(data_snapshot, '$.baoCaoNXT_SP') as so_sp,
       JSON_LENGTH(data_snapshot, '$.baoCaoSD_NPL') as so_npl
FROM BaoCaoThanhKhoan
ORDER BY thoi_gian_tao DESC
LIMIT 1;
```

---

### **TEST 3: Xem chi tiết báo cáo đã lưu** ⭐ (Đã sửa lỗi này)

**Bước 1:** Trong bảng "Lịch sử", click nút "Xem chi tiết"

**Kết quả mong đợi:**
- ✅ Hiển thị đầy đủ 3 mẫu báo cáo
- ✅ Dữ liệu giống lúc vừa tạo
- ✅ Không bị trống

**Debug:** Mở Console xem log:
```javascript
// Kiểm tra response từ backend
console.log('Response from backend:', response)
console.log('Data snapshot:', response.data_snapshot)

// Kiểm tra data sau khi reconstruct
console.log('Reconstructed report data:', reportData)
console.log('baoCaoNXT_SP length:', reportData.baoCaoNXT_SP?.length)
console.log('baoCaoSD_NPL length:', reportData.baoCaoSD_NPL?.length)
```

**Nếu vẫn trống:**
1. Kiểm tra `data_snapshot` trong DB có dữ liệu không
2. Kiểm tra Console có lỗi parse JSON không
3. Kiểm tra cấu trúc `data_snapshot` có đúng không

---

### **TEST 4: Tìm kiếm và lọc báo cáo**

**Bước 1:** Nhập số hợp đồng vào ô tìm kiếm

**Bước 2:** Chọn filter "Kết luận" (Hợp lệ / Cảnh báo)

**Bước 3:** Click "Tìm kiếm"

**Kết quả mong đợi:**
- ✅ Danh sách được lọc đúng
- ✅ Phân trang hoạt động

---

### **TEST 5: Kiểm tra logic cảnh báo**

**Kịch bản A: Tồn kho SP âm**
- Tạo phiếu xuất SP nhiều hơn tồn kho
- Tính toán báo cáo
- ✅ Mẫu 15a phải có cảnh báo "Tồn kho âm"
- ✅ Kết luận tổng thể = "Cảnh báo"

**Kịch bản B: NPL sử dụng vượt quá khả dụng**
- Xuất SP nhưng không đủ NPL (tồn đầu + nhập trong kỳ)
- Tính toán báo cáo
- ✅ Mẫu 15b phải có cảnh báo "vượt quá tổng NPL khả dụng"

**Kịch bản C: Sử dụng NPL không nhập khẩu**
- Xuất SP nhưng không có phiếu nhập NPL
- ✅ Mẫu 15b phải có cảnh báo "không có nhập khẩu theo hợp đồng"

---

## 🐛 XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi 1: "Không thể tải danh sách hợp đồng"
**Nguyên nhân:** Token hết hạn hoặc không có hợp đồng
**Giải pháp:** 
- Đăng nhập lại
- Tạo hợp đồng mới trong menu "Hợp đồng"

### Lỗi 2: "Hợp đồng không tồn tại"
**Nguyên nhân:** Hợp đồng đã bị xóa
**Giải pháp:** Chọn hợp đồng khác

### Lỗi 3: Báo cáo trống (không có SP/NPL)
**Nguyên nhân:** 
- Không có hóa đơn xuất trong kỳ
- Không có lô hàng thuộc hợp đồng
**Giải pháp:**
- Tạo lô hàng cho hợp đồng
- Tạo hóa đơn xuất trong kỳ báo cáo

### Lỗi 4: Xem chi tiết báo cáo bị trống ⭐ (ĐÃ SỬA)
**Nguyên nhân:** Logic reconstruct data sai
**Giải pháp:** Đã sửa trong code, pull code mới nhất

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Database đã migrate schema mới
- [ ] Backend chạy không lỗi
- [ ] Frontend chạy không lỗi
- [ ] Có dữ liệu test: Hợp đồng, Lô hàng, SP, NPL, Định mức
- [ ] Có phiếu nhập/xuất kho
- [ ] Có hóa đơn nhập/xuất
- [ ] Test tạo báo cáo mới - PASS
- [ ] Test lưu báo cáo - PASS
- [ ] Test xem chi tiết báo cáo - PASS
- [ ] Test tìm kiếm/lọc - PASS
- [ ] Test logic cảnh báo - PASS

---

## 📞 HỖ TRỢ

Nếu gặp lỗi, kiểm tra:
1. Console Browser (F12) - Xem lỗi JavaScript
2. Network Tab - Xem request/response API
3. Backend logs - Xem lỗi server
4. Database - Kiểm tra dữ liệu

**Các API endpoint:**
- GET `/api/thanh-khoan/hop-dong` - Lấy danh sách HĐ
- POST `/api/thanh-khoan/calculate` - Tính toán BC
- POST `/api/thanh-khoan/save` - Lưu BC
- GET `/api/thanh-khoan/reports` - Danh sách BC
- GET `/api/thanh-khoan/reports/:id` - Chi tiết BC
