'use client';

import { useState, useEffect } from 'react';
import { Table, Input, Space, Button, Modal, Divider, Form } from 'antd';
import { SearchOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import { GetHoaDonNhap_DTO } from '@/models/HoaDonNhap.model';

import Header_Children from '@/components/UI_shared/Children_Head';
import { useNotification } from '@/components/UI_shared/Notification';
import { COLUMNS } from '@/components/UI_shared/Table';
import { mockData_HoaDonNhap } from './components/mockData';
import { HoaDonNhap_Colum } from './components/table';
import { HoaDonNhap_Form } from './components/form';


const HoaDonNhapComponents = () => {
    const [data, setData] = useState<GetHoaDonNhap_DTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<GetHoaDonNhap_DTO | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const { show } = useNotification();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

    useEffect(() => {
        document.title = 'Quản lý Hóa đơn nhập';
        GetData(currentPage, pageSize, searchValue);
    }, [currentPage, pageSize, searchValue]);

    const GetData = async (pageIndex: number, pageSize: number, keyword?: string) => {
        setLoading(true);
        let filtered = mockData_HoaDonNhap;
        if (keyword) {
            filtered = filtered.filter((x) => x.so_hd.toLowerCase().includes(keyword.toLowerCase()));
        }
        setTotal(filtered.length);
        setData(filtered);
        setLoading(false);
    };

    const handleSearch = (value: string) => setSearchValue(value);
    const handleRefresh = () => setSearchValue(undefined);

    const openCreateModal = () => { form.resetFields(); setEditingItem(null); setIsEditing(false); setModalVisible(true); };
    const openEditModal = (record: GetHoaDonNhap_DTO) => { setEditingItem(record); setIsEditing(true); form.setFieldsValue(record); setModalVisible(true); };
    const closeModal = () => { setModalVisible(false); setEditingItem(null); setIsEditing(false); form.resetFields(); };
    const handleDelete = (record: GetHoaDonNhap_DTO) => { console.log('Xóa:', record); show({ result: 0, messageDone: `Đã xóa hóa đơn #${record.id_hd_nhap}` }); };
    const handleSave = async () => { const values = await form.validateFields(); console.log(isEditing ? 'Cập nhật' : 'Thêm mới', values); show({ result: 0, messageDone: isEditing ? 'Cập nhật thành công' : 'Thêm mới thành công' }); closeModal(); };
    const ExportExcel = () => { console.log('Xuất Excel', data); show({ result: 0, messageDone: 'Đã xuất file Excel (mock)' }); };

    const columns = COLUMNS({ columnType: HoaDonNhap_Colum, openModal: openEditModal, handleDelete });

    return (
        <>
            <Header_Children title="Quản lý Hóa đơn nhập" onAdd={openCreateModal} text_btn_add="Thêm hóa đơn mới" />
            <Divider />
            <Space size="middle" className="py-4">
                <Input.Search placeholder="Tìm theo số hóa đơn..." allowClear enterButton={<SearchOutlined />} size="large" onSearch={handleSearch} style={{ width: 300 }} />
                <Button type="default" icon={<ReloadOutlined />} size="large" onClick={handleRefresh}>Làm mới</Button>
                <Button icon={<UploadOutlined />} type="primary" size="large" onClick={ExportExcel}>Xuất Excel</Button>
            </Space>

            <div className="py-4" style={{ marginTop: 20 }}>
                <Table columns={columns} dataSource={data} rowKey="id_hd_nhap" loading={loading} scroll={{ x: 1200, y: 400 }} pagination={{
                    total, pageSize, showSizeChanger: true, showQuickJumper: true,
                    showTotal: (t) => `Tổng ${t} hóa đơn`,
                    onChange: (page, size) => { setCurrentPage(page); setPageSize(size); },
                }} />
            </div>

            {modalVisible && (
                <Modal title={isEditing ? 'Cập nhật hóa đơn' : 'Thêm hóa đơn'} open={modalVisible} onOk={handleSave} onCancel={closeModal} width="60%" centered okText="Lưu" cancelText="Hủy">
                    <HoaDonNhap_Form formdata={form} isEditing={isEditing} />
                </Modal>
            )}
        </>
    );
};

export default HoaDonNhapComponents;
