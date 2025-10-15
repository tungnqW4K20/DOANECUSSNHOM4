// 🟩 DTO lấy dữ liệu (Get)
export interface GetTyGia_DTO {
  id_tg: number;         // Mã tỷ giá
  id_tt: number;         // Mã tiền tệ (USD)
  ngay: string;          // Ngày hiệu lực tỷ giá (YYYY-MM-DD)
  ty_gia: number;        // Tỷ giá quy đổi sang VND
  TotalRecords: number;  // Tổng số bản ghi (phục vụ phân trang)
}

// 🟨 DTO thêm mới (Add)
export interface AddTyGia_DTO {
  id_tt: number;
  ngay: string;
  ty_gia: number;
}

// 🟦 DTO cập nhật (Update)
export interface UpTyGia_DTO {
  id_tg: number;
  id_tt: number;
  ngay: string;
  ty_gia: number;
  TotalRecords: number;
}
