# 🎓 Doan4_FE_ADMIN

## 📖 Giới thiệu
Dự án **Frontend giao diện quản trị** cho đồ án tốt nghiệp, được xây dựng bằng **Next.js** và **ReactJS**.  
Giao diện được thiết kế thân thiện, dễ mở rộng, hỗ trợ đa ngôn ngữ và quản lý nhiều nghiệp vụ khác nhau như hàng hóa, doanh nghiệp, hợp đồng, tờ khai, vận đơn, hóa đơn, tỷ giá, v.v.

---

## 🚀 Tính năng chính
- Quản trị người dùng và phân quyền truy cập  
- Quản lý danh mục (doanh nghiệp, hải quan, đơn vị tính, sản phẩm, nguyên phụ liệu, định mức sản phẩm, quy đổi đơn vị, v.v.)  
- Quản lý nghiệp vụ (hợp đồng, lô hàng, hóa đơn nhập/xuất, tờ khai, vận đơn, tỷ giá, tiền tệ, v.v.)  
- Giao diện hiện đại sử dụng **Ant Design**  
- Hỗ trợ **đa ngôn ngữ (Việt – Anh)**  
- Cấu trúc module rõ ràng, dễ bảo trì và phát triển

---

## 🧩 Công nghệ sử dụng
- **Next.js 14**
- **ReactJS**
- **Ant Design**
- **SCSS modules**
- **React Query**
- **Yarn**

---

## ⚙️ Hướng dẫn cài đặt và chạy dự án

###  Bước 1: Cài đặt thư viện
```bash
yarn install
```
### Bước 2: Chạy dự án
```bash
yarn dev
```

Sau khi chạy, mở trình duyệt tại http://localhost:3000

### 💻 Yêu cầu hệ thống
- Node.js >= 18

- Yarn >= 1.22

- Trình duyệt Chrome, Edge hoặc Firefox bản mới nhất

