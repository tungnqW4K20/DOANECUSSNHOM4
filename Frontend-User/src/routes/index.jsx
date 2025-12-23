import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Route Protection
import ProtectedRoute from './ProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Dashboard Pages
import TongQuan from '../pages/dashboard/TongQuan';

// Danh Muc Pages
import SanPham from '../pages/danhmuc/SanPham';
import NguyenPhuLieu from '../pages/danhmuc/NguyenPhuLieu';
import DinhMuc from '../pages/danhmuc/DinhMuc';
import QuyDoiDonVi from '../pages/danhmuc/QuyDoiDonVi';
import TyGia from '../pages/danhmuc/TyGia';

// Hop Dong Pages
import HopDong from '../pages/hopdong/HopDong';
import LoHang from '../pages/hopdong/LoHang';

// To Khai Pages
// import ToKhai from '../pages/tokhai/ToKhai';
import QuanLyToKhaiNhap from '../pages/tokhai/QuanLyToKhaiNhap';
import QuanLyToKhaiXuat from '../pages/tokhai/QuanLyToKhaiXuat';
import NhapToKhaiNhap from '../pages/tokhai/NhapToKhaiNhap';
import NhapToKhaiXuat from '../pages/tokhai/NhapToKhaiXuat';

// Kho Pages
import Kho from '../pages/kho/Kho';
import NhapKhoNPL from '../pages/kho/NhapKhoNPL';
import XuatKhoNPL from '../pages/kho/XuatKhoNPL';
import NhapKhoSP from '../pages/kho/NhapKhoSP';
import XuatKhoSP from '../pages/kho/XuatKhoSP';

// Thanh Toan Pages
import ThanhKhoan from '../pages/thanhtoan/ThanhKhoan';

// User Pages
import Profile from '../pages/user/Profile';

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
      { path: 'profile', element: <Profile /> },
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