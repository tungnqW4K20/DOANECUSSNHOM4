import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Button, Table, InputNumber, Upload, Typography, Popconfirm, Row, Col, Card, Space, Drawer, Descriptions } from 'antd';
import { SaveOutlined, PlusOutlined, DeleteOutlined, EyeOutlined, EditOutlined, CloseCircleOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import * as XuatKhoNPLService from '../../services/xuatkhonpl.service';
import { getAllKho } from '../../services/kho.service';
import axios from 'axios';
import { showCreateSuccess, showUpdateSuccess, showDeleteSuccess, showLoadError, showSaveError, showWarning } from '../../components/notification';

const { Option } = Select;
const { Title, Text } = Typography;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const getTonKhoNPLByKho = async (id_kho) => {
    try {
        // Gọi API mới: GET /api/kho/:id_kho/ton-kho-npl
        const response = await axios.get(`${API_BASE_URL}/kho/${id_kho}/ton-kho-npl`, {
            headers: getAuthHeader()
        });
        // Xử lý response có thể là { success, data } hoặc array trực tiếp
        const data = response.data?.data || response.data || [];
        console.log("Tồn kho NPL:", data);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Lỗi getTonKhoNPLByKho:", error);
        throw error.response?.data || error;
    }
};

const XuatKhoNPL = () => {
    const [form] = Form.useForm();
    const [chiTietXuat, setChiTietXuat] = useState([]);
    const [khoList, setKhoList] = useState([]);
    const [selectedKhoId, setSelectedKhoId] = useState(null);
    const [nplTrongKho, setNplTrongKho] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const [lichSuPhieu, setLichSuPhieu] = useState([]);
    const [loadingLichSu, setLoadingLichSu] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedPhieu, setSelectedPhieu] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);

    const fetchLichSu = async () => {
        setLoadingLichSu(true);
        try {
            const response = await XuatKhoNPLService.getAllXuatKhoNPL();
            setLichSuPhieu(response.data || []);
        } catch (err) {
            if (err.status === 401) {
                showWarning('Phiên làm việc hết hạn', 'Vui lòng đăng nhập lại');
            } else {
                showLoadError('lịch sử phiếu xuất NPL');
            }
        } finally { 
            setLoadingLichSu(false); 
        }
    };
    
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await getAllKho();
                // Xử lý response có thể là { success, data } hoặc array trực tiếp
                const khoData = res?.data || res || [];
                setKhoList(Array.isArray(khoData) ? khoData : []);
            } catch (err) {
                if (err.status === 401) {
                    showWarning('Phiên làm việc hết hạn', 'Vui lòng đăng nhập lại');
                } else {
                    showLoadError('danh sách kho');
                }
            }
        };
        
        fetchInitialData();
        fetchLichSu();
    }, []);

    const handleKhoChange = async (id_kho) => {
        setSelectedKhoId(id_kho);
        setChiTietXuat([]);
        if (id_kho) {
            try {
                const data = await getTonKhoNPLByKho(id_kho);
                setNplTrongKho(data || []);
            } catch (error) {
                if (error.status === 401) {
                    showWarning('Phiên làm việc hết hạn', 'Vui lòng đăng nhập lại');
                } else {
                    showLoadError('tồn kho của kho này');
                }
            }
        } else {
            setNplTrongKho([]);
        }
    };

    const handleAddRow = () => {
        if (!selectedKhoId) {
            showWarning('Vui lòng chọn kho xuất hàng trước');
            return;
        }
        const newRow = { key: Date.now(), id_npl: null, so_luong: 1, ton_kho: 0, don_vi: '' };
        setChiTietXuat([...chiTietXuat, newRow]);
    };

    const handleRemoveRow = (key) => setChiTietXuat(chiTietXuat.filter(item => item.key !== key));
    
    const handleRowChange = (key, field, value) => {
        const newData = [...chiTietXuat];
        const index = newData.findIndex(item => key === item.key);
        if (index > -1) {
            if (field === 'id_npl') {
                const selectedNPL = nplTrongKho.find(npl => npl.id_npl === value);
                newData[index].id_npl = value;
                newData[index].ton_kho = selectedNPL ? selectedNPL.so_luong_ton : 0;
                newData[index].don_vi = selectedNPL ? selectedNPL.don_vi : '';
                newData[index].so_luong = 1;
            } else {
                newData[index][field] = value;
            }
            setChiTietXuat(newData);
        }
    };

    const showDrawer = (record) => { setSelectedPhieu(record); setIsDrawerOpen(true); };
    
    const handleEdit = async (record) => {
        setEditingRecord(record);
        // Phải await để đảm bảo nplTrongKho được cập nhật trước khi set chi tiết
        await handleKhoChange(record.kho?.id_kho);
        
        form.setFieldsValue({
            id_kho: record.kho?.id_kho,
            ngay_xuat: dayjs(record.ngay_xuat),
        });

        // Backend trả về chiTiets, không phải chiTietXuatKhoNPLs
        const chiTiets = record.chiTiets || [];
        
        // Cần setTimeout nhỏ để đợi state nplTrongKho cập nhật xong sau khi await
        setTimeout(() => {
            const tonKhoHienTai = (nplTrongKho || []).reduce((acc, item) => {
                acc[item.id_npl] = item.so_luong_ton;
                return acc;
            }, {});

            const chiTiet = chiTiets.map((item, index) => {
                const tonKho = tonKhoHienTai[item.nguyenPhuLieu?.id_npl] || 0;
                return {
                    key: item.id_ct || index,
                    id_npl: item.nguyenPhuLieu?.id_npl,
                    so_luong: item.so_luong,
                    // Tồn kho khả dụng khi sửa = tồn kho hiện tại + lượng đã xuất của chính phiếu này
                    ton_kho: tonKho + item.so_luong,
                    don_vi: item.nguyenPhuLieu?.don_vi || '',
                }
            });
            setChiTietXuat(chiTiet);
        }, 100);

        window.scrollTo(0, 0);
    };

    const handleDelete = async (id_xuat) => {
        try {
            await XuatKhoNPLService.deleteXuatKhoNPL(id_xuat);
            showDeleteSuccess('Phiếu xuất NPL');
            fetchLichSu();
        } catch (error) {
            if (error.status === 401) {
                showWarning('Phiên làm việc hết hạn', 'Vui lòng đăng nhập lại');
            } else {
                showSaveError('phiếu xuất NPL');
            }
        }
    };
    
    const cancelEdit = () => {
        setEditingRecord(null);
        form.resetFields();
        setChiTietXuat([]);
        setSelectedKhoId(null);
        setNplTrongKho([]);
    };
    
    const onFinish = async (values) => {
        if (!chiTietXuat.length || chiTietXuat.some(item => !item.id_npl)) {
            showWarning('Vui lòng thêm và chọn nguyên phụ liệu');
            return;
        }
        
        // Validate số lượng xuất không vượt quá tồn kho
        for (const item of chiTietXuat) {
            if (item.so_luong > item.ton_kho) {
                showWarning('Số lượng xuất không được vượt quá tồn kho khả dụng');
                return;
            }
        }
        
        setSubmitting(true);
        const payload = {
            id_kho: values.id_kho,
            ngay_xuat: dayjs(values.ngay_xuat).format("YYYY-MM-DD"),
            file_phieu: null,
            chi_tiets: chiTietXuat.map((item) => ({
                id_npl: item.id_npl,
                so_luong: item.so_luong
            }))
        };
        
        try {
            if (editingRecord) {
                await XuatKhoNPLService.updateXuatKhoNPL(editingRecord.id_xuat, payload);
                showUpdateSuccess('Phiếu xuất NPL');
            } else {
                await XuatKhoNPLService.createXuatKhoNPL(payload);
                showCreateSuccess('Phiếu xuất NPL');
            }
            cancelEdit();
            fetchLichSu();
        } catch (err) {
            if (err.status === 401) {
                showWarning('Phiên làm việc hết hạn', 'Vui lòng đăng nhập lại');
            } else {
                showSaveError('phiếu xuất NPL');
            }
        } finally { 
            setSubmitting(false); 
        }
    };

    const columns = [
        { title: 'Nguyên phụ liệu', dataIndex: 'id_npl', width: '40%', render: (_, record) => (<Select style={{ width: '100%' }} placeholder="Chọn NPL" value={record.id_npl} onChange={(val) => handleRowChange(record.key, 'id_npl', val)} showSearch optionFilterProp="children">{nplTrongKho.map(npl => <Option key={npl.id_npl} value={npl.id_npl}>{`${npl.ten_npl} (Tồn: ${npl.so_luong_ton} ${npl.don_vi})`}</Option>)}</Select>) },
        { title: 'Tồn kho khả dụng', dataIndex: 'ton_kho', align: 'center', render: (text, record) => <Text strong>{`${text || 0} ${record.don_vi || ''}`}</Text> },
        { title: 'Số lượng xuất', dataIndex: 'so_luong', render: (_, record) => (<InputNumber min={1} max={record.ton_kho} style={{ width: '100%' }} value={record.so_luong} onChange={(val) => handleRowChange(record.key, 'so_luong', val)} disabled={!record.id_npl}/>) },
        { title: 'Hành động', width: 100, align: 'center', render: (_, record) => <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleRemoveRow(record.key)}><Button icon={<DeleteOutlined/>} danger /></Popconfirm> },
    ];

    const lichSuColumns = [
        { title: 'Số phiếu', dataIndex: 'so_phieu', render: (text, record) => text || `PXKNPL-${record.id_xuat}` },
        { title: 'Ngày xuất', dataIndex: 'ngay_xuat', render: (text) => dayjs(text).format('DD/MM/YYYY') },
        { title: 'Kho xuất', dataIndex: ['kho', 'ten_kho'] },
        { title: 'Hành động', key: 'action', width: 220, align: 'center', render: (_, record) => (
            <Space>
                <Button size="small" icon={<EyeOutlined />} onClick={() => showDrawer(record)}>Xem</Button>
                <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id_xuat)}><Button size="small" danger icon={<DeleteOutlined />}>Xóa</Button></Popconfirm>
            </Space>
        )},
    ];
    const chiTietColumns = [
        { title: 'Tên Nguyên phụ liệu', dataIndex: ['nguyenPhuLieu', 'ten_npl'] },
        { title: 'Số lượng xuất', dataIndex: 'so_luong', align: 'right' },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card bordered={false}>
                <Title level={3}>{editingRecord ? `Chỉnh sửa Phiếu Xuất kho NPL #${editingRecord.so_phieu || `PXKNPL-${editingRecord.id_xuat}`}` : 'Tạo Phiếu Xuất Kho NPL (cho Sản xuất)'}</Title>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={24}>
                        <Col span={12}><Form.Item label="Kho xuất hàng" name="id_kho" rules={[{ required: true, message: "Vui lòng chọn kho xuất" }]}><Select placeholder={editingRecord ? null : "-- Trước tiên, hãy chọn kho --"} onChange={handleKhoChange} disabled={!!editingRecord}>{khoList.map(k => <Option key={k.id_kho} value={k.id_kho}>{k.ten_kho}</Option>)}</Select></Form.Item></Col>
                        <Col span={12}><Form.Item label="Ngày xuất kho" name="ngay_xuat" rules={[{ required: true, message: "Vui lòng chọn ngày xuất" }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
                    </Row>
                    <Form.Item label="File phiếu xuất (nếu có)" name="file_phieu">
                        <Upload><Button icon={<UploadOutlined />}>Tải lên</Button></Upload>
                    </Form.Item>
                    <Title level={4}>Chi tiết Nguyên Phụ Liệu Cần Xuất</Title>
                    <Button onClick={handleAddRow} type="dashed" icon={<PlusOutlined />} style={{ marginBottom: 16 }} disabled={!selectedKhoId}>Thêm Nguyên phụ liệu</Button>
                    <Table columns={columns} dataSource={chiTietXuat} pagination={false} rowKey="key" bordered/>
                    <Form.Item style={{ marginTop: 24 }}>
                        <Space>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting}>{editingRecord ? 'Cập nhật Phiếu xuất' : 'Lưu Phiếu xuất'}</Button>
                            {editingRecord && <Button icon={<CloseCircleOutlined />} onClick={cancelEdit}>Hủy sửa</Button>}
                        </Space>
                    </Form.Item>
                </Form>
            </Card>

            <Card title="Lịch sử Phiếu Xuất kho NPL" bordered={false}>
                <Table columns={lichSuColumns} dataSource={lichSuPhieu} rowKey="id_xuat" loading={loadingLichSu} />
            </Card>

            <Drawer title={`Chi tiết Phiếu xuất: ${selectedPhieu?.so_phieu || `PXKNPL-${selectedPhieu?.id_xuat}`}`} width={600} open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                {selectedPhieu && <>
                    <Descriptions bordered column={1} size="small" style={{ marginBottom: 24 }}>
                        <Descriptions.Item label="Ngày xuất">{dayjs(selectedPhieu.ngay_xuat).format('DD/MM/YYYY')}</Descriptions.Item>
                        <Descriptions.Item label="Kho xuất">{selectedPhieu.kho?.ten_kho}</Descriptions.Item>
                    </Descriptions>
                    <Title level={5}>Danh sách NPL đã xuất</Title>
                    <Table columns={chiTietColumns} dataSource={selectedPhieu.chiTiets || []} rowKey="id_ct" pagination={false} size="small" bordered />
                </>}
            </Drawer>
        </Space>
    );
};

export default XuatKhoNPL;