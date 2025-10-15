// 🟩 DTO lấy dữ liệu (Get)
export interface GetDoanhNghiep_DTO {
  id_dn: number;               // Mã doanh nghiệp
  ten_dn: string;              // Tên doanh nghiệp
  ma_so_thue: string;           // Mã số thuế (dùng làm tên đăng nhập)
  dia_chi: string | null;      // Địa chỉ
  email: string | null;       // email liên hệ
  sdt: string | null;         // Số điện thoại
  mat_khau: string;            // Mật khẩu đăng nhập (hash)
  file_giay_phep: string | null;// Đường dẫn file giấy phép kinh doanh
  TotalRecords: number;       // Tổng số bản ghi (phục vụ phân trang)
}

// 🟨 DTO thêm mới (Add)
export interface AddDoanhNghiep_DTO {
  ten_dn: string;
  ma_so_thue: string;
  dia_chi: string | null;
  email: string | null;
  sdt: string | null;
  mat_khau: string;
  file_giay_phep: string | null;
}

// 🟦 DTO cập nhật (Update)
export interface UpDoanhNghiep_DTO {
  id_dn: number;
  ten_dn: string;
  ma_so_thue: string;
  dia_chi: string | null;
  email: string | null;
  sdt: string | null;
  mat_khau: string;
  file_giay_phep: string | null;
  TotalRecords: number;
}
