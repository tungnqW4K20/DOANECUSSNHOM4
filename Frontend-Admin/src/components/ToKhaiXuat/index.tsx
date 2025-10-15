'use client';

import { useEffect, useState } from 'react';
import { Button, Divider, Input, Modal, Space, Table, Form } from 'antd';
import { SearchOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import Header_Children from '@/components/UI_shared/Children_Head';
import { useNotification } from '@/components/UI_shared/Notification';
import { COLUMNS } from '@/components/UI_shared/Table';
import { GetToKhaiXuat_DTO } from '@/models/ToKhaiXuat.model';
import { mockData_ToKhaiXuat } from '@/components/ToKhaiXuat/components/mockData';
import { ToKhaiXuat_Colum } from '@/components/ToKhaiXuat/components/table';
import { ToKhaiXuat_Form } from '@/components/ToKhaiXuat/components/form';


const ToKhaiXuatComponents = () => {
  const [data, setData] = useState<GetToKhaiXuat_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GetToKhaiXuat_DTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.title = 'Quản lý Tờ khai xuất';
    GetData(currentPage, pageSize, searchValue);
  }, [currentPage, pageSize, searchValue]);

  const GetData = async (pageIndex: number, pageSize: number, keyword?: string) => {
    try {
      setLoading(true);
      let filtered = mockData_ToKhaiXuat;
      if (keyword) {
        filtered = filtered.filter((x) =>
          x.so_tk.toLowerCase().includes(keyword.toLowerCase())
        );
      }
      setTotal(filtered.length);
      setData(filtered);
    } catch (err) {
      show({ result: 1, messageError: 'Lỗi tải dữ liệu tờ khai xuất' });
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

  const openEditModal = (record: GetToKhaiXuat_DTO) => {
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

  const handleDelete = (record: GetToKhaiXuat_DTO) => {
    console.log('🗑️ Xóa tờ khai xuất:', record);
    show({ result: 0, messageDone: `Đã xóa tờ khai #${record.id_tkx}` });
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (isEditing) {
      console.log('✏️ Cập nhật tờ khai xuất:', values);
      show({ result: 0, messageDone: 'Cập nhật thành công' });
    } else {
      console.log('➕ Thêm tờ khai xuất:', values);
      show({ result: 0, messageDone: 'Thêm mới thành công' });
    }
    closeModal();
  };

  const ExportExcel = () => {
    console.log('📤 Xuất Excel tờ khai xuất:', data);
    show({ result: 0, messageDone: 'Đã xuất file Excel (mock)' });
  };

  const columns = COLUMNS({
    columnType: ToKhaiXuat_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <>
      <Header_Children title="Quản lý tờ khai xuất" onAdd={openCreateModal} text_btn_add="Thêm tờ khai mới" />
      <Divider />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tìm theo số tờ khai..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Button type="default" icon={<ReloadOutlined />} size="large" onClick={handleRefresh}>
            Làm mới
          </Button>
          <Button icon={<UploadOutlined />} type="primary" size="large" onClick={ExportExcel}>
            Xuất Excel
          </Button>
        </Space>
      </div>

      <div className="py-4" style={{ marginTop: '20px' }}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id_tkx"
          loading={loading}
          scroll={{ x: 1200, y: 400 }}
          pagination={{
            total,
            pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t) => `Tổng ${t} tờ khai xuất`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </div>

      {modalVisible && (
        <Modal
          title={isEditing ? 'Cập nhật tờ khai xuất' : 'Thêm tờ khai xuất'}
          open={modalVisible}
          onOk={handleSave}
          onCancel={closeModal}
          width="45%"
          centered
          okText="Lưu"
          cancelText="Hủy"
        >
          <ToKhaiXuat_Form formdata={form} isEditing={isEditing} />
        </Modal>
      )}
    </>
  );
};

export default ToKhaiXuatComponents;
