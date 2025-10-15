'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Divider,
  Select,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  UploadOutlined,
  EyeOutlined,
} from '@ant-design/icons';


import { COLUMNS } from '@/components/UI_shared/Table';
import Header_Children from '@/components/UI_shared/Children_Head';
import { useNotification } from '@/components/UI_shared/Notification';
import { GetDoanhNghiep_DTO } from '@/models/DoanhNghiep_DTO';
import { DoanhNghiep_Colum } from './component/table';
import { DoanhNghiepForm } from './component/form';

// 🔹 Mock Data
const mockDoanhNghiep: GetDoanhNghiep_DTO[] = [
  {
    id_dn: 1,
    ten_dn: 'Công ty TNHH ABC',
    ma_so_thue: '0101234567',
    dia_chi: 'Hà Nội',
    email: 'contact@abc.vn',
    sdt: '0901234567',
    mat_khau: 'hashedpassword1',
    file_giay_phep: null,
    TotalRecords: 2,
  },
  {
    id_dn: 2,
    ten_dn: 'Công ty CP XYZ',
    ma_so_thue: '0307654321',
    dia_chi: 'TP. Hồ Chí Minh',
    email: 'info@xyz.vn',
    sdt: '0912345678',
    mat_khau: 'hashedpassword2',
    file_giay_phep: '/uploads/giayphep_xyz.pdf',
    TotalRecords: 2,
  },
];

const DoanhNghiepComponent = () => {
  const [doanhNghieps, setDoanhNghieps] = useState<GetDoanhNghiep_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GetDoanhNghiep_DTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [total, setTotal] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

  // 🔹 Lấy dữ liệu (mock)
  useEffect(() => {
    document.title = 'Quản lý doanh nghiệp';
    GetDoanhNghiepByPageOrder(currentPage, pageSize, orderType, searchValue);
  }, [currentPage, pageSize, orderType, searchValue]);

  const GetDoanhNghiepByPageOrder = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    keyword?: string,
  ) => {
    try {
      setLoading(true);
      console.log('📡 Fetch mock data:', { pageIndex, pageSize, orderType, keyword });
      let data = mockDoanhNghiep;
      if (keyword) {
        data = data.filter((x) =>
          x.ten_dn.toLowerCase().includes(keyword.toLowerCase()),
        );
      }
      setTotal(data.length);
      setDoanhNghieps(data);
    } catch (error) {
      show({ result: 1, messageError: 'Lỗi tải danh sách doanh nghiệp' });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchValue(undefined);
    setStatusFilter(undefined);
    GetDoanhNghiepByPageOrder(currentPage, pageSize, orderType);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setIsEditing(false);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (record: GetDoanhNghiep_DTO) => {
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

  const handleDelete = (record: GetDoanhNghiep_DTO) => {
    console.log('🗑️ Xóa doanh nghiệp:', record);
    show({ result: 0, messageDone: `Đã xóa ${record.ten_dn}` });
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (isEditing) {
      console.log('✏️ Cập nhật doanh nghiệp:', values);
      show({ result: 0, messageDone: 'Cập nhật doanh nghiệp thành công' });
    } else {
      console.log('➕ Thêm doanh nghiệp:', values);
      show({ result: 0, messageDone: 'Thêm doanh nghiệp thành công' });
    }
    closeModal();
  };

  const ExportExcel = () => {
    console.log('📤 Xuất Excel danh sách doanh nghiệp:', doanhNghieps);
    show({ result: 0, messageDone: 'Đã xuất file Excel (mock)' });
  };

  const columns = COLUMNS({
    columnType: DoanhNghiep_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <>
      {/* Tier 1: Header */}
      <Header_Children
        title="Quản lý doanh nghiệp"
        onAdd={openCreateModal}
        text_btn_add="Thêm doanh nghiệp"
      />
      <Divider />

      {/* Tier 2: Bộ lọc và tìm kiếm */}
      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tìm theo tên doanh nghiệp..."
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

      {/* Tier 3: Table */}
      <div className="py-4" style={{ marginTop: '20px' }}>
        <Table
          columns={columns}
          dataSource={doanhNghieps}
          rowKey="id_dn"
          loading={loading}
          scroll={{ x: 1000, y: 400 }}
          pagination={{
            total: total,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} doanh nghiệp`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </div>

      {/* Tier 4: Modal thêm/sửa */}
      {modalVisible && (
        <Modal
          title={isEditing ? 'Cập nhật doanh nghiệp' : 'Thêm doanh nghiệp'}
          open={modalVisible}
          onOk={handleSave}
          onCancel={closeModal}
          width="60%"
          centered
          okText="Lưu"
          cancelText="Hủy"
        >
          <DoanhNghiepForm formdata={form} isEditing={isEditing} />
        </Modal>
      )}
    </>
  );
};

export default DoanhNghiepComponent;
