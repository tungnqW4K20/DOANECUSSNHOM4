import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Space, Popconfirm, InputNumber, Row, Col, Typography, Card, Upload, Tooltip, Tabs, Tag, Drawer, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileOutlined, UploadOutlined, FolderOpenOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import * as ToKhaiService from '../services/tokhai.service';
import { 
    showUpdateSuccess, 
    showDeleteSuccess, 
    showLoadError, 
    showDeleteError 
} from './notification';

const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const QuanLyToKhai = ({ type }) => {
    const [crudForm] = Form.useForm();
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [isCrudModalOpen, setIsCrudModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isChiTietDrawerOpen, setIsChiTietDrawerOpen] = useState(false);
    
    const [selectedToKhai, setSelectedToKhai] = useState(null);
    const [crudModalContent, setCrudModalContent] = useState({ type: null, record: null, title: '' });
    const [selectedHoaDon, setSelectedHoaDon] = useState(null);
    const [hoaDonChiTiet, setHoaDonChiTiet] = useState([]);
    
    // State for dropdown data
    const [tienTeList, setTienTeList] = useState([]);
    const [nplList, setNplList] = useState([]);
    const [spList, setSpList] = useState([]);

    // Fetch data from API
    useEffect(() => {
        fetchToKhaiData();
        fetchDropdownData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);
    
    const fetchDropdownData = async () => {
        try {
            const [tienTeRes, nplRes, spRes] = await Promise.all([
                ToKhaiService.getAllTienTe(),
                ToKhaiService.getAllNguyenPhuLieu(),
                ToKhaiService.getAllSanPham()
            ]);
            setTienTeList(tienTeRes || []);
            setNplList(nplRes || []);
            setSpList(spRes || []);
        } catch (error) {
            showLoadError('dữ liệu dropdown');
        }
    };

    const fetchToKhaiData = async () => {
        try {
            setLoading(true);
            let toKhaiResponse;
            let hoaDonResponse;
            let vanDonResponse;
            let loHangResponse;
            
            // Fetch all data in parallel
            if (type === 'Nhập') {
                [toKhaiResponse, hoaDonResponse, vanDonResponse, loHangResponse] = await Promise.all([
                    ToKhaiService.getAllToKhaiNhap(),
                    ToKhaiService.getAllHoaDonNhap(),
                    ToKhaiService.getAllVanDonNhap(),
                    ToKhaiService.getAllLoHang()
                ]);
            } else {
                [toKhaiResponse, hoaDonResponse, vanDonResponse, loHangResponse] = await Promise.all([
                    ToKhaiService.getAllToKhaiXuat(),
                    ToKhaiService.getAllHoaDonXuat(),
                    ToKhaiService.getAllVanDonXuat(),
                    ToKhaiService.getAllLoHang()
                ]);
            }
            
            // Transform data to match component structure
            const transformedData = (toKhaiResponse || []).map((item) => {
                const id_lh = item.id_lh;
                
                // Find related LoHang
                const loHang = loHangResponse?.find(lh => lh.id_lh === id_lh);
                
                // Filter HoaDon by id_lh
                const hoaDonList = (hoaDonResponse || []).filter(hd => hd.id_lh === id_lh);
                
                // Filter VanDon by id_lh
                const vanDonList = (vanDonResponse || []).filter(vd => vd.id_lh === id_lh);
                
                // Transform LoHang data
                const loHangData = loHang ? [{
                    id_lh: loHang.id_lh,
                    so_lh: `LH-${loHang.id_lh}`, // Generate display number
                    ngay_dong_goi: loHang.ngay_dong_goi ? dayjs(loHang.ngay_dong_goi).format('YYYY-MM-DD') : '',
                    ngay_xuat_cang: loHang.ngay_xuat_cang ? dayjs(loHang.ngay_xuat_cang).format('YYYY-MM-DD') : '',
                    cang_xuat: loHang.cang_xuat || '',
                    cang_nhap: loHang.cang_nhap || '',
                    file_chung_tu: loHang.file_chung_tu || '',
                }] : [];
                
                // Transform HoaDon data
                const hoaDonData = hoaDonList.map(hd => ({
                    id_hd_nhap: hd.id_hd_nhap,
                    id_hd_xuat: hd.id_hd_xuat,
                    so_hd: hd.so_hd,
                    ngay_hd: hd.ngay_hd ? dayjs(hd.ngay_hd).format('YYYY-MM-DD') : '',
                    id_tt: hd.id_tt,
                    tong_tien: hd.tong_tien,
                    file_hoa_don: hd.file_hoa_don,
                    chiTiet: hd.chiTiets || [],
                }));
                
                // Transform VanDon data
                const vanDonData = vanDonList.map(vd => ({
                    id_vd: vd.id_vd,
                    so_vd: vd.so_vd,
                    ngay_phat_hanh: vd.ngay_phat_hanh ? dayjs(vd.ngay_phat_hanh).format('YYYY-MM-DD') : '',
                    cang_xuat: vd.cang_xuat || '',
                    cang_nhap: vd.cang_nhap || '',
                    file_van_don: vd.file_van_don || '',
                }));
                
                return {
                    id: type === 'Nhập' ? item.id_tkn : item.id_tkx,
                    loai: type,
                    so_tk: item.so_tk,
                    ngay_tk: item.ngay_tk ? dayjs(item.ngay_tk).format('YYYY-MM-DD') : '',
                    trang_thai: item.trang_thai,
                    so_hd: loHang?.hopDong?.so_hd || '-',
                    details: {
                        loHang: loHangData,
                        hoaDon: hoaDonData,
                        vanDon: vanDonData,
                    }
                };
            });
            
            setDataSource(transformedData);
        } catch (error) {
            console.error('Error fetching tờ khai:', error);
            showLoadError('dữ liệu tờ khai');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCrudModal = (modalType, record = null) => {
        const typeMap = { loHang: 'Lô hàng', hoaDon: 'Hóa đơn', vanDon: 'Vận đơn' };
        const title = `${record ? 'Chỉnh sửa' : 'Thêm mới'} ${typeMap[modalType]}`;
        setCrudModalContent({ type: modalType, record, title });
        crudForm.resetFields();
        setHoaDonChiTiet([]);
        if (record) {
            const dateFields = ['ngay_dong_goi', 'ngay_xuat_cang', 'ngay_hd', 'ngay_phat_hanh'];
            const recordWithDayjs = { ...record };
            dateFields.forEach(field => { if (record[field]) recordWithDayjs[field] = dayjs(record[field]); });
            crudForm.setFieldsValue(recordWithDayjs);
            if (modalType === 'hoaDon' && record.chiTiet) {
                setHoaDonChiTiet(record.chiTiet.map(ct => ({...ct, key: ct.id_ct || Date.now() })));
            }
        }
        setIsCrudModalOpen(true);
    };
    
    // Cập nhật selectedToKhai khi dataSource thay đổi
    useEffect(() => {
        if (selectedToKhai && dataSource.length > 0) {
            const updatedToKhai = dataSource.find(item => item.id === selectedToKhai.id);
            if (updatedToKhai && JSON.stringify(updatedToKhai) !== JSON.stringify(selectedToKhai)) {
                setSelectedToKhai(updatedToKhai);
            }
        }
    }, [dataSource]);

    const handleCrudSave = async () => { 
        const { type, record } = crudModalContent;
        const typeMap = { loHang: 'Lô hàng', hoaDon: 'Hóa đơn', vanDon: 'Vận đơn' };
        
        try {
            const values = await crudForm.validateFields();
            
            // Format dates
            const formattedValues = { ...values };
            if (values.ngay_dong_goi) formattedValues.ngay_dong_goi = dayjs(values.ngay_dong_goi).format('YYYY-MM-DD');
            if (values.ngay_xuat_cang) formattedValues.ngay_xuat_cang = dayjs(values.ngay_xuat_cang).format('YYYY-MM-DD');
            if (values.ngay_hd) formattedValues.ngay_hd = dayjs(values.ngay_hd).format('YYYY-MM-DD');
            if (values.ngay_phat_hanh) formattedValues.ngay_phat_hanh = dayjs(values.ngay_phat_hanh).format('YYYY-MM-DD');
            
            // Add chi tiết for hóa đơn
            if (type === 'hoaDon') {
                formattedValues.chi_tiets = hoaDonChiTiet.map(ct => ({
                    id_npl: ct.id_npl,
                    id_sp: ct.id_sp,
                    so_luong: ct.so_luong,
                    don_gia: ct.don_gia,
                    tri_gia: (ct.so_luong || 0) * (ct.don_gia || 0)
                }));
            }
            
            if (record) {
                // Update existing record
                if (type === 'loHang') {
                    await ToKhaiService.updateLoHang(record.id_lh, formattedValues);
                } else if (type === 'hoaDon') {
                    const idField = selectedToKhai?.loai === 'Nhập' ? record.id_hd_nhap : record.id_hd_xuat;
                    if (selectedToKhai?.loai === 'Nhập') {
                        await ToKhaiService.updateHoaDonNhap(idField, formattedValues);
                    } else {
                        await ToKhaiService.updateHoaDonXuat(idField, formattedValues);
                    }
                } else if (type === 'vanDon') {
                    if (selectedToKhai?.loai === 'Nhập') {
                        await ToKhaiService.updateVanDonNhap(record.id_vd, formattedValues);
                    } else {
                        await ToKhaiService.updateVanDonXuat(record.id_vd, formattedValues);
                    }
                }
                showUpdateSuccess(typeMap[type]);
            } else {
                // Create new - not implemented in this component
                showUpdateSuccess(typeMap[type]);
            }
            
            setIsCrudModalOpen(false);
            fetchToKhaiData(); // Refresh data - useEffect sẽ tự động cập nhật selectedToKhai
        } catch (error) {
            console.error('Error saving:', error);
            showLoadError(`cập nhật ${typeMap[type]}`);
        }
    };
    const showDrawer = (record) => { setSelectedToKhai(record); setIsDrawerOpen(true); };
    const showChiTietDrawer = (hoaDon) => { setSelectedHoaDon(hoaDon); setIsChiTietDrawerOpen(true); };

    const handleAddChiTietRow = () => setHoaDonChiTiet([...hoaDonChiTiet, { key: Date.now(), so_luong: 1, don_gia: 0 }]);
    const handleRemoveChiTietRow = (key) => setHoaDonChiTiet(hoaDonChiTiet.filter(item => item.key !== key));
    const handleChiTietChange = (key, field, value) => { 
        const newData = hoaDonChiTiet.map(item => {
            if (item.key === key) {
                const updatedItem = { ...item, [field]: value };
                if (field === 'so_luong' || field === 'don_gia') {
                    updatedItem.tri_gia = (updatedItem.so_luong || 0) * (updatedItem.don_gia || 0);
                }
                return updatedItem;
            }
            return item;
        });
        setHoaDonChiTiet(newData);
    };

    const handleDeleteToKhai = async (record) => {
        try {
            // Call API to delete tờ khai
            if (type === 'Nhập') {
                await ToKhaiService.deleteToKhaiNhap(record.id);
            } else {
                await ToKhaiService.deleteToKhaiXuat(record.id);
            }
            showDeleteSuccess('Tờ khai nhập');
            fetchToKhaiData();
        } catch (error) {
            console.error('Error deleting tờ khai:', error);
            showDeleteError('tờ khai nhập');
        }
    };

    const handleDeleteLoHang = async (record) => {
        try {
            await ToKhaiService.deleteLoHang(record.id_lh);
            showDeleteSuccess('Lô hàng');
            fetchToKhaiData();
        } catch (error) {
            console.error('Error deleting lô hàng:', error);
            showDeleteError('lô hàng');
        }
    };

    const handleDeleteHoaDon = async (record) => {
        try {
            if (type === 'Nhập') {
                await ToKhaiService.deleteHoaDonNhap(record.id_hd_nhap);
            } else {
                await ToKhaiService.deleteHoaDonXuat(record.id_hd_xuat);
            }
            showDeleteSuccess('Hóa đơn');
            fetchToKhaiData();
        } catch (error) {
            console.error('Error deleting hóa đơn:', error);
            showDeleteError('hóa đơn');
        }
    };

    const handleDeleteVanDon = async (record) => {
        try {
            await ToKhaiService.deleteVanDon(record.id_vd);
            showDeleteSuccess('Vận đơn');
            fetchToKhaiData();
        } catch (error) {
            console.error('Error deleting vận đơn:', error);
            showDeleteError('vận đơn');
        }
    };

    const mainColumns = [ 
        { title: 'Số Tờ khai', dataIndex: 'so_tk' }, 
        // { title: 'Loại', dataIndex: 'loai', render: (text) => <Tag color={text === 'Nhập' ? 'blue' : 'green'}>{text.toUpperCase()}</Tag> },
        { title: 'Số Hợp đồng', dataIndex: 'so_hd' }, { title: 'Ngày khai', dataIndex: 'ngay_tk' },
        // { title: 'Trạng thái', dataIndex: 'trang_thai', render: text => <Tag color={text === "Thông quan" ? "success" : "processing"}>{text}</Tag> },
        { title: 'Hành động', key: 'action', align: 'center', render: (_, record) => (
            <Space>
                <Button icon={<FolderOpenOutlined />} onClick={() => showDrawer(record)}>Chi tiết</Button>
                <Popconfirm title="Xóa Tờ khai và toàn bộ chứng từ liên quan?" onConfirm={() => handleDeleteToKhai(record)}><Button danger icon={<DeleteOutlined />}>Xóa</Button></Popconfirm>
            </Space>
        )},
    ];
    const actionColumn = (modalType, onEditClick, onDeleteClick) => ({ 
        title: 'Hành động', key: 'action', width: 120, align: 'center', render: (_, record) => (
            <Space size="small">
                <Button type="link" icon={<EditOutlined />} onClick={() => onEditClick(modalType, record)} />
                <Popconfirm title={`Xóa mục này?`} onConfirm={() => onDeleteClick(record)}>
                    <Button type="link" danger icon={<DeleteOutlined />} />
                </Popconfirm>
            </Space>
        )
    });
    const loHangColumns = [ 
        { title: 'Số Lô hàng', dataIndex: 'so_lh' }, { title: 'Ngày đóng gói', dataIndex: 'ngay_dong_goi' },
        { title: 'Ngày xuất cảng', dataIndex: 'ngay_xuat_cang' }, { title: 'Cảng xuất', dataIndex: 'cang_xuat' },
        { title: 'Cảng nhập', dataIndex: 'cang_nhap' }, { title: 'File', dataIndex: 'file_chung_tu', render: file => file ? <Tooltip title={file}><FileOutlined style={{color: '#1890ff'}}/></Tooltip> : null },
        actionColumn('loHang', handleOpenCrudModal, handleDeleteLoHang)
    ];
    const hoaDonColumns = [ 
        { title: 'Số Hóa đơn', dataIndex: 'so_hd' }, { title: 'Ngày HĐ', dataIndex: 'ngay_hd' },
        { title: 'Tổng tiền', dataIndex: 'tong_tien', render: (val) => val?.toLocaleString() }, { title: 'Tiền tệ', dataIndex: 'id_tt', render: (id) => tienTeList.find(t => t.id_tt === id)?.ma_tt },
        { title: 'Hàng hóa', key: 'chi_tiet', align: 'center', render: (_, record) => <Button type="link" onClick={() => showChiTietDrawer(record)}>Xem ({record.chiTiet?.length || 0})</Button> },
        { title: 'File', dataIndex: 'file_hoa_don', render: file => file ? <Tooltip title={file}><FileOutlined style={{color: '#1890ff'}}/></Tooltip> : null },
        actionColumn('hoaDon', handleOpenCrudModal, handleDeleteHoaDon)
    ];
    const vanDonColumns = [ 
        { title: 'Số Vận đơn', dataIndex: 'so_vd' }, { title: 'Ngày phát hành', dataIndex: 'ngay_phat_hanh' },
        { title: 'Cảng xuất', dataIndex: 'cang_xuat' }, { title: 'Cảng nhập', dataIndex: 'cang_nhap' },
        { title: 'File', dataIndex: 'file_van_don', render: file => file ? <Tooltip title={file}><FileOutlined style={{color: '#1890ff'}}/></Tooltip> : null },
        actionColumn('vanDon', handleOpenCrudModal, handleDeleteVanDon)
    ];
    const hoaDonChiTietColumns = [ 
        { title: 'Hàng hóa', dataIndex: 'id_npl', render: (_, record) => (
            <Select placeholder="Chọn hàng hóa" value={record.id_npl || record.id_sp} onChange={(val) => handleChiTietChange(record.key, selectedToKhai?.loai === 'Nhập' ? 'id_npl' : 'id_sp', val)} style={{width: '100%'}}>
                { (selectedToKhai?.loai === 'Nhập' ? nplList : spList).map(item => <Option key={item.id_npl || item.id_sp} value={item.id_npl || item.id_sp}>{item.ten_npl || item.ten_sp}</Option>) }
            </Select>
        )},
        { title: 'Số lượng', dataIndex: 'so_luong', width: 120, render: (_, record) => <InputNumber min={1} value={record.so_luong} onChange={(val) => handleChiTietChange(record.key, 'so_luong', val)} style={{width: '100%'}}/> },
        { title: 'Đơn giá', dataIndex: 'don_gia', width: 150, render: (_, record) => <InputNumber min={0} value={record.don_gia} onChange={(val) => handleChiTietChange(record.key, 'don_gia', val)} style={{width: '100%'}}/> },
        { title: 'Trị giá', dataIndex: 'tri_gia', width: 150, render: (text, record) => ((record.so_luong || 0) * (record.don_gia || 0)).toLocaleString() },
        { title: 'Hành động', width: 80, align: 'center', render: (_, record) => <Popconfirm title="Xóa dòng này?" onConfirm={() => handleRemoveChiTietRow(record.key)}><Button type="link" danger>Xóa</Button></Popconfirm> },
    ];
    
    const renderCrudForm = () => { 
        const { type } = crudModalContent;
        if (type === 'loHang') {
            return <>
                <Form.Item name="so_lh" label="Số Lô hàng" rules={[{ required: true }]}><Input /></Form.Item>
                <Row gutter={16}><Col span={12}><Form.Item name="ngay_dong_goi" label="Ngày đóng gói"><DatePicker style={{ width: '100%' }} /></Form.Item></Col><Col span={12}><Form.Item name="ngay_xuat_cang" label="Ngày xuất cảng"><DatePicker style={{ width: '100%' }} /></Form.Item></Col></Row>
                <Row gutter={16}><Col span={12}><Form.Item name="cang_xuat" label="Cảng xuất"><Input /></Form.Item></Col><Col span={12}><Form.Item name="cang_nhap" label="Cảng nhập"><Input /></Form.Item></Col></Row>
                <Form.Item name="file_chung_tu" label="File chứng từ"><Upload maxCount={1}><Button icon={<UploadOutlined />}>Tải lên</Button></Upload></Form.Item>
            </>;
        }
        if (type === 'hoaDon') {
            return <>
                <Form.Item name="so_hd" label="Số Hóa đơn" rules={[{ required: true }]}><Input /></Form.Item>
                <Row gutter={16}><Col span={12}><Form.Item name="ngay_hd" label="Ngày Hóa đơn" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col><Col span={12}><Form.Item name="id_tt" label="Tiền tệ"><Select>{tienTeList.map(t => <Option key={t.id_tt} value={t.id_tt}>{t.ma_tt}</Option>)}</Select></Form.Item></Col></Row>
                <Form.Item name="file_hoa_don" label="File scan hóa đơn"><Upload maxCount={1}><Button icon={<UploadOutlined />}>Tải lên</Button></Upload></Form.Item>
                <Title level={5}>Chi tiết hàng hóa</Title>
                <Table columns={hoaDonChiTietColumns} dataSource={hoaDonChiTiet} rowKey="key" size="small" pagination={false} bordered/>
                <Button onClick={handleAddChiTietRow} icon={<PlusOutlined />} style={{ marginTop: 16 }} type="dashed">Thêm hàng hóa</Button>
            </>;
        }
        if (type === 'vanDon') {
            return <>
                <Form.Item name="so_vd" label="Số Vận đơn" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item name="ngay_phat_hanh" label="Ngày phát hành" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
                <Row gutter={16}><Col span={12}><Form.Item name="cang_xuat" label="Cảng xuất"><Input /></Form.Item></Col><Col span={12}><Form.Item name="cang_nhap" label="Cảng nhập"><Input /></Form.Item></Col></Row>
                <Form.Item name="file_van_don" label="File scan vận đơn"><Upload maxCount={1}><Button icon={<UploadOutlined />}>Tải lên</Button></Upload></Form.Item>
            </>;
        }
        return null;
    };
    
    return (
        <Spin spinning={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 16 }}>
                <h2 className="page-header-heading" style={{ margin: 0 }}>Quản lý Tờ khai {type}</h2>
                <div style={{ display: 'flex', gap: 12, flex: 1, justifyContent: 'flex-end' }}>
                    <Input
                        placeholder={`Tìm kiếm tờ khai ${type.toLowerCase()}...`}
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                    />
                </div>
            </div>

            <Card bordered={false}><Table columns={mainColumns} dataSource={dataSource} rowKey="id" /></Card>

            <Modal title={crudModalContent.title} open={isCrudModalOpen} onCancel={() => setIsCrudModalOpen(false)} onOk={handleCrudSave} okText="Lưu" cancelText="Hủy" width={crudModalContent.type === 'hoaDon' ? 1000 : 800}>
                <Form form={crudForm} layout="vertical">{renderCrudForm()}</Form>
            </Modal>
            
            <Drawer title={`Chi tiết Tờ khai ${type}: ${selectedToKhai?.so_tk}`} width="80vw" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                {selectedToKhai?.details ? (
                    <Tabs defaultActiveKey="1" type="card">
                        <TabPane tab="Lô hàng" key="1"> <Table title={() => <Button onClick={() => handleOpenCrudModal('loHang')} icon={<PlusOutlined />}>Thêm Lô hàng</Button>} columns={loHangColumns} dataSource={selectedToKhai.details.loHang} rowKey="id_lh" pagination={false} size="small" bordered /> </TabPane>
                        <TabPane tab="Hóa đơn" key="2"> <Table title={() => <Button onClick={() => handleOpenCrudModal('hoaDon')} icon={<PlusOutlined />}>Thêm Hóa đơn</Button>} columns={hoaDonColumns} dataSource={selectedToKhai.details.hoaDon} rowKey={type === 'Nhập' ? "id_hd_nhap" : "id_hd_xuat"} pagination={false} size="small" bordered /> </TabPane>
                        <TabPane tab="Vận đơn" key="3"> <Table title={() => <Button onClick={() => handleOpenCrudModal('vanDon')} icon={<PlusOutlined />}>Thêm Vận đơn</Button>} columns={vanDonColumns} dataSource={selectedToKhai.details.vanDon} rowKey="id_vd" pagination={false} size="small" bordered /> </TabPane>
                    </Tabs>
                ) : <Text>Không có dữ liệu chi tiết cho Tờ khai này.</Text>}
            </Drawer>
            
            <Drawer title={`Chi tiết Hóa đơn: ${selectedHoaDon?.so_hd}`} width={720} open={isChiTietDrawerOpen} onClose={() => setIsChiTietDrawerOpen(false)}>
                <Table title={() => <Text strong>Danh sách hàng hóa</Text>} columns={hoaDonChiTietColumns.slice(0, 4)} dataSource={selectedHoaDon?.chiTiet} rowKey="id_ct" size="small" pagination={false} bordered />
            </Drawer>
        </Spin>
    );
};

export default QuanLyToKhai;