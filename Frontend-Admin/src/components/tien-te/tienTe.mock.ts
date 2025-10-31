
import { AddTienTe_DTO, GetTienTe_DTO, UpTienTe_DTO } from "../../model/TienTe_DTO";

let mockData: GetTienTe_DTO[] = [
  { id_tt: 1, ma_tt: 'VND', ten_tt: 'Việt Nam Đồng', TotalRecords: 6 },
  { id_tt: 2, ma_tt: 'USD', ten_tt: 'Đô la Mỹ', TotalRecords: 6 },
  { id_tt: 3, ma_tt: 'EUR', ten_tt: 'Euro', TotalRecords: 6 },
  { id_tt: 4, ma_tt: 'JPY', ten_tt: 'Yên Nhật', TotalRecords: 6 },
  { id_tt: 5, ma_tt: 'GBP', ten_tt: 'Bảng Anh', TotalRecords: 6 },
  { id_tt: 6, ma_tt: 'CNY', ten_tt: 'Nhân Dân Tệ', TotalRecords: 6 },
];

export const getTienTeList = (
  page: number = 1,
  pageSize: number = 10,
  search?: string
): Promise<{ data: GetTienTe_DTO[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = mockData;
      if (search) {
        filtered = mockData.filter(
          (item) =>
            item.ma_tt.toLowerCase().includes(search.toLowerCase()) ||
            item.ten_tt.toLowerCase().includes(search.toLowerCase())
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

export const addTienTe = (data: AddTienTe_DTO): Promise<GetTienTe_DTO> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem: GetTienTe_DTO = {
        ...data,
        id_tt: mockData.length + 1,
        TotalRecords: mockData.length + 1,
      };
      mockData.push(newItem);
      resolve(newItem);
    }, 300);
  });
};

export const updateTienTe = (data: UpTienTe_DTO): Promise<GetTienTe_DTO> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockData.findIndex((item) => item.id_tt === data.id_tt);
      if (index !== -1) {
        mockData[index] = { ...mockData[index], ...data, TotalRecords: mockData.length };
        resolve(mockData[index]);
      }
    }, 300);
  });
};

export const deleteTienTe = (id: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockData = mockData.filter((item) => item.id_tt !== id);
      resolve();
    }, 300);
  });
};