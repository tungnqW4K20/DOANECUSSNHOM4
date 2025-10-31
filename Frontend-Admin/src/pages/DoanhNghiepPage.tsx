// src/features/doanh-nghiep/pages/DoanhNghiepPage.tsx
import { Button, Card, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useState } from 'react';
import { useDoanhNghiep } from '../components/doanh-nghiep/hooks/useDoanhNghiep';
import DoanhNghiepTable from '../components/doanh-nghiep/components/DoanhNghiepTable';
import DoanhNghiepModal from '../components/doanh-nghiep/components/DoanhNghiepModal';
import { GetDoanhNghiep_DTO } from '../model/DoanhNghiep_DTO';

const { Title } = Typography;

const DoanhNghiepPage = () => {
  const {
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
  } = useDoanhNghiep();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<GetDoanhNghiep_DTO | null>(null);

  const openModal = (record: GetDoanhNghiep_DTO | null = null) => {
    setEditing(record);
    setModalOpen(true);
  };

  return (
    <Card
      title={
        <Space style={{display:'flex',justifyContent:'space-between'}}>
          <Title level={4} style={{ margin: 0 }}>Quản Lý Doanh Nghiệp</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            Thêm doanh nghiệp
          </Button>
        </Space>
      }
    >
      <DoanhNghiepTable
        data={data}
        loading={loading}
        page={page}
        pageSize={10}
        total={total}
        onPageChange={setPage}
        onSearch={setSearch}
        onEdit={(record) => openModal(record)}
        onDelete={handleDelete}
      />

      <DoanhNghiepModal
        open={modalOpen}
        editing={editing}
        onOk={(values) => {
          if (editing) {

            handleUpdate({ ...values, id_dn: editing.id_dn });
          } else {
            handleAdd(values);
          }
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    </Card>
  );
};

export default DoanhNghiepPage;