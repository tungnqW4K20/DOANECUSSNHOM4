import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Route Protection
import ProtectedRoute from './ProtectedRoute';

// Auth Pages
import Login from '../pages/Login';
import Register from '../pages/Register';

// Main Pages
import TongQuan from '../pages/TongQuan';
import SanPham from '../pages/SanPham';
import HopDong from '../pages/HopDong';
import LoHang from '../pages/LoHang';
import NguyenPhuLieu from '../pages/NguyenPhuLieu';
import TyGia from '../pages/TyGia';
// import ToKhai from '../pages/ToKhai';
import QuanLyToKhaiNhap from '../pages/QuanLyToKhaiNhap';
import QuanLyToKhaiXuat from '../pages/QuanLyToKhaiXuat';
import NhapToKhaiNhap from '../pages/NhapToKhaiNhap';
import NhapToKhaiXuat from '../pages/NhapToKhaiXuat';
import Kho from '../pages/Kho';
import NhapKhoNPL from '../pages/kho/NhapKhoNPL';
import XuatKhoNPL from '../pages/kho/XuatKhoNPL';
import NhapKhoSP from '../pages/kho/NhapKhoSP';
import XuatKhoSP from '../pages/kho/XuatKhoSP';
import DinhMuc from '../pages/DinhMuc';
import QuyDoiDonVi from '../pages/QuyDoiDonVi';
import ThanhKhoan from '../pages/ThanhKhoan';

const router = createBrowserRouter([
  {
    // Các route cần bảo vệ sẽ nằm trong MainLayout
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      // Khi truy cập '/', tự động chuyển đến '/dashboard'
      { index: true, element: <Navigate to="/tong-quan" replace /> },    
      { path: 'tong-quan', element: <TongQuan /> },
      { path: 'hop-dong', element: <HopDong /> },
      { path: 'lo-hang', element: <LoHang /> },
      { path: 'san-pham', element: <SanPham /> },
      { path: 'nguyen-phu-lieu', element: <NguyenPhuLieu /> },
      { path: 'dinh-muc', element: <DinhMuc /> },
      // { path: 'to-khai', element: <ToKhai /> },
      { path: 'quan-ly-to-khai-nhap', element: <QuanLyToKhaiNhap /> },
      { path: 'quan-ly-to-khai-xuat', element: <QuanLyToKhaiXuat /> },
      { path: 'to-khai-nhap', element: <NhapToKhaiNhap /> },
      { path: 'to-khai-xuat', element: <NhapToKhaiXuat /> },
      { path: 'kho', element: <Kho /> },
      { path: 'kho/nhap-npl', element: <NhapKhoNPL /> },
      { path: 'kho/xuat-npl', element: <XuatKhoNPL /> },
      { path: 'kho/nhap-sp', element: <NhapKhoSP /> },
      { path: 'kho/xuat-sp', element: <XuatKhoSP /> },
      { path: 'thanh-khoan', element: <ThanhKhoan /> },
      { path: 'ty-gia', element: <TyGia /> },
      { path: 'quy-doi-don-vi', element: <QuyDoiDonVi /> },
    ],
  },
  {
    // Các route công khai sẽ nằm trong AuthLayout
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  // Nếu người dùng truy cập một route không tồn tại, có thể chuyển hướng họ
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);

export default router;