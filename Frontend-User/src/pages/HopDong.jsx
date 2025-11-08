import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Space, Popconfirm, message, InputNumber, Row, Col, Typography, Card, Upload, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FolderOpenOutlined, FileOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title } = Typography;
const { Search } = Input;

// --- Dữ liệu giả lập ---
const tienTeList = [ { id_tt: 1, ma_tt: 'USD', ten_tt: 'Đô la Mỹ' }, { id_tt: 2, ma_tt: 'VND', ten_tt: 'Việt Nam Đồng' }];
const initialHopDong = [
  { id_hd: 1, so_hd: 'HD-2025-001', ngay_ky: '2025-01-15', ngay_hieu_luc: '2025-01-20', ngay_het_han: '2026-01-20', gia_tri: 50000, id_tt: 1, file_hop_dong: 'hd_001.pdf' },
  { id_hd: 2, so_hd: 'HD-2025-002', ngay_ky: '2025-02-10', ngay_hieu_luc: '2025-02-15', ngay_het_han: '2025-08-15', gia_tri: 120000, id_tt: 1, file_hop_dong: null },
];
const mockLoHangData = [
    { id_lh: 1, id_hd: 1, so_lh: 'LH-001', ngay_dong_goi: '2025-04-10', ngay_xuat_cang: '2025-04-12', cang_xuat: 'Cảng Cát Lái', cang_nhap: 'Cảng Singapore', file_chung_tu: 'chungtu_lh1.pdf' },
    { id_lh: 2, id_hd: 1, so_lh: 'LH-002', ngay_dong_goi: '2025-05-15', ngay_xuat_cang: '2025-05-18', cang_xuat: 'Cảng Cát Lái', cang_nhap: 'Cảng Tokyo', file_chung_tu: null },
];
// -----------------------