### 📂 Cấu trúc thư mục
```bash
Doan4_FE_ADMIN
├─ src
│  ├─ app
│  │  ├─ layout.tsx
│  │  ├─ not-found.tsx
│  │  ├─ page.tsx
│  │  └─ [locale]    -- CHỨA GIAO DIỆN
│  │     ├─ AppProvider.tsx
│  │     ├─ auth
│  │     │  ├─ login
│  │     │  │  └─ page.tsx  -- TÊN BẮT BUỘC LÀ PAGE ĐỂ CÓ THỂ TỰ BẮT ROUTER
│  │     │  ├─ register
│  │     │  │  └─ page.tsx
│  │     │  └─ resetPassword
│  │     │     └─ page.tsx
│  │     ├─ dashboard
│  │     │  └─ page.tsx
│  │     ├─ layout.tsx
│  │     ├─ page.tsx
│  │     ├─ QuanLyDanhMuc
│  │     │  ├─ QuanLyCoSo
│  │     │  │  ├─ DoanhNghiep
│  │     │  │  │  └─ page.tsx
│  │     │  │  ├─ DonViTinhHQ
│  │     │  │  │  └─ page.tsx
│  │     │  │  └─ HaiQuan
│  │     │  │     └─ page.tsx
│  │     │  ├─ QuanLyHangHoa
│  │     │  │  ├─ DinhMucSanPham
│  │     │  │  │  └─ page.tsx
│  │     │  │  ├─ NguyenPhuLieu
│  │     │  │  │  └─ page.tsx
│  │     │  │  ├─ QuyDoiDonViSP
│  │     │  │  │  └─ page.tsx
│  │     │  │  └─ SanPham
│  │     │  │     └─ page.tsx
│  │     │  ├─ QuanLyTaiChinh
│  │     │  │  ├─ TienTe
│  │     │  │  │  └─ page.tsx
│  │     │  │  └─ TyGia
│  │     │  │     └─ page.tsx
│  │     │  └─ QuyDoiDonViDN
│  │     │     └─ page.tsx
│  │     └─ QuanLyNghiepVu
│  │        ├─ HopDong-LoHang
│  │        │  ├─ HopDong
│  │        │  │  └─ page.tsx
│  │        │  └─ LoHang
│  │        │     └─ page.tsx
│  │        ├─ QuanLyHoaDon
│  │        │  ├─ HoaDonNhap
│  │        │  │  └─ page.tsx
│  │        │  └─ HoaDonXuat
│  │        │     └─ page.tsx
│  │        ├─ QuanLyToKhai
│  │        │  ├─ ToKhaiNhap
│  │        │  │  └─ page.tsx
│  │        │  └─ ToKhaiXuat
│  │        │     └─ page.tsx
│  │        └─ QuanLyVanDon
│  │           ├─ VanDonNhap
│  │           │  └─ page.tsx
│  │           └─ VanDonXuat
│  │              └─ page.tsx
│  │  ├─ images
│  │  │  ├─ auth
│  │  │  │  └─ login-bg.jpeg
│  │  │  ├─ avatars
│  │  │  │  ├─ avatar.jpg
│  │  │  │  └─ default.png
│  │  │  ├─ default
│  │  │  │  └─ no-image.png
│  │  │  ├─ login
│  │  │  │  ├─ login1.png
│  │  │  │  ├─ login2.png
│  │  │  │  └─ login3.png
│  │  │  └─ logo
│  │  │     ├─ logo.jpeg
│  │  │     ├─ logo1.jpg
│  │  │     ├─ logo2.jpg
│  │  │     ├─ logo3.png
│  │  │     ├─ logo4.png
│  │  │     ├─ logo5.png
│  │  │     └─ logo6.png
│  │  ├─ scss
│  │  │  ├─ reset.scss
│  │  │  ├─ rules.scss
│  │  │  ├─ _global.scss
│  │  │  └─ _variables.scss
│  │  └─ svg
│  │     ├─ brand
│  │     │  ├─ brand-dark.svg
│  │     │  ├─ brand-light.svg
│  │     │  └─ brand-mobile.svg
│  │     ├─ index
│  │     │  └─ index.ts
│  │     └─ languages
│  │        ├─ en.svg
│  │        └─ vn.svg
│  ├─ components
│  │  ├─ DinhMucSanPham
│  │  │  ├─ component
│  │  │  │  ├─ form.tsx
│  │  │  │  ├─ mockData.ts
│  │  │  │  └─ table.tsx
│  │  │  └─ index.tsx
│  │  ├─ DoanhNghiep
│  │  │  ├─ component
│  │  │  │  ├─ form.tsx
│  │  │  │  └─ table.tsx
│  │  │  └─ index.tsx
│  │  ├─ DonViTinh
│  │  │  ├─ component
│  │  │  │  ├─ form.tsx
│  │  │  │  ├─ mockData_HaiQuan.ts
│  │  │  │  └─ table.tsx
│  │  │  └─ index.tsx
│  │  ├─ HaiQuan
│  │  │  ├─ component
│  │  │  │  ├─ form.tsx
│  │  │  │  ├─ mockData_HaiQuan.ts
│  │  │  │  └─ table.tsx
│  │  │  └─ index.tsx
│  │  ├─ HoaDonNhap
│  │  │  ├─ components
│  │  │  │  ├─ form.tsx
│  │  │  │  ├─ mockData.ts
│  │  │  │  └─ table.tsx
│  │  │  └─ index.tsx
│  │  ├─ HoaDonXuat
│  │  │  ├─ components
│  │  │  │  ├─ form.tsx
│  │  │  │  ├─ mockData.ts
│  │  │  │  └─ table.tsx
│  │  │  └─ index.tsx
│  │  ├─ HopDong
│  │  │  ├─ components
│  │  │  │  ├─ form.tsx
│  │  │  │  ├─ mockData.ts
│  │  │  │  └─ table.tsx
│  │  │  └─ index.tsx
│  │  ├─ LoHang
│  │  │  ├─ component
│  │  │  │  ├─ form.tsx
│  │  │  │  ├─ mockData.ts
│  │  │  │  └─ table.tsx
│  │  │  └─ index.tsx
│  │  ├─ NguyenPhuLieu
│  │  │  ├─ components
│  │  │  │  ├─ form.tsx
│  │  │  │  ├─ mockData.ts
│  │  │  │  └─ table.tsx
│  │  │  └─ index.tsx
│  │  ├─ QuyDoiDonViDN
│  │  │  ├─ components
│  │  │  │  ├─ form.tsx
│  │  │  │  ├─ mockData_HaiQuan.ts
│  │  │  │  └─ table.tsx
│  │  │  └─ index.tsx
│  │  ├─ QuyDoiDonViSP
│  │  │  ├─ component
│  │  │  │  ├─ form.tsx
│  │  │  │  ├─ mockData.ts
│  │  │  │  └─ table.tsx
│  │  │  └─ index.tsx
│  │  ├─ SanPham
│  │  │  ├─ components
│  │  │  │  ├─ form.tsx
│  │  │  │  ├─ mockData.ts
│  │  │  │  └─ table.tsx
│  │  │  └─ index.tsx
│  │  ├─ TienTe
│  │  │  ├─ components
│  │  │  │  ├─ form.tsx
│  │  │  │  ├─ mockData_TienTe.ts
│  │  │  │  └─ table.tsx
│  │  │  └─ index.tsx
│  │  ├─ ToKhaiNhap
│  │  │  ├─ components
│  │  │  │  ├─ form.tsx
│  │  │  │  ├─ mockData.ts
│  │  │  │  └─ table.tsx
│  │  │  └─ index.tsx
│  │  ├─ ToKhaiXuat
│  │  │  ├─ components
│  │  │  │  ├─ form.tsx
│  │  │  │  ├─ mockData.ts
│  │  │  │  └─ table.tsx
│  │  │  └─ index.tsx
│  │  ├─ TyGia
│  │  │  ├─ components
│  │  │  │  ├─ form.tsx
│  │  │  │  ├─ mockData.ts
│  │  │  │  └─ table.tsx
│  │  │  └─ index.tsx
│  │  ├─ UI_shared        -- CÁC GIAO DIỆN DÙNG CHUNG
│  │  │  ├─ Children_Head.tsx
│  │  │  ├─ ColumType.tsx
│  │  │  ├─ ExportExcel.tsx
│  │  │  ├─ Notification.tsx
│  │  │  ├─ Product_Customer_Modal.tsx
│  │  │  └─ Table.tsx
│  │  ├─ VanDonNhap
│  │  │  ├─ components
│  │  │  │  ├─ form.tsx
│  │  │  │  ├─ mockData.ts
│  │  │  │  └─ table.tsx
│  │  │  └─ index.tsx
│  │  └─ VanDonXuat
│  │     ├─ components
│  │     │  ├─ form.tsx
│  │     │  ├─ mockData.ts
│  │     │  └─ table.tsx
│  │     └─ index.tsx
│  ├─ constants
│  │  ├─ config.ts
│  │  └─ theme.ts
│  ├─ i18n.ts
│  ├─ libs
│  │  ├─ api
│  │  │  └─ auth.api.ts
│  │  ├─ api.ts
│  │  ├─ call_API.ts
│  │  ├─ db.ts
│  │  └─ react-query.ts
│  ├─ middleware.ts
│  ├─ models
│  │  ├─ DinhMucSanPham.model.ts
│  │  ├─ DoanhNghiep_DTO.ts
│  │  ├─ DonViTinh_DTO.ts
│  │  ├─ HaiQuan.tsx
│  │  ├─ HoaDonNhap.model.ts
│  │  ├─ HoaDonXuat.model.ts
│  │  ├─ HopDong.model.ts
│  │  ├─ language-switcher.d.ts
│  │  ├─ LoHang.model.ts
│  │  ├─ NguyenPhuLieu_DTO.ts
│  │  ├─ QuyDoiDonViSP.model.ts
│  │  ├─ SanPham_DTO .ts
│  │  ├─ sign_away.model.ts
│  │  ├─ TienTe_DTO.tsx
│  │  ├─ ToKhaiNhap.model.ts
│  │  ├─ ToKhaiXuat.model.ts
│  │  ├─ TyGia_DTO.ts
│  │  ├─ UpQuyDoiDonViDN_DTO .ts
│  │  ├─ VanDonNhap.model.ts
│  │  └─ VanDonXuat.model.ts
│  ├─ modules
│  │  └─ shared
│  │     ├─ changetheme
│  │     │  └─ index.tsx
│  │     ├─ customerLink
│  │     │  └─ customerLinkHooks.ts
│  │     ├─ document
│  │     │  └─ add_documentHooks.ts
│  │     ├─ footer
│  │     │  └─ Footer.tsx
│  │     ├─ header
│  │     │  ├─ Header.module.scss
│  │     │  └─ Header.tsx
│  │     ├─ languages-switcher
│  │     │  ├─ LanguagesSwitcher.module.scss
│  │     │  └─ LanguagesSwitcher.tsx
│  │     └─ siderbar
│  │        ├─ siderbar.module.scss
│  │        └─ siderbar.tsx
│  ├─ stores
│  │  └─ color.store.ts
│  └─ utils     -- CHỨA CÁC validator 
│     ├─ colors.ts
│     ├─ date.ts
│     ├─ format-string.ts
│     ├─ image.ts
│     ├─ loadable.tsx
│     ├─ modal.ts
│     ├─ navigate.ts
│     ├─ path.ts
│     ├─ react-quill.ts
│     ├─ storage.ts
│     └─ validator.ts
├─ tsconfig.json
└─ yarn.lock

```