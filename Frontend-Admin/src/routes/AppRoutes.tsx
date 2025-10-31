// src/routes/AppRoutes.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import { DASHBOARD_PATH, LOGIN_PATH, QL_COSO_DOANHNGHIEP_PATH, QL_COSO_DONVITINHHQ_PATH, QL_TAICHINH_TIENTE_PATH } from '../utils/path';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import PrivateRoute from '../guards/PrivateRoute';
import DoanhNghiepPage from '../pages/DoanhNghiepPage';
import DonViTinhHQPage from '../pages/DonViTinhHQPage';
import TienTePage from '../pages/TienTePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        element: <PrivateRoute />,
        children: [
          { path: DASHBOARD_PATH, element: <Dashboard /> },
          { path: QL_COSO_DOANHNGHIEP_PATH, element: <DoanhNghiepPage /> },
          { path: QL_COSO_DONVITINHHQ_PATH, element: <DonViTinhHQPage /> },
          { path: QL_TAICHINH_TIENTE_PATH, element: <TienTePage /> }


        ],
      },
    ],
  },
  { path: LOGIN_PATH, element: <Login /> },
  { path: '*', element: <NotFound /> },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;