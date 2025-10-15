import { GetLoHang_DTO } from "@/models/LoHang.model";

export const mockData_LoHang: GetLoHang_DTO[] = [
  {
    id_lh: 1,
    id_hd: 1,
    ngay_dong_goi: '2025-03-01',
    ngay_xuat_cang: '2025-03-05',
    cang_xuat: 'Cảng Hải Phòng',
    cang_nhap: 'Cảng Los Angeles',
    file_chung_tu: '/files/lohang_001.pdf',
    TotalRecords: 2,
  },
  {
    id_lh: 2,
    id_hd: 2,
    ngay_dong_goi: '2025-04-10',
    ngay_xuat_cang: '2025-04-15',
    cang_xuat: 'Cảng Sài Gòn',
    cang_nhap: 'Cảng Rotterdam',
    file_chung_tu: null,
    TotalRecords: 2,
  },
];
