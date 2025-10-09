// src/pages/Signup.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/auth.css";
import logo from './assets/Logo_Header.svg';

function Signup() {
  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Đăng ký:", form);
    // TODO: Gọi API signup
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="ECUSS Logo" className="auth-logo" />
          <h2>ĐĂNG KÝ TÀI KHOẢN DOANH NGHIỆP</h2>
          <p>
            Tham gia hệ thống ECUSS để quản lý hợp đồng, nguyên liệu và thanh khoản SX-XK
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Tên doanh nghiệp</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              placeholder="VD: Công ty TNHH ABC"
            />
          </div>

          <div className="form-group">
            <label>Họ và tên người đại diện</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Nhập họ và tên"
            />
          </div>

          <div className="form-group">
            <label>Email liên hệ</label>
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
              placeholder="Tạo mật khẩu"
            />
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Nhập lại mật khẩu"
            />
          </div>

          <button type="submit" className="btn-Login">
            Đăng ký
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Đã có tài khoản?{" "}
            <Link to="/login">Đăng nhập ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
