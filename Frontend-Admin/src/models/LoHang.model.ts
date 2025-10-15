// 🟩 DTO lấy dữ liệu (Get)
export interface GetLoHang_DTO {
  id_lh: number;              // Mã lô hàng
  id_hd: number;              // Hợp đồng liên quan
  ngay_dong_goi: string | null;  // Ngày đóng gói
  ngay_xuat_cang: string | null; // Ngày xuất cảng
  cang_xuat: string | null;       // Cảng xuất
  cang_nhap: string | null;       // Cảng nhập
  file_chung_tu: string | null;   // File chứng từ lô hàng
  TotalRecords: number;           // Tổng số bản ghi (phục vụ phân trang)
}

// 🟨 DTO thêm mới (Add)
export interface AddLoHang_DTO {
  id_hd: number;
  ngay_dong_goi: string | null;
  ngay_xuat_cang: string | null;
  cang_xuat: string | null;
  cang_nhap: string | null;
  file_chung_tu: string | null;
}

// 🟦 DTO cập nhật (Update)
export interface UpLoHang_DTO {
  id_lh: number;
  id_hd: number;
  ngay_dong_goi: string | null;
  ngay_xuat_cang: string | null;
  cang_xuat: string | null;
  cang_nhap: string | null;
  file_chung_tu: string | null;
  TotalRecords: number;
}
