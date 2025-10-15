// 🟩 DTO lấy dữ liệu (Get)
export interface GetDinhMucSanPham_DTO {
  id_dm: number;          // Mã định mức
  id_sp: number;          // Sản phẩm (áo phông)
  id_npl: number;         // Nguyên phụ liệu (vải, chỉ)
  so_luong: number | null;// Số lượng NPL cần (2.5 ; 0.03)
  TotalRecords: number;   // Tổng số bản ghi (phục vụ phân trang)
}

// 🟨 DTO thêm mới (Add)
export interface AddDinhMucSanPham_DTO {
  id_sp: number;
  id_npl: number;
  so_luong: number | null;
}

// 🟦 DTO cập nhật (Update)
export interface UpDinhMucSanPham_DTO {
  id_dm: number;
  id_sp: number;
  id_npl: number;
  so_luong: number | null;
  TotalRecords: number;
}
