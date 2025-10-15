// 🟩 DTO lấy dữ liệu (Get)
export interface GetQuyDoiDonViDN_DTO {
  id_qd: number;           // Mã quy đổi DN
  id_dn: number;           // Doanh nghiệp
  id_mat_hang: number;     // Nguyên phụ liệu hoặc sản phẩm
  ten_dvt_dn: string;      // Tên đơn vị DN sử dụng (thùng)
  id_dvt_hq: number;       // Đơn vị HQ chuẩn (KGM)
  he_so: number;           // Hệ số quy đổi sang đơn vị HQ (20.000000)
  TotalRecords: number;    // Tổng số bản ghi (phục vụ phân trang)
}

// 🟨 DTO thêm mới (Add)
export interface AddQuyDoiDonViDN_DTO {
  id_dn: number;
  id_mat_hang: number;
  ten_dvt_dn: string;
  id_dvt_hq: number;
  he_so: number;
}

// 🟦 DTO cập nhật (Update)
export interface UpQuyDoiDonViDN_DTO {
  id_qd: number;
  id_dn: number;
  id_mat_hang: number;
  ten_dvt_dn: string;
  id_dvt_hq: number;
  he_so: number;
  TotalRecords: number;
}
