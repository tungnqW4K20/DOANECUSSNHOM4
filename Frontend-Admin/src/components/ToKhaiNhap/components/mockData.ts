import { GetToKhaiNhap_DTO } from '@/models/ToKhaiNhap.model';

export const mockData_ToKhaiNhap: GetToKhaiNhap_DTO[] = [
  {
    id_tkn: 1,
    id_lh: 101,
    so_tk: 'TKN-001',
    ngay_tk: '2025-10-01',
    tong_tri_gia: 5000000,
    id_tt: 1,
    file_to_khai: null,
    trang_thai: 'Chờ duyệt',
    TotalRecords: 10,
  },
  {
    id_tkn: 2,
    id_lh: 102,
    so_tk: 'TKN-002',
    ngay_tk: '2025-10-05',
    tong_tri_gia: 12000000,
    id_tt: 1,
    file_to_khai: 'https://example.com/tokhai2.pdf',
    trang_thai: 'Thông quan',
    TotalRecords: 10,
  },
  {
    id_tkn: 3,
    id_lh: 103,
    so_tk: 'TKN-003',
    ngay_tk: '2025-10-10',
    tong_tri_gia: 7500000,
    id_tt: 2,
    file_to_khai: null,
    trang_thai: 'Kiểm tra hồ sơ',
    TotalRecords: 10,
  },
];
