'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  DatePicker,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import Header_Children from '@/components/UI_shared/Children_Head';
import { useNotification } from '@/components/UI_shared/Notification';
import { COLUMNS } from '@/components/UI_shared/Table';
import { GetTyGia_DTO } from '@/models/TyGia_DTO';
import { mockData_TyGia } from './components/mockData';
import { TyGia_Colum } from './components/table';
import { TyGiaForm } from './components/form';


const TyGiaComponent = () => {
  const [data, setData] = useState<GetTyGia_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GetTyGia_DTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.title = 'Quản lý tỷ giá';
    GetData(currentPage, pageSize, searchValue);
  }, [currentPage, pageSize, searchValue]);

  // 🔹 Lấy dữ liệu mock
  const GetData = async (pageIndex: number, pageSize: number, keyword?: string) => {
    try {
      setLoading(true);
      console.log('📡 Fetch TyGia mock:', { pageIndex, pageSize, keyword });
      let filtered = mockData_TyGia;
      if (keyword) {
        filtered = filtered.filter(
          (x) =>
            x.id_tt.toString().includes(keyword) ||
            x.ty_gia.toString().includes(keyword),
        );
      }
      setTotal(filtered.length);
      setData(filtered);
    } catch (err) {
      show({ result: 1, messageError: 'Lỗi tải dữ liệu tỷ giá' });
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

  const openEditModal = (record: GetTyGia_DTO) => {
    setEditingItem(record);
    setIsEditing(true);
    form.setFieldsValue({
      ...record,
      ngay: dayjs(record.ngay),
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingItem(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = (record: GetTyGia_DTO) => {
    console.log('🗑️ Xóa tỷ giá:', record);
    show({ result: 0, messageDone: `Đã xóa tỷ giá #${record.id_tg}` });
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    const formatted = { ...values, ngay: dayjs(values.ngay).format('YYYY-MM-DD') };
    if (isEditing) {
      console.log('✏️ Cập nhật tỷ giá:', formatted);
      show({ result: 0, messageDone: 'Cập nhật thành công' });
    } else {
      console.log('➕ Thêm tỷ giá:', formatted);
      show({ result: 0, messageDone: 'Thêm mới thành công' });
    }
    closeModal();
  };

  const ExportExcel = () => {
    console.log('📤 Xuất Excel danh sách tỷ giá:', data);
    show({ result: 0, messageDone: 'Đã xuất file Excel (mock)' });
  };

  const columns = COLUMNS({
    columnType: TyGia_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <>
      <Header_Children title="Quản lý tỷ giá" onAdd={openCreateModal} text_btn_add="Thêm tỷ giá" />
      <Divider />

      {/* Bộ lọc */}
      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tìm theo mã tiền tệ hoặc tỷ giá..."
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

      {/* Bảng dữ liệu */}
      <div className="py-4" style={{ marginTop: '20px' }}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id_tg"
          loading={loading}
          scroll={{ x: 1000, y: 400 }}
          pagination={{
            total,
            pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t) => `Tổng ${t} tỷ giá`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </div>

      {/* Modal thêm/sửa */}
      {modalVisible && (
        <Modal
          title={isEditing ? 'Cập nhật tỷ giá' : 'Thêm tỷ giá mới'}
          open={modalVisible}
          onOk={handleSave}
          onCancel={closeModal}
          width="50%"
          centered
          okText="Lưu"
          cancelText="Hủy"
        >
          <TyGiaForm formdata={form} isEditing={isEditing} />
        </Modal>
      )}
    </>
  );
};

export default TyGiaComponent;