const HopDong = () => {
    const [crudForm] = Form.useForm();
    const [dataSource, setDataSource] = useState(initialHopDong);
    const [isCrudModalOpen, setIsCrudModalOpen] = useState(false);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    
    const [crudModalContent, setCrudModalContent] = useState({ type: null, record: null, title: '' });
    const [selectedHopDong, setSelectedHopDong] = useState(null);
    const [loHangDataSource, setLoHangDataSource] = useState([]);
    
    const showDetailModal = (record) => {
        setSelectedHopDong(record);
        setLoHangDataSource(mockLoHangData.filter(lh => lh.id_hd === record.id_hd));
        setDetailModalOpen(true);
    };

    const handleOpenCrudModal = (type, record = null) => {
        const title = `${record ? 'Chỉnh sửa' : 'Thêm mới'} ${type === 'hopDong' ? 'Hợp đồng' : 'Lô hàng'}`;
        setCrudModalContent({ type, record, title });
        crudForm.resetFields();
        if (record) {
            const dateFields = ['ngay_ky', 'ngay_hieu_luc', 'ngay_het_han', 'ngay_dong_goi', 'ngay_xuat_cang'];
            const recordWithDayjs = { ...record };
            dateFields.forEach(field => {
                if (record[field]) recordWithDayjs[field] = dayjs(record[field]);
            });
            crudForm.setFieldsValue(recordWithDayjs);
        }
        setIsCrudModalOpen(true);
    };

    const handleCrudSave = () => { message.success('Lưu thành công!'); setIsCrudModalOpen(false); };

    const mainColumns = [
        { title: 'Số Hợp đồng', dataIndex: 'so_hd', key: 'so_hd' },
        { title: 'Ngày ký', dataIndex: 'ngay_ky', key: 'ngay_ky' },
        { title: 'Ngày hiệu lực', dataIndex: 'ngay_hieu_luc', key: 'ngay_hieu_luc' },
        { title: 'Ngày hết hạn', dataIndex: 'ngay_het_han', key: 'ngay_het_han' },
        { title: 'Giá trị', dataIndex: 'gia_tri', key: 'gia_tri', align: 'right', render: (val) => val?.toLocaleString() },
        { title: 'Tiền tệ', dataIndex: 'id_tt', key: 'id_tt', render: (id) => tienTeList.find(t => t.id_tt === id)?.ma_tt },
        { title: 'File', dataIndex: 'file_hop_dong', key: 'file_hop_dong', align: 'center', render: (file) => file ? <Tooltip title={file}><FileOutlined style={{color: '#1890ff'}}/></Tooltip> : null },
        { title: 'Hành động', key: 'action', width: 220, align: 'center', render: (_, record) => (
            <Space size="small">
                <Button icon={<FolderOpenOutlined />} onClick={() => showDetailModal(record)}>Lô hàng</Button>
                <Button icon={<EditOutlined />} onClick={() => handleOpenCrudModal('hopDong', record)}>Sửa</Button>
                <Popconfirm title="Bạn có chắc muốn xóa?"><Button icon={<DeleteOutlined />} danger>Xóa</Button></Popconfirm>
            </Space>
        )},
    ];
    
    const loHangColumns = [
        { title: 'Số Lô hàng', dataIndex: 'so_lh', key: 'so_lh' },
        { title: 'Ngày đóng gói', dataIndex: 'ngay_dong_goi', key: 'ngay_dong_goi' },
        { title: 'Ngày xuất cảng', dataIndex: 'ngay_xuat_cang', key: 'ngay_xuat_cang' },
        { title: 'Cảng xuất', dataIndex: 'cang_xuat', key: 'cang_xuat' },
        { title: 'Cảng nhập', dataIndex: 'cang_nhap', key: 'cang_nhap' },
        { title: 'File', dataIndex: 'file_chung_tu', key: 'file_chung_tu', align: 'center', render: (file) => file ? <Tooltip title={file}><FileOutlined style={{color: '#1890ff'}}/></Tooltip> : null },
        { title: 'Hành động', key: 'action', align: 'center', render: (_, record) => (
            <Space>
                <Button type="link" onClick={() => handleOpenCrudModal('loHang', record)}>Sửa</Button>
                <Popconfirm title="Xóa lô hàng này?"><Button type="link" danger>Xóa</Button></Popconfirm>
            </Space>
        )}
    ];

    const renderCrudForm = () => {
        if (crudModalContent.type === 'hopDong') {
            return <>
                <Form.Item name="so_hd" label="Số hợp đồng" rules={[{ required: true }]}><Input /></Form.Item>
                <Row gutter={16}>
                    <Col span={8}><Form.Item name="ngay_ky" label="Ngày ký" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
                    <Col span={8}><Form.Item name="ngay_hieu_luc" label="Ngày hiệu lực"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
                    <Col span={8}><Form.Item name="ngay_het_han" label="Ngày hết hạn"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}><Form.Item name="gia_tri" label="Giá trị hợp đồng"><InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')}/></Form.Item></Col>
                    <Col span={12}><Form.Item name="id_tt" label="Tiền tệ"><Select placeholder="Chọn tiền tệ">{tienTeList.map(t => <Option key={t.id_tt} value={t.id_tt}>{t.ma_tt}</Option>)}</Select></Form.Item></Col>
                </Row>
                <Form.Item name="file_hop_dong" label="File scan hợp đồng"><Upload maxCount={1}><Button icon={<UploadOutlined />}>Tải lên</Button></Upload></Form.Item>
            </>;
        }
        if (crudModalContent.type === 'loHang') {
            return <>
                <Form.Item name="so_lh" label="Số Lô hàng" rules={[{ required: true }]}><Input /></Form.Item>
                <Row gutter={16}>
                    <Col span={12}><Form.Item name="ngay_dong_goi" label="Ngày đóng gói"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
                    <Col span={12}><Form.Item name="ngay_xuat_cang" label="Ngày xuất cảng"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}><Form.Item name="cang_xuat" label="Cảng xuất"><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item name="cang_nhap" label="Cảng nhập"><Input /></Form.Item></Col>
                </Row>
                <Form.Item name="file_chung_tu" label="File chứng từ"><Upload maxCount={1}><Button icon={<UploadOutlined />}>Tải lên</Button></Upload></Form.Item>
            </>;
        }
        return null;
    };

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col><Title level={3} className="page-header-heading">Quản lý Hợp đồng</Title></Col>
                <Col><Space><Search placeholder="Tìm kiếm hợp đồng..." /><Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenCrudModal('hopDong')}>Thêm mới</Button></Space></Col>
            </Row>
            <Card bordered={false} className="content-card"><Table columns={mainColumns} dataSource={dataSource} rowKey="id_hd" /></Card>
            
            <Modal title={`Danh sách Lô hàng của Hợp đồng: ${selectedHopDong?.so_hd}`} open={isDetailModalOpen} onCancel={() => setDetailModalOpen(false)} footer={null} width="80vw">
                <Button onClick={() => handleOpenCrudModal('loHang')} icon={<PlusOutlined/>} style={{ marginBottom: 16 }}>Thêm Lô hàng</Button>
                <Table columns={loHangColumns} dataSource={loHangDataSource} rowKey="id_lh" size="small"/>
            </Modal>

            <Modal title={crudModalContent.title} open={isCrudModalOpen} onCancel={() => setIsCrudModalOpen(false)} onOk={handleCrudSave} okText="Lưu" cancelText="Hủy">
                <Form form={crudForm} layout="vertical">{renderCrudForm()}</Form>
            </Modal>
        </>
    );
};

export default HopDong;