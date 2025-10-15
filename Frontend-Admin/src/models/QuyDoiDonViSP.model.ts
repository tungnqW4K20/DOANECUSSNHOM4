// 🟩 DTO lấy dữ liệu (Get)
export interface GetQuyDoiDonViSP_DTO {
  id_qd: number;           // Mã quy đổi SP
  id_sp: number;           // Mã sản phẩm (áo phông)
  ten_dvt_sp: string;      // Tên đơn vị tính sản phẩm (thùng)
  id_dvt_hq: number;       // Đơn vị HQ chuẩn (cái)
  he_so: number;           // Hệ số quy đổi sang đơn vị HQ (50)
  TotalRecords: number;    // Tổng số bản ghi (phục vụ phân trang)
}

// 🟨 DTO thêm mới (Add)
export interface AddQuyDoiDonViSP_DTO {
  id_sp: number;
  ten_dvt_sp: string;
  id_dvt_hq: number;
  he_so: number;
}

// 🟦 DTO cập nhật (Update)
export interface UpQuyDoiDonViSP_DTO {
  id_qd: number;
  id_sp: number;
  ten_dvt_sp: string;
  id_dvt_hq: number;
  he_so: number;
  TotalRecords: number;
}
