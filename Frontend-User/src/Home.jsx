import { Link } from 'react-router-dom';
import './css/home.css';
import './css/global.css';

// Giả định các ảnh minh họa (bạn có thể thay bằng ảnh thật)
import heroMain from './assets/img/home/about.avif';
import hero1 from './assets/img/home/about.avif';
import hero2 from './assets/img/home/about.avif';
import hero3 from './assets/img/home/about.avif';
import hero4 from './assets/img/home/about.avif';
import aboutImage from './assets/img/home/about.avif';
import testimonial1 from './assets/img/home/about.avif';
import testimonial2 from './assets/img/home/about.avif';
import testimonial3 from './assets/img/home/about.avif';

function Home() {
  return (
    <>
      {/* HERO BANNER */}
      <section className="container hero-banner">
        <div className="content">
          <span>Giải pháp quản lý xuất nhập khẩu</span>
          <h1>ECUSS – Hệ thống quản lý và thanh khoản hợp đồng SX-XK</h1>
          <p>
            Nền tảng hỗ trợ doanh nghiệp theo dõi toàn bộ quy trình từ nhập khẩu nguyên liệu,
            sản xuất, xuất khẩu đến thanh khoản hợp đồng với cơ quan Hải quan.
            Tối ưu quy trình, giảm sai sót và tăng hiệu quả quản trị.
          </p>
          <div className="buttons-hero-banner">
            <Link to="/contracts" className="btn btn-banner-primary">
              Đăng nhập
            </Link>
            <Link to="/about" className="btn btn-banner-secondary">
              Đăng ký
            </Link>
          </div>
        </div>
        <div className="container-images-banner">
          <div className="container-main-image">
            <img src={heroMain} alt="Hệ thống ECUSS" className="main-image" />
          </div>
          <img src={hero1} alt="Minh họa 1" />
          <img src={hero2} alt="Minh họa 2" />
          <img src={hero3} alt="Minh họa 3" />
          <img src={hero4} alt="Minh họa 4" />
        </div>
      </section>

      {/* SECTION ABOUT */}
      <section className="container section-about">
        <div className="container-img">
          <img src={aboutImage} alt="Giới thiệu ECUSS" />
        </div>
        <div className="content-about">
          <span>Về hệ thống</span>
          <h2 className="title">Câu chuyện phát triển của ECUSS</h2>
          <p>
            ECUSS được xây dựng nhằm giúp doanh nghiệp dễ dàng quản lý hợp đồng sản xuất xuất khẩu,
            kiểm soát nguyên liệu nhập khẩu, và thực hiện thanh khoản nhanh chóng – chính xác với Hải quan.
          </p>
          <ul>
            <li>
              <div className="container-icon">
                <i className="fas fa-database"></i>
              </div>
              Quản lý tập trung dữ liệu hợp đồng & nguyên liệu
            </li>
            <li>
              <div className="container-icon">
                <i className="fas fa-file-invoice-dollar"></i>
              </div>
              Tự động hóa quy trình báo cáo và thanh khoản
            </li>
          </ul>
          <Link to="/about">Xem chi tiết</Link>
        </div>
      </section>

      {/* SECTION MODULES */}
      <section className="container section-top-destination">
        <h2 className="title">Các phân hệ chính của hệ thống</h2>
        <p>
          ECUSS bao gồm nhiều module giúp doanh nghiệp theo dõi toàn bộ vòng đời của hợp đồng:
          từ khâu nhập khẩu nguyên liệu, quản lý sản xuất, xuất khẩu cho đến thanh khoản.
        </p>
        <div className="container-destination">
          <div className="card-destination img-background-1">
            <div className="content-card">
              <span className="location">
                <i className="fa-solid fa-file-contract"></i> Hợp đồng SX-XK
              </span>
              <h3>Quản lý hợp đồng sản xuất xuất khẩu</h3>
              <div className="footer-card-destination">
                <span className="price">Tình trạng: Đang hoạt động</span>
                <span className="capacity-person">
                  Người quản lý: 5 <i className="fa-solid fa-user-group"></i>
                </span>
              </div>
            </div>
          </div>
          <div className="card-destination img-background-2">
            <div className="content-card">
              <span className="location">
                <i className="fa-solid fa-boxes-packing"></i> Nguyên liệu
              </span>
              <h3>Quản lý nhập khẩu và sử dụng nguyên liệu</h3>
              <div className="footer-card-destination">
                <span className="price">Cập nhật: Hàng ngày</span>
                <span className="capacity-person">
                  Kho: 3 <i className="fa-solid fa-warehouse"></i>
                </span>
              </div>
            </div>
          </div>
          <div className="card-destination img-background-3">
            <div className="content-card">
              <span className="location">
                <i className="fa-solid fa-industry"></i> Sản xuất
              </span>
              <h3>Theo dõi quá trình sản xuất & xuất khẩu</h3>
              <div className="footer-card-destination">
                <span className="price">Báo cáo tự động</span>
                <span className="capacity-person">
                  10 nhân viên <i className="fa-solid fa-user"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION ADVANTAGES */}
      <section className="container section-tours">
        <h2 className="title">Lợi ích nổi bật khi sử dụng ECUSS</h2>
        <p>
          Hệ thống ECUSS được thiết kế để đáp ứng nhu cầu quản lý toàn diện của doanh nghiệp sản xuất xuất khẩu.
          Giúp tiết kiệm thời gian, giảm chi phí, và tăng độ chính xác trong thanh khoản.
        </p>
        <div className="container-tabs">
          <button className="tab active">Tất cả</button>
          <button className="tab">Tự động hóa</button>
          <button className="tab">Báo cáo</button>
          <button className="tab">Tích hợp</button>
        </div>
        <div className="container-cards-tours">
          <div className="card-tour">
            <div className="container-img">
              <i className="fa-solid fa-robot fa-3x"></i>
            </div>
            <div className="content">
              <h3>Tự động hóa quy trình</h3>
              <p>Giảm thiểu thao tác thủ công và đảm bảo tính chính xác trong từng bước nghiệp vụ.</p>
            </div>
          </div>
          <div className="card-tour">
            <div className="container-img">
              <i className="fa-solid fa-chart-line fa-3x"></i>
            </div>
            <div className="content">
              <h3>Báo cáo trực quan</h3>
              <p>Thống kê chi tiết về sản xuất, xuất khẩu và tình trạng thanh khoản theo thời gian thực.</p>
            </div>
          </div>
          <div className="card-tour">
            <div className="container-img">
              <i className="fa-solid fa-link fa-3x"></i>
            </div>
            <div className="content">
              <h3>Tích hợp với hệ thống Hải quan</h3>
              <p>Đồng bộ dữ liệu nhanh chóng và chuẩn hóa theo yêu cầu quản lý nhà nước.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION FUNCTION CATEGORIES */}
      <section className="container section-pick-tour">
        <h2 className="title">Phân hệ chức năng</h2>
        <p>
          ECUSS chia thành nhiều nhóm chức năng phục vụ từng giai đoạn trong quy trình sản xuất – xuất khẩu – thanh khoản.
        </p>
        <div className="container-cards-pick-tour">
          <div className="card-pick-tour background-adventure">
            <div className="content">
              <h3>Quản lý hợp đồng</h3>
            </div>
          </div>
          <div className="card-pick-tour background-romance">
            <div className="content">
              <h3>Nguyên liệu nhập khẩu</h3>
            </div>
          </div>
          <div className="card-pick-tour background-culture">
            <div className="content">
              <h3>Thanh khoản & Báo cáo</h3>
            </div>
          </div>
        </div>
        <Link to="/contracts" className="btn-view-more">
          Xem chi tiết
        </Link>
      </section>

      {/* SECTION TESTIMONIAL */}
      <section className="container section-testimonial">
        <h2 className="title">Phản hồi từ doanh nghiệp</h2>
        <p>
          Hàng trăm doanh nghiệp đã tin tưởng và sử dụng ECUSS để quản lý hiệu quả hơn quá trình sản xuất xuất khẩu.
        </p>
        <div className="container-cards-testimonial">
          <div className="card-testimonial">
            <div className="header-card-testimonial">
              <div className="container-img">
                <img src={testimonial1} alt="Testimonio 1" />
                <div className="decoration"></div>
              </div>
              <h3 className="name">Công ty TNHH ABC</h3>
              <span className="occupation">Xuất khẩu may mặc</span>
            </div>
            <div className="review">
              <p>
                ECUSS giúp chúng tôi rút ngắn hơn 40% thời gian chuẩn bị hồ sơ thanh khoản và hạn chế tối đa sai sót trong báo cáo.
              </p>
            </div>
          </div>
          <div className="card-testimonial">
            <div className="header-card-testimonial">
              <div className="container-img">
                <img src={testimonial2} alt="Testimonio 2" />
                <div className="decoration"></div>
              </div>
              <h3 className="name">Công ty CP Xuất nhập khẩu XYZ</h3>
              <span className="occupation">Linh kiện điện tử</span>
            </div>
            <div className="review">
              <p>
                Hệ thống thân thiện, dễ sử dụng. Đặc biệt là tính năng theo dõi nguyên liệu tồn kho và cảnh báo sớm rất hữu ích.
              </p>
            </div>
          </div>
          <div className="card-testimonial">
            <div className="header-card-testimonial">
              <div className="container-img">
                <img src={testimonial3} alt="Testimonio 3" />
                <div className="decoration"></div>
              </div>
              <h3 className="name">Công ty TNHH GMS</h3>
              <span className="occupation">Chế biến nông sản</span>
            </div>
            <div className="review">
              <p>
                ECUSS giúp quản lý dễ dàng, đặc biệt khi báo cáo định kỳ với Hải quan – giảm tải khối lượng công việc đáng kể.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION NEWS BLOG */}
      <section className="container section-news-blog">
        <h2 className="title">Tin tức & Cập nhật</h2>
        <p>
          Cập nhật thông tin mới nhất về chính sách Hải quan, quy định sản xuất xuất khẩu
          và hướng dẫn sử dụng các tính năng mới của hệ thống ECUSS.
        </p>
        <div className="grid-news-blog">
          <div className="card-blog-1">
            <div className="content-card-blog">
              <div className="badges">
                <span>
                  <i className="fa-solid fa-folder"></i> Chính sách
                </span>
                <span>
                  <i className="fa-solid fa-clock"></i> 10/09/2025
                </span>
              </div>
              <h3>Cập nhật quy định mới về thanh khoản hợp đồng SX-XK</h3>
            </div>
          </div>
          <div className="card-blog-2">
            <div className="content-card-blog">
              <div className="badges">
                <span>
                  <i className="fa-solid fa-folder"></i> Hướng dẫn
                </span>
                <span>
                  <i className="fa-solid fa-clock"></i> 05/08/2025
                </span>
              </div>
              <h3>Quy trình quản lý nguyên liệu nhập khẩu hiệu quả với ECUSS</h3>
            </div>
          </div>
          <div className="card-blog-3">
            <div className="content-card-blog">
              <div className="badges">
                <span>
                  <i className="fa-solid fa-folder"></i> Tin nội bộ
                </span>
                <span>
                  <i className="fa-solid fa-clock"></i> 22/06/2025
                </span>
              </div>
              <h3>ECUSS ra mắt giao diện Dashboard trực quan hơn</h3>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
