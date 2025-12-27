# Chức năng Xóa Báo cáo Thanh khoản

## Tổng quan
Đã thêm chức năng cho phép doanh nghiệp xóa báo cáo thanh khoản khi muốn sửa thông tin tờ khai nhập/xuất.

## Các thay đổi

### Backend

#### 1. Controller (`Backend/src/controllers/baocaothanhkhoan.controller.js`)
- **Thêm function mới**: `deleteBaoCao`
- **Cập nhật function**: `getThanhKhoanReports` - thêm tham số `id_hd`

#### 2. Routes (`Backend/src/routes/baocaothanhkhoan.routes.js`)
- **Thêm endpoint**: `DELETE /api/user/thanh-khoan/reports/:id_bc`

#### 3. Service (`Backend/src/services/baocaothanhkhoan.service.js`)
- **Thêm function**: `deleteBaoCao(id_bc)`
- **Cập nhật function**: `getThanhKhoanReports` - hỗ trợ lọc theo `id_hd`

### Frontend

#### 1. Service (`Frontend-User/src/services/baocaothanhkhoan.service.js`)
- **Thêm function**: `deleteReport(id_bc)`
- **Cập nhật function**: `getAllReports` - thêm tham số `id_hd`

#### 2. Component Thanh Khoản (`Frontend-User/src/pages/thanhtoan/ThanhKhoan.jsx`)
- Thêm nút "Xóa" với Popconfirm trong bảng báo cáo đã lưu
- Thêm function `handleDeleteReport(id_bc)`

#### 3. Component Quản lý Tờ khai (`Frontend-User/src/components/QuanLyToKhai.jsx`)
- Thêm tab "Báo cáo thanh khoản" trong drawer chi tiết tờ khai
- Hiển thị danh sách báo cáo liên quan đến hợp đồng
- Cho phép xóa báo cáo trực tiếp từ màn hình quản lý tờ khai
- Thêm các function:
  - `loadBaoCaoThanhKhoan(id_hd)`: Load báo cáo theo hợp đồng
  - `handleDeleteBaoCao(id_bc, id_hd)`: Xóa báo cáo
  - `renderKetLuan(ketLuan)`: Render tag kết luận
  - `renderTrangThai(trangThai)`: Render tag trạng thái

## Luồng hoạt động

### 1. Xem báo cáo từ tờ khai
1. Mở chi tiết tờ khai
2. Chuyển sang tab "Báo cáo thanh khoản"
3. Hệ thống tự động load báo cáo liên quan đến hợp đồng

### 2. Xóa báo cáo
1. Click nút "Xóa" trên báo cáo
2. Xác nhận trong Popconfirm
3. Báo cáo bị xóa và danh sách được reload

## Sửa lỗi

### Lỗi: "Cannot access 'loadBaoCaoThanhKhoan' before initialization"
**Nguyên nhân**: Function `showDrawer` được khai báo trước `loadBaoCaoThanhKhoan` nhưng lại gọi nó.

**Giải pháp**: 
1. Di chuyển `loadBaoCaoThanhKhoan` và `handleDeleteBaoCao` lên trước `showDrawer`
2. Chuyển `renderKetLuan` và `renderTrangThai` thành `useCallback`
3. Thêm các function vào dependency array của `baoCaoColumns`

**Kết quả**: Lỗi đã được khắc phục.

## Ghi chú
- Chỉ doanh nghiệp có quyền xóa báo cáo của mình
- Báo cáo bị xóa không thể khôi phục
- Sau khi xóa, có thể sửa tờ khai và tạo báo cáo mới
