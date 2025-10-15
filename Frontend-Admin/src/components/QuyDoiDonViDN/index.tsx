'use client';

import { useEffect, useState } from 'react';
import { Button, Divider, Input, Modal, Space, Table, Form } from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import Header_Children from '@/components/UI_shared/Children_Head';
import { useNotification } from '@/components/UI_shared/Notification';
import { COLUMNS } from '@/components/UI_shared/Table';
import { GetQuyDoiDonViDN_DTO } from '@/models/UpQuyDoiDonViDN_DTO ';
import { mockData_QuyDoiDonViDN } from './components/mockData_HaiQuan';
import { QuyDoiDonViDN_Colum } from './components/table';
import { QuyDoiDonViDN_Form } from './components/form';


const QuyDoiDonViDNComponent = () => {
  const [data, setData] = useState<GetQuyDoiDonViDN_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GetQuyDoiDonViDN_DTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.title = 'Quản lý Quy đổi đơn vị DN';
    GetData(currentPage, pageSize, searchValue);
  }, [currentPage, pageSize, searchValue]);

  const GetData = async (pageIndex: number, pageSize: number, keyword?: string) => {
    try {
      setLoading(true);
      console.log('📡 Fetch QuyDoiDonViDN mock:', { pageIndex, pageSize, keyword });
      let filtered = mockData_QuyDoiDonViDN;
      if (keyword) {
        filtered = filtered.filter((x) =>
          x.ten_dvt_dn.toLowerCase().includes(keyword.toLowerCase())
        );
      }
      setTotal(filtered.length);
      setData(filtered);
    } catch (err) {
      show({ result: 1, messageError: 'Lỗi tải dữ liệu quy đổi DN' });
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

  const openEditModal = (record: GetQuyDoiDonViDN_DTO) => {
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

  const handleDelete = (record: GetQuyDoiDonViDN_DTO) => {
    console.log('🗑️ Xóa quy đổi DN:', record);
    show({ result: 0, messageDone: `Đã xóa quy đổi #${record.id_qd}` });
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (isEditing) {
      console.log('✏️ Cập nhật quy đổi DN:', values);
      show({ result: 0, messageDone: 'Cập nhật thành công' });
    } else {
      console.log('➕ Thêm quy đổi DN:', values);
      show({ result: 0, messageDone: 'Thêm mới thành công' });
    }
    closeModal();
  };

  const ExportExcel = () => {
    console.log('📤 Xuất Excel quy đổi DN:', data);
    show({ result: 0, messageDone: 'Đã xuất file Excel (mock)' });
  };

  const columns = COLUMNS({
    columnType: QuyDoiDonViDN_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <>
      <Header_Children
        title="Quản lý quy đổi đơn vị DN"
        onAdd={openCreateModal}
        text_btn_add="Thêm quy đổi mới"
      />
      <Divider />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tìm theo đơn vị DN..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Button
            type="default"
            icon={<ReloadOutlined />}
            size="large"
            onClick={handleRefresh}
          >
            Làm mới
          </Button>
          <Button
            icon={<UploadOutlined />}
            type="primary"
            size="large"
            onClick={ExportExcel}
          >
            Xuất Excel
          </Button>
        </Space>
      </div>

      <div className="py-4" style={{ marginTop: '20px' }}>
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
          title={isEditing ? 'Cập nhật quy đổi DN' : 'Thêm quy đổi DN'}
          open={modalVisible}
          onOk={handleSave}
          onCancel={closeModal}
          width="45%"
          centered
          okText="Lưu"
          cancelText="Hủy"
        >
          <QuyDoiDonViDN_Form formdata={form} isEditing={isEditing} />
        </Modal>
      )}
    </>
  );
};

export default QuyDoiDonViDNComponent;
