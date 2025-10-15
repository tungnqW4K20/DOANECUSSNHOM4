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
import { GetHaiQuan_DTO } from '@/models/HaiQuan';
import { mockData_HaiQuan } from './component/mockData_HaiQuan';
import { HaiQuan_Colum } from './component/table';
import { HaiQuanForm } from './component/form';


const HaiQuanComponent = () => {
  const [data, setData] = useState<GetHaiQuan_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GetHaiQuan_DTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderType, setOrderType] = useState<'ASC' | 'DESC'>('ASC');
  const [total, setTotal] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.title = 'Quản lý cán bộ hải quan';
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
      console.log('📡 Fetch Hải Quan mock:', { pageIndex, pageSize, orderType, keyword });
      let filtered = mockData_HaiQuan;
      if (keyword) {
        filtered = filtered.filter((x) =>
          x.ten_hq.toLowerCase().includes(keyword.toLowerCase()),
        );
      }
      setTotal(filtered.length);
      setData(filtered);
    } catch (error) {
      show({ result: 1, messageError: 'Lỗi tải danh sách hải quan' });
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

  const openEditModal = (record: GetHaiQuan_DTO) => {
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

  const handleDelete = (record: GetHaiQuan_DTO) => {
    console.log('🗑️ Xóa cán bộ hải quan:', record);
    show({ result: 0, messageDone: `Đã xóa ${record.ten_hq}` });
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (isEditing) {
      console.log('✏️ Cập nhật cán bộ hải quan:', values);
      show({ result: 0, messageDone: 'Cập nhật thành công' });
    } else {
      console.log('➕ Thêm cán bộ hải quan:', values);
      show({ result: 0, messageDone: 'Thêm mới thành công' });
    }
    closeModal();
  };

  const ExportExcel = () => {
    console.log('📤 Xuất Excel danh sách hải quan:', data);
    show({ result: 0, messageDone: 'Đã xuất file Excel (mock)' });
  };

  const columns = COLUMNS({
    columnType: HaiQuan_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <>
      {/* Tier 1: Header */}
      <Header_Children
        title="Quản lý cán bộ hải quan"
        onAdd={openCreateModal}
        text_btn_add="Thêm cán bộ"
      />
      <Divider />

      {/* Tier 2: Bộ lọc và tìm kiếm */}
      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tìm theo tên cán bộ..."
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
          rowKey="id_hq"
          loading={loading}
          scroll={{ x: 1000, y: 400 }}
          pagination={{
            total: total,
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} cán bộ`,
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
          title={isEditing ? 'Cập nhật cán bộ' : 'Thêm cán bộ mới'}
          open={modalVisible}
          onOk={handleSave}
          onCancel={closeModal}
          width="60%"
          centered
          okText="Lưu"
          cancelText="Hủy"
        >
          <HaiQuanForm formdata={form} isEditing={isEditing} />
        </Modal>
      )}
    </>
  );
};

export default HaiQuanComponent;
