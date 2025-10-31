// src/features/don-vi-tinh-hq/pages/DonViTinhHQPage.tsx
import { Button, Card, Space, Typography, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useDonViTinhHQ } from '../hooks/useDonViTinhHQ';
import { GetDonViTinhHQ_DTO } from '../model/DonViTinh_DTO';
import DonViTinhHQTable from '../components/don-vi-tinh-hq/DonViTinhHQTable';
import DonViTinhHQModal from '../components/don-vi-tinh-hq/DonViTinhHQModal';


const { Title } = Typography;

const DonViTinhHQPage = () => {
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
  } = useDonViTinhHQ();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<GetDonViTinhHQ_DTO | null>(null);
  const [searchInput, setSearchInput] = useState('');

  const openModal = (record: GetDonViTinhHQ_DTO | null = null) => {
    setEditing(record);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSearch = () => {
    setSearch(searchInput);
  };

  return (
    <div style={{ minHeight: '100%' }}>
      {/* HEADER: Tìm kiếm + Thêm */}
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Input
            placeholder="Tìm kiếm tên hoặc mô tả..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onPressEnter={handleSearch}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            Thêm Đơn Vị Tính
          </Button>
        </Space>
      </Card>

      {/* BẢNG */}
      <Card>
        <DonViTinhHQTable
          data={data}
          loading={loading}
          page={page}
          pageSize={10}
          total={total}
          onPageChange={setPage}
          onEdit={openModal}
          onDelete={handleDelete}
        />
      </Card>

      {/* MODAL */}
      <DonViTinhHQModal
        open={modalOpen}
        editing={editing}
        onOk={(values) => {
          if (editing) {
            handleUpdate({ ...values, id_dvt_hq: editing.id_dvt_hq });
          } else {
            handleAdd(values);
          }
          closeModal();
        }}
        onCancel={closeModal}
      />
    </div>
  );
};

export default DonViTinhHQPage;