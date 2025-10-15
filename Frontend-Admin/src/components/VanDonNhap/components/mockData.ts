import { GetVanDonNhap_DTO } from "@/models/VanDonNhap.model";

export const mockData_VanDonNhap: GetVanDonNhap_DTO[] = [
  {
    id_vd: 1,
    id_lh: 1,
    so_vd: 'VD001',
    ngay_phat_hanh: '2025-10-01',
    cang_xuat: 'Cảng Hải Phòng',
    cang_nhap: 'Cảng Singapore',
    file_van_don: null,
    TotalRecords: 1,
  },
  {
    id_vd: 2,
    id_lh: 1,
    so_vd: 'VD002',
    ngay_phat_hanh: '2025-10-05',
    cang_xuat: 'Cảng Hải Phòng',
    cang_nhap: 'Cảng Hồng Kông',
    file_van_don: 'https://example.com/file_vd002.pdf',
    TotalRecords: 2,
  },
];
