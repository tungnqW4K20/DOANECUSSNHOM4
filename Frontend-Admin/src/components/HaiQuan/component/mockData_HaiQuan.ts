import { GetHaiQuan_DTO } from "@/models/HaiQuan";

export const mockData_HaiQuan: GetHaiQuan_DTO[] = [
  {
    id_hq: 1,
    ten_hq: 'Nguyễn Văn Hùng',
    email: 'hung.nv@haiquan.gov.vn',
    sdt: '0912345678',
    tai_khoan: 'hungnv',
    mat_khau: 'hashedpassword1',
    TotalRecords: 3,
  },
  {
    id_hq: 2,
    ten_hq: 'Đặng Thị Mai',
    email: 'mai.dt@haiquan.gov.vn',
    sdt: '0987654321',
    tai_khoan: 'maidt',
    mat_khau: 'hashedpassword2',
    TotalRecords: 3,
  },
  {
    id_hq: 3,
    ten_hq: 'Phạm Quốc Tuấn',
    email: 'tuanpq@haiquan.gov.vn',
    sdt: '0905123123',
    tai_khoan: 'tuanpq',
    mat_khau: 'hashedpassword3',
    TotalRecords: 3,
  },
];
