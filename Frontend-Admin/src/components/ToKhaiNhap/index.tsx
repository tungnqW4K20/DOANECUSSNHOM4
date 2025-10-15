'use client';

import { useEffect, useState } from 'react';
import { Table, Input, Space, Button, Modal, Divider, Form } from 'antd';
import { SearchOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import Header_Children from '@/components/UI_shared/Children_Head';
import { useNotification } from '@/components/UI_shared/Notification';
import { COLUMNS } from '@/components/UI_shared/Table';
import { GetToKhaiNhap_DTO } from '@/models/ToKhaiNhap.model';
import { mockData_ToKhaiNhap } from '@/components/ToKhaiNhap/components/mockData';
import { ToKhaiNhap_Colum } from '@/components/ToKhaiNhap/components/table';
import { ToKhaiNhap_Form } from '@/components/ToKhaiNhap/components/form';


const ToKhaiNhapComponents = () => {
  const [data, setData] = useState<GetToKhaiNhap_DTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GetToKhaiNhap_DTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { show } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.title = 'Quản lý Tờ khai nhập';
    GetData(currentPage, pageSize, searchValue);
  }, [currentPage, pageSize, searchValue]);

  const GetData = async (pageIndex: number, pageSize: number, keyword?: string) => {
    setLoading(true);
    let filtered = mockData_ToKhaiNhap;
    if (keyword) {
      filtered = filtered.filter((x) =>
        x.so_tk.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    setTotal(filtered.length);
    setData(filtered);
    setLoading(false);
  };

  const handleSearch = (value: string) => setSearchValue(value);
  const handleRefresh = () => setSearchValue(undefined);

  const openCreateModal = () => { form.resetFields(); setEditingItem(null); setIsEditing(false); setModalVisible(true); };
  const openEditModal = (record: GetToKhaiNhap_DTO) => { setEditingItem(record); setIsEditing(true); form.setFieldsValue(record); setModalVisible(true); };
  const closeModal = () => { setModalVisible(false); setEditingItem(null); setIsEditing(false); form.resetFields(); };
  const handleDelete = (record: GetToKhaiNhap_DTO) => { console.log('Xóa tờ khai:', record); show({ result: 0, messageDone: `Đã xóa tờ khai #${record.id_tkn}` }); };
  const handleSave = async () => { const values = await form.validateFields(); console.log(isEditing ? 'Cập nhật tờ khai' : 'Thêm tờ khai', values); show({ result: 0, messageDone: isEditing ? 'Cập nhật thành công' : 'Thêm mới thành công' }); closeModal(); };
  const ExportExcel = () => { console.log('Xuất Excel tờ khai:', data); show({ result: 0, messageDone: 'Đã xuất file Excel (mock)' }); };

  const columns = COLUMNS({ columnType: ToKhaiNhap_Colum, openModal: openEditModal, handleDelete });

  return (
    <>
      <Header_Children title="Quản lý Tờ khai nhập" onAdd={openCreateModal} text_btn_add="Thêm tờ khai mới" />
      <Divider />

      <Space size="middle" className="py-4">
        <Input.Search placeholder="Tìm theo số tờ khai..." allowClear enterButton={<SearchOutlined />} size="large" onSearch={handleSearch} style={{ width: 300 }} />
        <Button type="default" icon={<ReloadOutlined />} size="large" onClick={handleRefresh}>Làm mới</Button>
        <Button icon={<UploadOutlined />} type="primary" size="large" onClick={ExportExcel}>Xuất Excel</Button>
      </Space>

      <div className="py-4" style={{ marginTop: 20 }}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id_tkn"
          loading={loading}
          scroll={{ x: 1200, y: 400 }}
          pagination={{
            total,
            pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (t) => `Tổng ${t} tờ khai`,
            onChange: (page, size) => { setCurrentPage(page); setPageSize(size); },
          }}
        />
      </div>

      {modalVisible && (
        <Modal
          title={isEditing ? 'Cập nhật tờ khai' : 'Thêm tờ khai'}
          open={modalVisible}
          onOk={handleSave}
          onCancel={closeModal}
          width="45%"
          centered
          okText="Lưu"
          cancelText="Hủy"
        >
          <ToKhaiNhap_Form formdata={form} isEditing={isEditing} />
        </Modal>
      )}
    </>
  );
};

export default ToKhaiNhapComponents;
