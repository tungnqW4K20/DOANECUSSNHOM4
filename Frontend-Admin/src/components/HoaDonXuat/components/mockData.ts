// 🟩 Mock Data Master (Hóa đơn xuất)
import { GetHoaDonXuat_DTO } from '@/models/HoaDonXuat.model';

export const mockData_HoaDonXuat: GetHoaDonXuat_DTO[] = [
  {
    id_hd_xuat: 1,
    id_lh: 1,
    so_hd: 'HDX-001',
    ngay_hd: '2025-10-14',
    id_tt: 1,
    tong_tien: 7000000,
    file_hoa_don: null,
    TotalRecords: 1,
  },
  {
    id_hd_xuat: 2,
    id_lh: 2,
    so_hd: 'HDX-002',
    ngay_hd: '2025-10-15',
    id_tt: 1,
    tong_tien: 4500000,
    file_hoa_don: null,
    TotalRecords: 2,
  },
];

// 🟩 Mock Data Detail (Chi tiết Hóa đơn xuất)
export const mockData_HoaDonXuatChiTiet = [
  { id_ct: 1, id_hd_xuat: 1, id_sp: 1, so_luong: 10, don_gia: 100000, tri_gia: 1000000 },
  { id_ct: 2, id_hd_xuat: 1, id_sp: 2, so_luong: 30, don_gia: 200000, tri_gia: 6000000 },
  { id_ct: 3, id_hd_xuat: 2, id_sp: 3, so_luong: 5, don_gia: 500000, tri_gia: 2500000 },
  { id_ct: 4, id_hd_xuat: 2, id_sp: 4, so_luong: 4, don_gia: 500000, tri_gia: 2000000 },
];
