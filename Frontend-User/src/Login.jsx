// src/pages/Login.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/auth.css";
import logo from './assets/Logo_Header.svg';

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Đăng nhập:", form);
    // Gọi API login tại đây sau này
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="ECUSS Logo" className="auth-logo" />
          <h2>HỆ THỐNG THANH KHOẢN HỢP ĐỒNG SẢN XUẤT XUẤT KHẨU</h2>
          <p>Đăng nhập để quản lý và theo dõi hoạt động SX-XK của doanh nghiệp</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email đăng nhập</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="example@company.vn"
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button type="submit" className="btn-Login">Đăng nhập</button>
        </form>

        <div className="auth-footer">
          <p>
            Chưa có tài khoản?{" "}
            <Link to="/register">Đăng ký ngay</Link>
          </p>
          <Link to="/forgot-password" className="forgot-link">
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
