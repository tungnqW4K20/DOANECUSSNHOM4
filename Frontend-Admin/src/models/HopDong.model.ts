// 🟩 DTO lấy dữ liệu (Get)
export interface GetHopDong_DTO {
  id_hd: number;            // Mã hợp đồng
  id_dn: number;            // Doanh nghiệp ký hợp đồng
  so_hd: string;            // Số hợp đồng
  ngay_ky: string;          // Ngày ký hợp đồng (YYYY-MM-DD)
  ngay_hieu_luc: string | null; // Ngày hiệu lực
  ngay_het_han: string | null;  // Ngày hết hạn
  gia_tri: number | null;       // Giá trị hợp đồng
  id_tt: number | null;         // Tiền tệ sử dụng
  file_hop_dong: string | null; // File scan hợp đồng
  TotalRecords: number;         // Tổng số bản ghi (phục vụ phân trang)
}

// 🟨 DTO thêm mới (Add)
export interface AddHopDong_DTO {
  id_dn: number;
  so_hd: string;
  ngay_ky: string;
  ngay_hieu_luc: string | null;
  ngay_het_han: string | null;
  gia_tri: number | null;
  id_tt: number | null;
  file_hop_dong: string | null;
}

// 🟦 DTO cập nhật (Update)
export interface UpHopDong_DTO {
  id_hd: number;
  id_dn: number;
  so_hd: string;
  ngay_ky: string;
  ngay_hieu_luc: string | null;
  ngay_het_han: string | null;
  gia_tri: number | null;
  id_tt: number | null;
  file_hop_dong: string | null;
  TotalRecords: number;
}
