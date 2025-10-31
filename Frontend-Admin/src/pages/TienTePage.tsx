// src/features/tien-te/pages/TienTePage.tsx
import { Button, Card, Space, Typography, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useTienTe } from '../hooks/useTienTe';
import { GetTienTe_DTO } from '../model/TienTe_DTO';
import TienTeTable from '../components/tien-te/TienTeTable';
import TienTeModal from '../components/tien-te/TienTeModal';


const { Title } = Typography;

const TienTePage = () => {
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
  } = useTienTe();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<GetTienTe_DTO | null>(null);
  const [searchInput, setSearchInput] = useState('');

  const openModal = (record: GetTienTe_DTO | null = null) => {
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
            placeholder="Tìm kiếm mã hoặc tên tiền tệ..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onPressEnter={handleSearch}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            Thêm Tiền Tệ
          </Button>
        </Space>
      </Card>

      {/* BẢNG */}
      <Card>
        <TienTeTable
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
      <TienTeModal
        open={modalOpen}
        editing={editing}
        onOk={(values) => {
          if (editing) {
            handleUpdate({ ...values, id_tt: editing.id_tt });
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

export default TienTePage;