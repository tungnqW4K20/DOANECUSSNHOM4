// 🟩 DTO lấy dữ liệu (Get)
export interface GetHoaDonNhap_DTO {
  id_hd_nhap: number;           // Mã hóa đơn nhập
  id_lh: number;                // Liên kết lô hàng
  so_hd: string;                // Số hóa đơn
  ngay_hd: string;              // Ngày hóa đơn (YYYY-MM-DD)
  id_tt: number | null;         // Tiền tệ
  tong_tien: number | null;     // Tổng trị giá
  file_hoa_don: string | null;  // File scan hóa đơn
  TotalRecords: number;         // Tổng số bản ghi (phục vụ phân trang)
}

// 🟨 DTO thêm mới (Add)
export interface AddHoaDonNhap_DTO {
  id_lh: number;
  so_hd: string;
  ngay_hd: string;
  id_tt: number | null;
  tong_tien: number | null;
  file_hoa_don: string | null;
}

// 🟦 DTO cập nhật (Update)
export interface UpHoaDonNhap_DTO {
  id_hd_nhap: number;
  id_lh: number;
  so_hd: string;
  ngay_hd: string;
  id_tt: number | null;
  tong_tien: number | null;
  file_hoa_don: string | null;
  TotalRecords: number;
}
