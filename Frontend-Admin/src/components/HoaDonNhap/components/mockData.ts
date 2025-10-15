// 🟩 Mock Data Master (Hóa đơn nhập)
import { GetHoaDonNhap_DTO } from '@/models/HoaDonNhap.model';

export const mockData_HoaDonNhap: GetHoaDonNhap_DTO[] = [
  {
    id_hd_nhap: 1,
    id_lh: 1,
    so_hd: 'HDN-001',
    ngay_hd: '2025-10-14',
    id_tt: 1,
    tong_tien: 5000000,
    file_hoa_don: null,
    TotalRecords: 1,
  },
  {
    id_hd_nhap: 2,
    id_lh: 2,
    so_hd: 'HDN-002',
    ngay_hd: '2025-10-15',
    id_tt: 1,
    tong_tien: 3000000,
    file_hoa_don: null,
    TotalRecords: 2,
  },
];

// 🟩 Mock Data Detail (Chi tiết Hóa đơn nhập)
export const mockData_HoaDonNhapChiTiet = [
  { id_ct: 1, id_hd_nhap: 1, id_npl: 1, so_luong: 10, don_gia: 100000, tri_gia: 1000000 },
  { id_ct: 2, id_hd_nhap: 1, id_npl: 2, so_luong: 20, don_gia: 200000, tri_gia: 4000000 },
  { id_ct: 3, id_hd_nhap: 2, id_npl: 3, so_luong: 5, don_gia: 500000, tri_gia: 2500000 },
  { id_ct: 4, id_hd_nhap: 2, id_npl: 4, so_luong: 1, don_gia: 500000, tri_gia: 500000 },
];
