'use client';

import { useEffect, useState } from 'react';
import { Button, Divider, Input, Modal, Space, Table, Form } from 'antd';
import { SearchOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import Header_Children from '@/components/UI_shared/Children_Head';
import { useNotification } from '@/components/UI_shared/Notification';
import { COLUMNS } from '@/components/UI_shared/Table';

import dayjs from 'dayjs';
import { GetVanDonXuat_DTO } from '@/models/VanDonXuat.model';
import { mockData_VanDonXuat } from './components/mockData';
import { VanDonXuat_Colum } from './components/table';
import VanDonXuat_Form from './components/form';


const VanDonXuatComponent = () => {
  const [data, setData] = useState<GetVanDonXuat_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GetVanDonXuat_DTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.title = 'Quản lý vận đơn xuất';
    GetData(currentPage, pageSize, searchValue);
  }, [currentPage, pageSize, searchValue]);

  const GetData = async (pageIndex: number, pageSize: number, keyword?: string) => {
    try {
      setLoading(true);
      let filtered = mockData_VanDonXuat;
      if (keyword) {
        filtered = filtered.filter((x) =>
          x.so_vd.toLowerCase().includes(keyword.toLowerCase())
        );
      }
      setTotal(filtered.length);
      setData(filtered);
    } catch (err) {
      show({ result: 1, messageError: 'Lỗi tải dữ liệu vận đơn xuất' });
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

  const openEditModal = (record: GetVanDonXuat_DTO) => {
    setEditingItem(record);
    setIsEditing(true);
    form.setFieldsValue({
      ...record,
      ngay_phat_hanh: record.ngay_phat_hanh ? dayjs(record.ngay_phat_hanh) : null,
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingItem(null);
    setIsEditing(false);
    form.resetFields();
  };

  const handleDelete = (record: GetVanDonXuat_DTO) => {
    console.log('🗑️ Xóa vận đơn xuất:', record);
    show({ result: 0, messageDone: `Đã xóa vận đơn #${record.id_vd}` });
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    const payload = {
      ...values,
      ngay_phat_hanh: values.ngay_phat_hanh ? values.ngay_phat_hanh.format('YYYY-MM-DD') : null,
    };
    if (isEditing) {
      console.log('✏️ Cập nhật vận đơn xuất:', payload);
      show({ result: 0, messageDone: 'Cập nhật thành công' });
    } else {
      console.log('➕ Thêm vận đơn xuất:', payload);
      show({ result: 0, messageDone: 'Thêm mới thành công' });
    }
    closeModal();
  };

  const ExportExcel = () => {
    console.log('📤 Xuất Excel vận đơn xuất:', data);
    show({ result: 0, messageDone: 'Đã xuất file Excel (mock)' });
  };

  const columns = COLUMNS({
    columnType: VanDonXuat_Colum,
    openModal: openEditModal,
    handleDelete: handleDelete,
  });

  return (
    <>
      <Header_Children
        title="Quản lý vận đơn xuất"
        onAdd={openCreateModal}
        text_btn_add="Thêm vận đơn mới"
      />
      <Divider />

      <div className="py-4">
        <Space size="middle">
          <Input.Search
            placeholder="Tìm theo số vận đơn..."
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
          rowKey="id_vd"
          loading={loading}
          scroll={{ x: 1000, y: 400 }}
          pagination={{
            total,
            pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t) => `Tổng ${t} vận đơn`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </div>

      {modalVisible && (
        <Modal
          title={isEditing ? 'Cập nhật vận đơn xuất' : 'Thêm vận đơn xuất'}
          open={modalVisible}
          onOk={handleSave}
          onCancel={closeModal}
          width="45%"
          centered
          okText="Lưu"
          cancelText="Hủy"
        >
          <VanDonXuat_Form formdata={form} isEditing={isEditing} />
        </Modal>
      )}
    </>
  );
};

export default VanDonXuatComponent;
