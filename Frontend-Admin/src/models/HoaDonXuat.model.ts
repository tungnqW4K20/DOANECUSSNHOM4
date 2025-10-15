// 🟩 DTO lấy dữ liệu (Get)
export interface GetHoaDonXuat_DTO {
  id_hd_xuat: number;           // Mã hóa đơn xuất
  id_lh: number;                // Liên kết lô hàng
  so_hd: string;                // Số hóa đơn
  ngay_hd: string;              // Ngày hóa đơn (YYYY-MM-DD)
  id_tt: number | null;         // Tiền tệ
  tong_tien: number | null;     // Tổng trị giá
  file_hoa_don: string | null;  // File scan hóa đơn
  TotalRecords: number;         // Tổng số bản ghi (phục vụ phân trang)
}

// 🟨 DTO thêm mới (Add)
export interface AddHoaDonXuat_DTO {
  id_lh: number;
  so_hd: string;
  ngay_hd: string;
  id_tt: number | null;
  tong_tien: number | null;
  file_hoa_don: string | null;
}

// 🟦 DTO cập nhật (Update)
export interface UpHoaDonXuat_DTO {
  id_hd_xuat: number;
  id_lh: number;
  so_hd: string;
  ngay_hd: string;
  id_tt: number | null;
  tong_tien: number | null;
  file_hoa_don: string | null;
  TotalRecords: number;
}
