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
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { COLUMNS } from '@/components/UI_shared/Table';
import Header_Children from '@/components/UI_shared/Children_Head';
import { useNotification } from '@/components/UI_shared/Notification';
import { GetTienTe_DTO } from '@/models/TienTe_DTO';
import { mockData_TienTe } from './components/mockData_TienTe';
import { TienTe_Colum } from './components/table';
import { TienTeForm } from './components/form';

const TienTeComponent = () => {
  const [data, setData] = useState<GetTienTe_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GetTienTe_DTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [total, setTotal] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.title = 'Quản lý tiền tệ';
    GetData(currentPage, pageSize, orderType, searchValue);
  }, [currentPage, pageSize, orderType, searchValue]);

  // 🔹 Lấy dữ liệu (mock)
  const GetData = async (
    pageIndex: number,
    pageSize: number,
    orderType: 'ASC' | 'DESC',
    keyword?: string,
  ) => {
    try {
      setLoading(true);
      console.log('📡 Fetch Tiền Tệ mock:', { pageIndex, pageSize, orderType, keyword });
      let filtered = mockData_TienTe;
      if (keyword) {
        filtered = filtered.filter((x:any) =>
          x.ten_tt.toLowerCase().includes(keyword.toLowerCase()) ||
          x.ma_tt.toLowerCase().includes(keyword.toLowerCase()),
        );
      }
      setTotal(filtered.length);
      setData(filtered);
    } catch (error) {
      show({ result: 1, messageError: 'Lỗi tải danh sách tiền tệ' });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchValue(undefined);
    GetData(currentPage, pageSize, orderType);
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

  const openEditModal = (record: GetTienTe_DTO) => {
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

  const handleDelete = (record: GetTienTe_DTO) => {
    console.log('🗑️ Xóa tiền tệ:', record);
    show({ result: 0, messageDone: `Đã xóa ${record.ten_tt}` });
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (isEditing) {
      console.log('✏️ Cập nhật tiền tệ:', values);
      show({ result: 0, messageDone: 'Cập nhật thành công' });
    } else {
      console.log('➕ Thêm tiền tệ:', values);
      show({ result: 0, messageDone: 'Thêm mới thành công' });
    }
    closeModal();
  };

  const ExportExcel = () => {
    console.log('📤 Xuất Excel danh sách tiền tệ:', data);
    show({ result: 0, messageDone: 'Đã xuất file Excel (mock)' });
  };

  const columns = COLUMNS({
    columnType: TienTe_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <>
      {/* Tier 1: Header */}
      <Header_Children
        title="Quản lý tiền tệ"
        onAdd={openCreateModal}
        text_btn_add="Thêm tiền tệ"
      />
      <Divider />

      {/* Tier 2: Bộ lọc và tìm kiếm */}
      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tìm theo mã hoặc tên tiền tệ..."
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
          dataSource={data}
          rowKey="id_tt"
          loading={loading}
          scroll={{ x: 1000, y: 400 }}
          pagination={{
            total: total,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} loại tiền tệ`,
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
          title={isEditing ? 'Cập nhật tiền tệ' : 'Thêm tiền tệ mới'}
          open={modalVisible}
          onOk={handleSave}
          onCancel={closeModal}
          width="50%"
          centered
          okText="Lưu"
          cancelText="Hủy"
        >
          <TienTeForm formdata={form} isEditing={isEditing} />
        </Modal>
      )}
    </>
  );
};

export default TienTeComponent;
