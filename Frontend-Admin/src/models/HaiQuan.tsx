// 🟩 DTO lấy dữ liệu (Get)
export interface GetHaiQuan_DTO {
  id_hq: number;           // Mã cán bộ hải quan
  ten_hq: string;          // Tên cán bộ/đơn vị hải quan
  email: string | null;    // Email liên hệ
  sdt: string | null;      // Số điện thoại
  tai_khoan: string;       // Tên đăng nhập hệ thống
  mat_khau: string;        // Mật khẩu đăng nhập (hash)
  TotalRecords: number;    // Tổng số bản ghi (phục vụ phân trang)
}

// 🟨 DTO thêm mới (Add)
export interface AddHaiQuan_DTO {
  ten_hq: string;
  email: string | null;
  sdt: string | null;
  tai_khoan: string;
  mat_khau: string;
}

// 🟦 DTO cập nhật (Update)
export interface UpHaiQuan_DTO {
  id_hq: number;
  ten_hq: string;
  email: string | null;
  sdt: string | null;
  tai_khoan: string;
  mat_khau: string;
  TotalRecords: number;
}
