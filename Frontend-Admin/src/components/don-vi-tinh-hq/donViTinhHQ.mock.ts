import { AddDonViTinhHQ_DTO, GetDonViTinhHQ_DTO, UpDonViTinhHQ_DTO } from "../../model/DonViTinh_DTO";

let mockData: GetDonViTinhHQ_DTO[] = [
  { id_dvt_hq: 1, ten_dvt: 'KGM', mo_ta: 'Kilogram', TotalRecords: 5 },
  { id_dvt_hq: 2, ten_dvt: 'LTR', mo_ta: 'Lít', TotalRecords: 5 },
  { id_dvt_hq: 3, ten_dvt: 'MTR', mo_ta: 'Mét', TotalRecords: 5 },
  { id_dvt_hq: 4, ten_dvt: 'SET', mo_ta: 'Bộ', TotalRecords: 5 },
  { id_dvt_hq: 5, ten_dvt: 'PCS', mo_ta: 'Cái', TotalRecords: 5 },
];

export const getDonViTinhHQList = (
  page: number = 1,
  pageSize: number = 10,
  search?: string
): Promise<{ data: GetDonViTinhHQ_DTO[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = mockData;
      if (search) {
        filtered = mockData.filter(
          (item) =>
            item.ten_dvt.toLowerCase().includes(search.toLowerCase()) ||
            (item.mo_ta && item.mo_ta.toLowerCase().includes(search.toLowerCase()))
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

export const addDonViTinhHQ = (data: AddDonViTinhHQ_DTO): Promise<GetDonViTinhHQ_DTO> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem: GetDonViTinhHQ_DTO = {
        ...data,
        id_dvt_hq: mockData.length + 1,
        TotalRecords: mockData.length + 1,
      };
      mockData.push(newItem);
      resolve(newItem);
    }, 300);
  });
};

export const updateDonViTinhHQ = (data: UpDonViTinhHQ_DTO): Promise<GetDonViTinhHQ_DTO> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockData.findIndex((item) => item.id_dvt_hq === data.id_dvt_hq);
      if (index !== -1) {
        mockData[index] = { ...mockData[index], ...data, TotalRecords: mockData.length };
        resolve(mockData[index]);
      }
    }, 300);
  });
};

export const deleteDonViTinhHQ = (id: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockData = mockData.filter((item) => item.id_dvt_hq !== id);
      resolve();
    }, 300);
  });
};