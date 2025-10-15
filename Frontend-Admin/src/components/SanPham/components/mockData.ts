// 🧪 Dữ liệu giả lập SanPham

import { GetSanPham_DTO } from "@/models/SanPham_DTO ";

export const mockData_SanPham: GetSanPham_DTO[] = [
  {
    id_sp: 1,
    ten_sp: 'Áo sơ mi nam',
    mo_ta: 'Áo sơ mi trắng tay dài, size M',
    id_dvt_hq: 1,
    TotalRecords: 3,
  },
  {
    id_sp: 2,
    ten_sp: 'Quần jean nữ',
    mo_ta: 'Quần jean xanh, co giãn',
    id_dvt_hq: 1,
    TotalRecords: 3,
  },
  {
    id_sp: 3,
    ten_sp: 'Giày thể thao',
    mo_ta: 'Giày sneaker màu trắng',
    id_dvt_hq: 2,
    TotalRecords: 3,
  },
];
