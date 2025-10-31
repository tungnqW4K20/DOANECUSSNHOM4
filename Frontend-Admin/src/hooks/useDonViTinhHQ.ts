import { useState, useEffect } from 'react';
import {
  getDonViTinhHQList,
  addDonViTinhHQ,
  updateDonViTinhHQ,
  deleteDonViTinhHQ,
} from '../components/don-vi-tinh-hq/donViTinhHQ.mock';
import { AddDonViTinhHQ_DTO, GetDonViTinhHQ_DTO, UpDonViTinhHQ_DTO } from '../model/DonViTinh_DTO';

export const useDonViTinhHQ = () => {
  const [data, setData] = useState<GetDonViTinhHQ_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getDonViTinhHQList(page, pageSize, search);
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const handleAdd = async (values: AddDonViTinhHQ_DTO) => {
    await addDonViTinhHQ(values);
    fetchData();
  };

  const handleUpdate = async (values: UpDonViTinhHQ_DTO) => {
    await updateDonViTinhHQ(values);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    await deleteDonViTinhHQ(id);
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