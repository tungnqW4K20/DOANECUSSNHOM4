import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import Login from '../pages/Login';
import TongQuan from '../pages/TongQuan';
import DoanhNghiep from '../pages/DoanhNghiep';
import TienTe from '../pages/TienTe';
import DonViTinhHQ from '../pages/DonViTinhHQ';
import ToKhai from '../pages/theo-doi/ToKhai';
import AuditLog from '../pages/theo-doi/AuditLog';
import ThanhKhoanAdmin from '../pages/theo-doi/ThanhKhoan';


const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthLayout />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <TongQuan /> },
      { path: 'doanh-nghiep', element: <DoanhNghiep /> },
      { path: 'tien-te', element: <TienTe /> },
      { path: 'don-vi-tinh-hq', element: <DonViTinhHQ /> },
      { path: 'theo-doi/to-khai', element: <ToKhai /> },
      { path: 'theo-doi/audit-log', element: <AuditLog /> },
      { path: 'theo-doi/thanh-khoan', element: <ThanhKhoanAdmin /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default router;