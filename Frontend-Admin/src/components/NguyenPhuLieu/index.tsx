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

import { GetNguyenPhuLieu_DTO } from '@/models/NguyenPhuLieu_DTO';
import { mockData_NguyenPhuLieu } from './components/mockData';
import { NguyenPhuLieu_Colum } from './components/table';
import { NguyenPhuLieu_Form } from './components/form';


const NguyenPhuLieuComponent = () => {
  const [data, setData] = useState<GetNguyenPhuLieu_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GetNguyenPhuLieu_DTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.title = 'Quản lý Nguyên phụ liệu';
    GetData(currentPage, pageSize, searchValue);
  }, [currentPage, pageSize, searchValue]);

  const GetData = async (pageIndex: number, pageSize: number, keyword?: string) => {
    try {
      setLoading(true);
      console.log('📡 Fetch NguyenPhuLieu mock:', { pageIndex, pageSize, keyword });
      let filtered = mockData_NguyenPhuLieu;
      if (keyword) {
        filtered = filtered.filter((x) =>
          x.ten_npl.toLowerCase().includes(keyword.toLowerCase())
        );
      }
      setTotal(filtered.length);
      setData(filtered);
    } catch (err) {
      show({ result: 1, messageError: 'Lỗi tải dữ liệu nguyên phụ liệu' });
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

  const openEditModal = (record: GetNguyenPhuLieu_DTO) => {
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

  const handleDelete = (record: GetNguyenPhuLieu_DTO) => {
    console.log('🗑️ Xóa nguyên phụ liệu:', record);
    show({ result: 0, messageDone: `Đã xóa nguyên phụ liệu #${record.id_npl}` });
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (isEditing) {
      console.log('✏️ Cập nhật nguyên phụ liệu:', values);
      show({ result: 0, messageDone: 'Cập nhật thành công' });
    } else {
      console.log('➕ Thêm nguyên phụ liệu:', values);
      show({ result: 0, messageDone: 'Thêm mới thành công' });
    }
    closeModal();
  };

  const ExportExcel = () => {
    console.log('📤 Xuất Excel nguyên phụ liệu:', data);
    show({ result: 0, messageDone: 'Đã xuất file Excel (mock)' });
  };

  const columns = COLUMNS({
    columnType: NguyenPhuLieu_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <>
      <Header_Children
        title="Quản lý Nguyên phụ liệu"
        onAdd={openCreateModal}
        text_btn_add="Thêm nguyên phụ liệu mới"
      />
      <Divider />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tìm theo tên nguyên phụ liệu..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 320 }}
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
          rowKey="id_npl"
          loading={loading}
          scroll={{ x: 1000, y: 400 }}
          pagination={{
            total,
            pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t) => `Tổng ${t} nguyên phụ liệu`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </div>

      {modalVisible && (
        <Modal
          title={isEditing ? 'Cập nhật nguyên phụ liệu' : 'Thêm nguyên phụ liệu mới'}
          open={modalVisible}
          onOk={handleSave}
          onCancel={closeModal}
          width="45%"
          centered
          okText="Lưu"
          cancelText="Hủy"
        >
          <NguyenPhuLieu_Form formdata={form} isEditing={isEditing} />
        </Modal>
      )}
    </>
  );
};

export default NguyenPhuLieuComponent;
