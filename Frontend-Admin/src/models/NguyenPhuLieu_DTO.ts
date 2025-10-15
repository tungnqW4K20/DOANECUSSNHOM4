// 🟩 DTO lấy dữ liệu (Get)
export interface GetNguyenPhuLieu_DTO {
  id_npl: number;         // Mã nguyên phụ liệu
  ten_npl: string;        // Tên nguyên phụ liệu (vải, chỉ)
  mo_ta: string | null;   // Mô tả
  id_dvt_hq: number;      // Đơn vị tính chuẩn hải quan (mét, kg)
  TotalRecords: number;   // Tổng số bản ghi (phục vụ phân trang)
}

// 🟨 DTO thêm mới (Add)
export interface AddNguyenPhuLieu_DTO {
  ten_npl: string;
  mo_ta: string | null;
  id_dvt_hq: number;
}

// 🟦 DTO cập nhật (Update)
export interface UpNguyenPhuLieu_DTO {
  id_npl: number;
  ten_npl: string;
  mo_ta: string | null;
  id_dvt_hq: number;
  TotalRecords: number;
}
