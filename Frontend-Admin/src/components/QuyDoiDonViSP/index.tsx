'use client';

import { useEffect, useState } from 'react';
import { Button, Divider, Input, Modal, Space, Table, Form } from 'antd';
import { SearchOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import Header_Children from '@/components/UI_shared/Children_Head';
import { useNotification } from '@/components/UI_shared/Notification';
import { COLUMNS } from '@/components/UI_shared/Table';
import { GetQuyDoiDonViSP_DTO } from '@/models/QuyDoiDonViSP.model';
import { mockData_QuyDoiDonViSP } from './component/mockData';
import { QuyDoiDonViSP_Colum } from './component/table';
import { QuyDoiDonViSP_Form } from './component/form';


const QuyDoiDonViSPComponent = () => {
  const [data, setData] = useState<GetQuyDoiDonViSP_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GetQuyDoiDonViSP_DTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.title = 'Quản lý Quy đổi đơn vị SP';
    GetData(currentPage, pageSize, searchValue);
  }, [currentPage, pageSize, searchValue]);

  const GetData = async (pageIndex: number, pageSize: number, keyword?: string) => {
    try {
      setLoading(true);
      console.log('📡 Fetch QuyDoiDonViSP mock:', { pageIndex, pageSize, keyword });
      let filtered = mockData_QuyDoiDonViSP;
      if (keyword) {
        const kw = keyword.toLowerCase();
        filtered = filtered.filter(
          (x) =>
            x.ten_dvt_sp.toLowerCase().includes(kw) ||
            x.id_sp.toString().includes(kw) ||
            x.id_dvt_hq.toString().includes(kw)
        );
      }
      setTotal(filtered.length);
      setData(filtered);
    } catch (err) {
      show({ result: 1, messageError: 'Lỗi tải dữ liệu quy đổi SP' });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchValue(undefined);
    GetData(currentPage, pageSize);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const openCreateModal = () => {
    form.resetFields();
    setEditingItem(null);
    setIsEditing(false);
    setModalVisible(true);
  };

  const openEditModal = (record: GetQuyDoiDonViSP_DTO) => {
    setEditingItem(record);
    setIsEditing(true);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingItem(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = (record: GetQuyDoiDonViSP_DTO) => {
    console.log('🗑️ Xóa quy đổi SP:', record);
    show({ result: 0, messageDone: `Đã xóa quy đổi #${record.id_qd}` });
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (isEditing) {
      console.log('✏️ Cập nhật quy đổi SP:', values);
      show({ result: 0, messageDone: 'Cập nhật thành công' });
    } else {
      console.log('➕ Thêm quy đổi SP:', values);
      show({ result: 0, messageDone: 'Thêm mới thành công' });
    }
    closeModal();
  };

  const ExportExcel = () => {
    console.log('📤 Xuất Excel quy đổi SP:', data);
    show({ result: 0, messageDone: 'Đã xuất file Excel (mock)' });
  };

  const columns = COLUMNS({
    columnType: QuyDoiDonViSP_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <>
      <Header_Children
        title="Quản lý quy đổi đơn vị SP"
        onAdd={openCreateModal}
        text_btn_add="Thêm quy đổi SP"
      />
      <Divider />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tìm theo SP / đơn vị..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 320 }}
          />
          <Button type="default" icon={<ReloadOutlined />} size="large" onClick={handleRefresh}>
            Làm mới
          </Button>
          <Button icon={<UploadOutlined />} type="primary" size="large" onClick={ExportExcel}>
            Xuất Excel
          </Button>
        </Space>
      </div>

      <div className="py-4" style={{ marginTop: 20 }}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id_qd"
          loading={loading}
          scroll={{ x: 1000, y: 400 }}
          pagination={{
            total,
            pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t) => `Tổng ${t} quy đổi`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </div>

      {modalVisible && (
        <Modal
          title={isEditing ? 'Cập nhật quy đổi SP' : 'Thêm quy đổi SP'}
          open={modalVisible}
          onOk={handleSave}
          onCancel={closeModal}
          width="45%"
          centered
          okText="Lưu"
          cancelText="Hủy"
        >
          <QuyDoiDonViSP_Form formdata={form} isEditing={isEditing} />
        </Modal>
      )}
    </>
  );
};

export default QuyDoiDonViSPComponent;
