import { GetToKhaiXuat_DTO } from '@/models/ToKhaiXuat.model';

export const mockData_ToKhaiXuat: GetToKhaiXuat_DTO[] = [
  {
    id_tkx: 1,
    id_lh: 201,
    so_tk: 'TKX-001',
    ngay_tk: '2025-10-01',
    tong_tri_gia: 15000000,
    id_tt: 1,
    file_to_khai: null,
    trang_thai: 'Chờ duyệt',
    TotalRecords: 10,
  },
  {
    id_tkx: 2,
    id_lh: 202,
    so_tk: 'TKX-002',
    ngay_tk: '2025-10-05',
    tong_tri_gia: 22000000,
    id_tt: 1,
    file_to_khai: 'https://example.com/tokhai2.pdf',
    trang_thai: 'Thông quan',
    TotalRecords: 10,
  },
  {
    id_tkx: 3,
    id_lh: 203,
    so_tk: 'TKX-003',
    ngay_tk: '2025-10-10',
    tong_tri_gia: 8000000,
    id_tt: 2,
    file_to_khai: null,
    trang_thai: 'Kiểm tra hồ sơ',
    TotalRecords: 10,
  },
];
