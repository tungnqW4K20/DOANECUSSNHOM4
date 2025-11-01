import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        // Nếu không có token, chuyển hướng đến trang đăng nhập mới
        return <Navigate to="/auth/login" replace />;
    }

    return children;
};

export default ProtectedRoute;