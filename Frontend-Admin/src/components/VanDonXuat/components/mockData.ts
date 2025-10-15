import { GetVanDonXuat_DTO } from "@/models/VanDonXuat.model";

export const mockData_VanDonXuat: GetVanDonXuat_DTO[] = [
  {
    id_vd: 1,
    id_lh: 1,
    so_vd: 'VDX001',
    ngay_phat_hanh: '2025-10-01',
    cang_xuat: 'Cảng Hải Phòng',
    cang_nhap: 'Cảng Singapore',
    file_van_don: null,
    TotalRecords: 1,
  },
  {
    id_vd: 2,
    id_lh: 1,
    so_vd: 'VDX002',
    ngay_phat_hanh: '2025-10-05',
    cang_xuat: 'Cảng Hải Phòng',
    cang_nhap: 'Cảng Hồng Kông',
    file_van_don: 'https://example.com/file_vdx002.pdf',
    TotalRecords: 2,
  },
];
