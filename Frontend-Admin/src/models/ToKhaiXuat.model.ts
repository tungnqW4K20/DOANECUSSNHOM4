// 🟩 DTO lấy dữ liệu (Get)
export interface GetToKhaiXuat_DTO {
  id_tkx: number;                 // Mã tờ khai xuất
  id_lh: number;                   // Liên kết lô hàng
  so_tk: string;                   // Số tờ khai
  ngay_tk: string;                 // Ngày tờ khai (YYYY-MM-DD)
  tong_tri_gia: number | null;     // Tổng trị giá
  id_tt: number | null;            // Tiền tệ
  file_to_khai: string | null;     // File scan tờ khai
  trang_thai: 'Chờ duyệt' | 'Thông quan' | 'Kiểm tra hồ sơ' | 'Kiểm tra thực tế' | 'Tịch thu'; // Trạng thái tờ khai
  TotalRecords: number;            // Tổng số bản ghi (phục vụ phân trang)
}

// 🟨 DTO thêm mới (Add)
export interface AddToKhaiXuat_DTO {
  id_lh: number;
  so_tk: string;
  ngay_tk: string;
  tong_tri_gia: number | null;
  id_tt: number | null;
  file_to_khai: string | null;
  trang_thai?: 'Chờ duyệt' | 'Thông quan' | 'Kiểm tra hồ sơ' | 'Kiểm tra thực tế' | 'Tịch thu'; // Mặc định 'Chờ duyệt'
}

// 🟦 DTO cập nhật (Update)
export interface UpToKhaiXuat_DTO {
  id_tkx: number;
  id_lh: number;
  so_tk: string;
  ngay_tk: string;
  tong_tri_gia: number | null;
  id_tt: number | null;
  file_to_khai: string | null;
  trang_thai: 'Chờ duyệt' | 'Thông quan' | 'Kiểm tra hồ sơ' | 'Kiểm tra thực tế' | 'Tịch thu';
  TotalRecords: number;
}
