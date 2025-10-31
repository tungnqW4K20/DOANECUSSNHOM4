// src/features/doanh-nghiep/hooks/useDoanhNghiep.ts
import { useState, useEffect } from 'react';
import {
  getDoanhNghiepList,
  addDoanhNghiep,
  updateDoanhNghiep,
  deleteDoanhNghiep,
} from '../components/doanhNghiep.mock';
import { GetDoanhNghiep_DTO, AddDoanhNghiep_DTO, UpDoanhNghiep_DTO } from '../../../model/DoanhNghiep_DTO';

export const useDoanhNghiep = () => {
  const [data, setData] = useState<GetDoanhNghiep_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getDoanhNghiepList(page, pageSize, search);
      setData(res.data);
      setTotal(res.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const handleAdd = async (values: AddDoanhNghiep_DTO) => {
    await addDoanhNghiep(values);
    fetchData();
  };

  const handleUpdate = async (values: UpDoanhNghiep_DTO) => {
    await updateDoanhNghiep(values);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    await deleteDoanhNghiep(id);
    fetchData();
  };

  return {
    data,
    loading,
    total,
    page,
    setPage,
    search,
    setSearch,
    handleAdd,
    handleUpdate,
    handleDelete,
  };
};