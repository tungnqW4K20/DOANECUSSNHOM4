// 🟩 DTO lấy dữ liệu (Get)
export interface GetSanPham_DTO {
  id_sp: number;          // Mã sản phẩm
  ten_sp: string;         // Tên sản phẩm (áo)
  mo_ta: string | null;   // Mô tả
  id_dvt_hq: number;      // Đơn vị tính chuẩn hải quan (1 cái)
  TotalRecords: number;   // Tổng số bản ghi (phục vụ phân trang)
}

// 🟨 DTO thêm mới (Add)
export interface AddSanPham_DTO {
  ten_sp: string;
  mo_ta: string | null;
  id_dvt_hq: number;
}

// 🟦 DTO cập nhật (Update)
export interface UpSanPham_DTO {
  id_sp: number;
  ten_sp: string;
  mo_ta: string | null;
  id_dvt_hq: number;
  TotalRecords: number;
}
