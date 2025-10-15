export const getSlugify = (url: string) => {
    return url.substring(url.lastIndexOf('/') + 1);
}
export const DASHBOARD_PATH='/vi/dashboard';

// ====== AUTH ======
export const LOGIN_PATH = '/vi/auth/login';
export const REGISTER_PATH = '/vi/auth/register';
export const RESET_PASSWORD_PATH = '/vi/auth/resetPassword';

// ====== HOME (User Section) ======
export const HOME_PATH = '/vi/home_user';
export const HOME_PRODUCT_PATH = '/vi/home_user/home_product';
export const HOME_RESEARCH_PATH = '/vi/home_user/home_research';
export const HOME_TRAININGCOURSE_PATH = '/vi/home_user/home_trainingcouse';

// ====== QUẢN LÝ DANH MỤC ======
export const QL_DANHMUC_BASE = '/vi/QuanLyDanhMuc';

// --- Quản lý cơ sở ---
export const QL_COSO_DOANHNGHIEP_PATH = `${QL_DANHMUC_BASE}/QuanLyCoSo/DoanhNghiep`;
export const QL_COSO_DONVITINHHQ_PATH = `${QL_DANHMUC_BASE}/QuanLyCoSo/DonViTinhHQ`;
export const QL_COSO_HAIQUAN_PATH = `${QL_DANHMUC_BASE}/QuanLyCoSo/HaiQuan`;

// --- Quản lý hàng hóa ---
export const QL_HANGHOA_DINHMUCSP_PATH = `${QL_DANHMUC_BASE}/QuanLyHangHoa/DinhMucSanPham`;
export const QL_HANGHOA_NGUYENPHULIEU_PATH = `${QL_DANHMUC_BASE}/QuanLyHangHoa/NguyenPhuLieu`;
export const QL_HANGHOA_QUYDOIDONVISP_PATH = `${QL_DANHMUC_BASE}/QuanLyHangHoa/QuyDoiDonViSP`;
export const QL_HANGHOA_SANPHAM_PATH = `${QL_DANHMUC_BASE}/QuanLyHangHoa/SanPham`;

// --- Quản lý tài chính ---
export const QL_TAICHINH_TIENTE_PATH = `${QL_DANHMUC_BASE}/QuanLyTaiChinh/TienTe`;
export const QL_TAICHINH_TYGIA_PATH = `${QL_DANHMUC_BASE}/QuanLyTaiChinh/TyGia`;

// --- Quy đổi đơn vị DN ---
export const QL_QUYDOIDONVIDN_PATH = `${QL_DANHMUC_BASE}/QuyDoiDonViDN`;

// ====== QUẢN LÝ NGHIỆP VỤ ======
export const QL_NGHIEPVU_BASE = '/vi/QuanLyNghiepVu';

// --- Hợp đồng - Lô hàng ---
export const QL_HOPDONG_PATH = `${QL_NGHIEPVU_BASE}/HopDong-LoHang/HopDong`;
export const QL_LOHANG_PATH = `${QL_NGHIEPVU_BASE}/HopDong-LoHang/LoHang`;

// --- Quản lý hóa đơn ---
export const QL_HOADON_NHAP_PATH = `${QL_NGHIEPVU_BASE}/QuanLyHoaDon/HoaDonNhap`;
export const QL_HOADON_XUAT_PATH = `${QL_NGHIEPVU_BASE}/QuanLyHoaDon/HoaDonXuat`;

// --- Quản lý tờ khai ---
export const QL_TOKHAI_NHAP_PATH = `${QL_NGHIEPVU_BASE}/QuanLyToKhai/ToKhaiNhap`;
export const QL_TOKHAI_XUAT_PATH = `${QL_NGHIEPVU_BASE}/QuanLyToKhai/ToKhaiXuat`;

// --- Quản lý vận đơn ---
export const QL_VANDON_NHAP_PATH = `${QL_NGHIEPVU_BASE}/QuanLyVanDon/VanDonNhap`;
export const QL_VANDON_XUAT_PATH = `${QL_NGHIEPVU_BASE}/QuanLyVanDon/VanDonXuat`;
