// 🟩 DTO lấy dữ liệu (Get)
export interface GetDonViTinhHQ_DTO {
  id_dvt_hq: number;      // Mã đơn vị tính HQ
  ten_dvt: string;        // Tên đơn vị tính (KGM)
  mo_ta: string | null;   // Mô tả (kilogam)
  TotalRecords: number;   // Tổng số bản ghi (phục vụ phân trang)
}

// 🟨 DTO thêm mới (Add)
export interface AddDonViTinhHQ_DTO {
  ten_dvt: string;
  mo_ta: string | null;
}

// 🟦 DTO cập nhật (Update)
export interface UpDonViTinhHQ_DTO {
  id_dvt_hq: number;
  ten_dvt: string;
  mo_ta: string | null;
}
