// 🟩 DTO lấy dữ liệu (Get)
export interface GetVanDonNhap_DTO {
  id_vd: number;             // Mã vận đơn nhập
  id_lh: number;             // Thuộc lô hàng
  so_vd: string;             // Số vận đơn
  ngay_phat_hanh: string;    // Ngày phát hành (YYYY-MM-DD)
  cang_xuat: string | null;  // Cảng xuất
  cang_nhap: string | null;  // Cảng nhập
  file_van_don: string | null;// File scan vận đơn
  TotalRecords: number;       // Tổng số bản ghi (phục vụ phân trang)
}

// 🟨 DTO thêm mới (Add)
export interface AddVanDonNhap_DTO {
  id_lh: number;
  so_vd: string;
  ngay_phat_hanh: string;
  cang_xuat: string | null;
  cang_nhap: string | null;
  file_van_don: string | null;
}

// 🟦 DTO cập nhật (Update)
export interface UpVanDonNhap_DTO {
  id_vd: number;
  id_lh: number;
  so_vd: string;
  ngay_phat_hanh: string;
  cang_xuat: string | null;
  cang_nhap: string | null;
  file_van_don: string | null;
  TotalRecords: number;
}
