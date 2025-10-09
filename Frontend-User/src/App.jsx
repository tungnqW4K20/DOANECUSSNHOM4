import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home.jsx';
import './css/header_footer.css';
import logo from './assets/Logo_Header.svg';
import shipBanner from './assets/Header_Ship_New.jpg';
import paymentMethods from './assets/payment-methods.png';
import Login from './Login.jsx';
import Signup from './Signup.jsx';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleSearch = () => setShowSearch(!showSearch);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Tìm kiếm:", searchValue);
    // 🔍 Ở đây bạn có thể chuyển hướng đến trang kết quả tìm kiếm hoặc gọi API tìm
  };

  return (
    <Router>
      <div>
        {/* HEADER */}
        <header className="header-ecus">
          {/* --- BANNER HÌNH TÀU (LÀ NỀN) --- */}
          <div className="banner-header">
            <img src={shipBanner} alt="Banner tàu ECUS" />
          </div>

          {/* --- HÀNG TRÊN: LOGO + HOTLINE (ĐÈ LÊN BANNER) --- */}
          <div className="top-header">
            <div className="container-header">
              <Link to="/" className="logo-block">
                <img src={logo} alt="ECUS Logo" />
              </Link>

              <div className="hotline">
                <i className="fa-solid fa-phone"></i>
                <div>
                  <p>Miền Bắc: <span>1900.4767</span></p>
                  <p>Trung, Nam: <span>1900.4768</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* --- THANH MENU CHÍNH --- */}
          <nav className="main-nav">
            <ul>
              <li><Link to="/">GIỚI THIỆU</Link></li>
              <li><Link to="/features">TÍNH NĂNG</Link></li>
              <li><Link to="/experience">KINH NGHIỆM</Link></li>
              <li><Link to="/guide">HƯỚNG DẪN</Link></li>
              <li><Link to="/pricing">BÁO GIÁ</Link></li>
              <li><Link to="/news">TIN TỨC</Link></li>
              <li><Link to="/documents">VĂN BẢN</Link></li>
              <li><Link to="/contact">LIÊN HỆ</Link></li>

              {/* --- ICON TÌM KIẾM --- */}
              <li className="search">
                <i
                  className="fa-solid fa-magnifying-glass"
                  onClick={() => setShowSearch(!showSearch)}
                ></i>
              </li>
              {/* --- KHUNG TÌM KIẾM HIỂN THỊ TRONG MAIN-NAV --- */}
              {showSearch && (
                <div className="search-box">
                  <input type="text" placeholder="Nhập từ khóa tìm kiếm..." />
                  <button>Tìm</button>
                </div>
              )}
              {/* --- NÚT ĐĂNG NHẬP / ĐĂNG KÝ --- */}
              <li className="auth-buttons">
                <Link to="/login" className="btn-login">Đăng nhập</Link>
                <Link to="/register" className="btn-register">Đăng ký</Link>
              </li>
            </ul>
          </nav>
        </header>
        {/* MAIN CONTENT */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contracts" element={<div>Trang Quản lý hợp đồng SX-XK</div>} />
          <Route path="/materials" element={<div>Trang Nhập khẩu nguyên liệu</div>} />
          <Route path="/production" element={<div>Trang Theo dõi sản xuất</div>} />
          <Route path="/export" element={<div>Trang Quản lý xuất khẩu</div>} />
          <Route path="/reports" element={<div>Trang Báo cáo & Thanh khoản</div>} />
          <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        </Routes>


        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-content container">
            <div className="columns-footer">
              {/* Cột 1: Logo và mô tả */}
              <div className="column">
                <Link to="/" className="container-logo">
                  <img src={logo} alt="Logo ECUSS" />
                </Link>
                <p>
                  Hệ thống phần mềm <strong>Thanh khoản hợp đồng sản xuất xuất khẩu (ECUSS)</strong> 
                  giúp doanh nghiệp quản lý toàn bộ quy trình sản xuất xuất khẩu — từ nhập nguyên liệu, 
                  sản xuất đến xuất khẩu thành phẩm và quyết toán với Hải quan.
                </p>
                <div className="container-social-links">
                  <span>Kết nối với chúng tôi: </span>
                  <div className="links">
                    <a href="#"><i className="fab fa-facebook"></i></a>
                    <a href="#"><i className="fab fa-linkedin"></i></a>
                    <a href="#"><i className="fab fa-youtube"></i></a>
                  </div>
                </div>
              </div>

              {/* Cột 2: Giới thiệu hệ thống */}
              <div className="column">
                <span>Về ECUSS</span>
                <ul>
                  <li><Link to="/gioi-thieu">Giới thiệu hệ thống</Link></li>
                  <li><Link to="/tin-tuc">Tin tức & cập nhật</Link></li>
                  <li><Link to="/doi-tac">Đối tác triển khai</Link></li>
                  <li><Link to="/chinh-sach">Chính sách bảo mật</Link></li>
                  <li><Link to="/dieu-khoan">Điều khoản sử dụng</Link></li>
                </ul>
              </div>

              {/* Cột 3: Hướng dẫn và hỗ trợ */}
              <div className="column">
                <span>Hỗ trợ người dùng</span>
                <ul>
                  <li><Link to="/huong-dan">Hướng dẫn sử dụng</Link></li>
                  <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
                  <li><Link to="/lien-he">Liên hệ hỗ trợ kỹ thuật</Link></li>
                </ul>
              </div>

              {/* Cột 4: Nghiệp vụ chính */}
              <div className="column">
                <span>Nghiệp vụ chính</span>
                <ul>
                  <li>Quản lý hợp đồng sản xuất – xuất khẩu</li>
                  <li>Theo dõi nhập khẩu nguyên liệu</li>
                  <li>Quản lý định mức và sản xuất</li>
                  <li>Xuất khẩu thành phẩm</li>
                  <li>Báo cáo thanh khoản – quyết toán Hải quan</li>
                </ul>
              </div>
            </div>

            <p className="copyright">
              &copy; 2025 ECUSS | Phát triển bởi Nhóm Đề tài 3 – Hệ thống Thanh khoản Hợp đồng SX-XK
            </p>
          </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;