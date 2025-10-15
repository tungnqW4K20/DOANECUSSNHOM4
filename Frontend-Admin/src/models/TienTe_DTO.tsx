// 🟩 DTO lấy dữ liệu (Get)
export interface GetTienTe_DTO {
  id_tt: number;        // Mã tiền tệ
  ma_tt: string;        // Mã tiền tệ (USD, VND...)
  ten_tt: string;       // Tên tiền tệ
  TotalRecords: number; // Tổng số bản ghi (phục vụ phân trang)
}

// 🟨 DTO thêm mới (Add)
export interface AddTienTe_DTO {
  ma_tt: string;
  ten_tt: string;
}

// 🟦 DTO cập nhật (Update)
export interface UpTienTe_DTO {
  id_tt: number;
  ma_tt: string;
  ten_tt: string;
  TotalRecords: number;
}
