import { useState, useEffect } from 'react';
import {
  getTienTeList,
  addTienTe,
  updateTienTe,
  deleteTienTe,
} from '../components/tien-te/tienTe.mock';
import { GetTienTe_DTO, AddTienTe_DTO, UpTienTe_DTO } from '../model/TienTe_DTO';

export const useTienTe = () => {
  const [data, setData] = useState<GetTienTe_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getTienTeList(page, pageSize, search);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const handleAdd = async (values: AddTienTe_DTO) => {
    await addTienTe(values);
    fetchData();
  };

  const handleUpdate = async (values: UpTienTe_DTO) => {
    await updateTienTe(values);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    await deleteTienTe(id);
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