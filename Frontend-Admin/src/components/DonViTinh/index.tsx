'use client';

import { useEffect, useState } from 'react';
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
import Header_Children from '@/components/UI_shared/Children_Head';
import { useNotification } from '@/components/UI_shared/Notification';
import { COLUMNS } from '@/components/UI_shared/Table';
import { GetDonViTinhHQ_DTO } from '@/models/DonViTinh_DTO';
import { mockData_DonViTinhHQ } from './component/mockData_HaiQuan';
import { DonViTinhHQ_Colum } from './component/table';
import { DonViTinhHQ_Form } from './component/form';


const DonViTinhHQComponent = () => {
  const [data, setData] = useState<GetDonViTinhHQ_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GetDonViTinhHQ_DTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.title = 'Quản lý đơn vị tính HQ';
    GetData(currentPage, pageSize, searchValue);
  }, [currentPage, pageSize, searchValue]);

  // 🔹 Lấy dữ liệu mock
  const GetData = async (pageIndex: number, pageSize: number, keyword?: string) => {
    try {
      setLoading(true);
      console.log('📡 Fetch DonViTinhHQ mock:', { pageIndex, pageSize, keyword });
      let filtered = mockData_DonViTinhHQ;
      if (keyword) {
        filtered = filtered.filter(
          (x) =>
            x.ten_dvt.toLowerCase().includes(keyword.toLowerCase()) ||
            (x.mo_ta ?? '').toLowerCase().includes(keyword.toLowerCase())
        );
      }
      setTotal(filtered.length);
      setData(filtered);
    } catch (err) {
      show({ result: 1, messageError: 'Lỗi tải dữ liệu đơn vị tính HQ' });
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

  const openEditModal = (record: GetDonViTinhHQ_DTO) => {
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

  const handleDelete = (record: GetDonViTinhHQ_DTO) => {
    console.log('🗑️ Xóa đơn vị tính HQ:', record);
    show({ result: 0, messageDone: `Đã xóa đơn vị tính #${record.id_dvt_hq}` });
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (isEditing) {
      console.log('✏️ Cập nhật đơn vị tính HQ:', values);
      show({ result: 0, messageDone: 'Cập nhật thành công' });
    } else {
      console.log('➕ Thêm đơn vị tính HQ:', values);
      show({ result: 0, messageDone: 'Thêm mới thành công' });
    }
    closeModal();
  };

  const ExportExcel = () => {
    console.log('📤 Xuất Excel danh sách đơn vị tính HQ:', data);
    show({ result: 0, messageDone: 'Đã xuất file Excel (mock)' });
  };

  const columns = COLUMNS({
    columnType: DonViTinhHQ_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <>
      <Header_Children
        title="Quản lý đơn vị tính HQ"
        onAdd={openCreateModal}
        text_btn_add="Thêm đơn vị tính"
      />
      <Divider />

      {/* Bộ lọc */}
      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tìm theo tên hoặc mô tả..."
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
          rowKey="id_dvt_hq"
          loading={loading}
          scroll={{ x: 1000, y: 400 }}
          pagination={{
            total,
            pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t) => `Tổng ${t} đơn vị tính`,
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
          title={isEditing ? 'Cập nhật đơn vị tính HQ' : 'Thêm đơn vị tính HQ'}
          open={modalVisible}
          onOk={handleSave}
          onCancel={closeModal}
          width="40%"
          centered
          okText="Lưu"
          cancelText="Hủy"
        >
          <DonViTinhHQ_Form formdata={form} isEditing={isEditing} />
        </Modal>
      )}
    </>
  );
};

export default DonViTinhHQComponent;
