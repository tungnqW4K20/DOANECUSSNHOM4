// src/features/doanh-nghiep/mock/doanhNghiep.mock.ts

import { AddDoanhNghiep_DTO, GetDoanhNghiep_DTO, UpDoanhNghiep_DTO } from "../../../model/DoanhNghiep_DTO";

let mockData: GetDoanhNghiep_DTO[] = [
  {
    id_dn: 1,
    ten_dn: "Công ty TNHH ABC",
    ma_so_thue: "0100123456",
    dia_chi: "123 Đường Láng, Hà Nội",
    email: "abc@company.com",
    sdt: "0987654321",
    mat_khau: "$2b$10$...",
    file_giay_phep: "/files/giay-phep-abc.pdf",
    TotalRecords: 3,
  },
  {
    id_dn: 2,
    ten_dn: "Tập đoàn XYZ",
    ma_so_thue: "0300987654",
    dia_chi: "456 Lê Lợi, Q.1, TPHCM",
    email: null,
    sdt: "0912345678",
    mat_khau: "$2b$10$...",
    file_giay_phep: null,
    TotalRecords: 3,
  },
  {
    id_dn: 3,
    ten_dn: "Công ty Cổ phần Vina",
    ma_so_thue: "0100654321",
    dia_chi: "789 Hùng Vương, Đà Nẵng",
    email: "vina@corp.vn",
    sdt: "0901234567",
    mat_khau: "$2b$10$...",
    file_giay_phep: "/files/giay-phep-vina.pdf",
    TotalRecords: 3,
  },
];

export const getDoanhNghiepList = (
  page: number = 1,
  pageSize: number = 10,
  search?: string
): Promise<{ data: GetDoanhNghiep_DTO[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = mockData;
      if (search) {
        filtered = mockData.filter(
          (item) =>
            item.ten_dn.toLowerCase().includes(search.toLowerCase()) ||
            item.ma_so_thue.includes(search)
        );
      }
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginated = filtered.slice(start, end);
      resolve({
        data: paginated.map((item) => ({ ...item, TotalRecords: filtered.length })),
        total: filtered.length,
      });
    }, 300);
  });
};

export const addDoanhNghiep = (data: AddDoanhNghiep_DTO): Promise<GetDoanhNghiep_DTO> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem: GetDoanhNghiep_DTO = {
        ...data,
        id_dn: mockData.length + 1,
        TotalRecords: mockData.length + 1,
      };
      mockData.push(newItem);
      resolve(newItem);
    }, 300);
  });
};

export const updateDoanhNghiep = (data: UpDoanhNghiep_DTO): Promise<GetDoanhNghiep_DTO> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockData.findIndex((item) => item.id_dn === data.id_dn);
      if (index !== -1) {
        mockData[index] = { ...mockData[index], ...data, TotalRecords: mockData.length };
        resolve(mockData[index]);
      }
    }, 300);
  });
};

export const deleteDoanhNghiep = (id: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockData = mockData.filter((item) => item.id_dn !== id);
      resolve();
    }, 300);
  });
};