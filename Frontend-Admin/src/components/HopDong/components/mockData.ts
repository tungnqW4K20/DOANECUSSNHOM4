import { GetHopDong_DTO } from "@/models/HopDong.model";

export const mockData_HopDong: GetHopDong_DTO[] = [
  {
    id_hd: 1,
    id_dn: 1,
    so_hd: 'HD001',
    ngay_ky: '2025-01-10',
    ngay_hieu_luc: '2025-01-15',
    ngay_het_han: '2026-01-14',
    gia_tri: 50000000,
    id_tt: 1,
    file_hop_dong: null,
    TotalRecords: 2,
  },
  {
    id_hd: 2,
    id_dn: 2,
    so_hd: 'HD002',
    ngay_ky: '2025-02-05',
    ngay_hieu_luc: '2025-02-10',
    ngay_het_han: '2026-02-09',
    gia_tri: 75000000,
    id_tt: 1,
    file_hop_dong: '/files/hd002.pdf',
    TotalRecords: 2,
  },
];
