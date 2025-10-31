// src/routes/guards/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuthStore();

  // Nếu chưa đăng nhập → đẩy về login
  if (!isAuthenticated) {
    return <Navigate to="/vi/auth/login" replace />;
  }

  // Nếu đã đăng nhập → cho phép truy cập các route con
  return <Outlet />;
};

export default PrivateRoute;