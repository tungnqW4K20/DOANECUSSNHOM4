// import React, { useState } from 'react';
// import { Form, Select, DatePicker, Button, Table, InputNumber, Upload, message, Typography, Tag } from 'antd';
// import { UploadOutlined, SendOutlined } from '@ant-design/icons';

// const { Option } = Select;
// const { Title } = Typography;

// // Dữ liệu giả lập
// const hoaDonXuatList = [ { id_hd_xuat: 1, so_hd: 'EXP-2025-001' }];
// const chiTietHDX1 = [
//     { key: 1, id_sp: 1, ten_sp: 'Áo phông cổ tròn', so_luong_hd: 500, ton_kho: 520 },
//     { key: 2, id_sp: 2, ten_sp: 'Quần Jeans Nam', so_luong_hd: 200, ton_kho: 180 },
// ];
// const khoList = [{ id_kho: 3, ten_kho: 'Kho thành phẩm A' }, { id_kho: 4, ten_kho: 'Kho thành phẩm B' }];

// const XuatKhoSP = () => {
//     const [form] = Form.useForm();
//     const [chiTietXuat, setChiTietXuat] = useState([]);
    
//     const handleHoaDonChange = (value) => {
//         if (value === 1) {
//             setChiTietXuat(chiTietHDX1.map(item => ({...item, so_luong_xuat: item.so_luong_hd})));
//         } else {
//             setChiTietXuat([]);
//         }
//     };

//     const handleSoLuongChange = (key, value) => {
//         setChiTietXuat(chiTietXuat.map(item => item.key === key ? { ...item, so_luong_xuat: value } : item));
//     };

//     const onFinish = (values) => {
//         console.log('Received values:', { ...values, chiTiet: chiTietXuat });
//         message.success('Tạo phiếu xuất kho sản phẩm thành công!');
//     };

//     const showDrawer = (record) => { setSelectedPhieu(record); setIsDrawerOpen(true); };

//     const columns = [
//         { title: 'Tên Sản phẩm', dataIndex: 'ten_sp', key: 'ten_sp' },
//         { title: 'Số lượng theo HĐ', dataIndex: 'so_luong_hd', key: 'so_luong_hd' },
//         { title: 'Tồn kho khả dụng', dataIndex: 'ton_kho', key: 'ton_kho' },
//         { title: 'Số lượng thực xuất', dataIndex: 'so_luong_xuat', key: 'so_luong_xuat',
//             render: (text, record) => (
//                 <>
//                     <InputNumber min={0} max={record.ton_kho} defaultValue={text} onChange={(val) => handleSoLuongChange(record.key, val)}/>
//                     {record.so_luong_xuat > record.ton_kho && <Tag color="error" style={{marginLeft: 8}}>Vượt tồn kho!</Tag>}
//                 </>
//             )
//         },
//     ];

//     return (
//         <div>
//             <Title level={3}>Tạo Phiếu Xuất Kho Sản Phẩm</Title>
//             <Form form={form} layout="vertical" onFinish={onFinish}>
//                 <Form.Item label="Hóa đơn xuất liên quan" name="id_hd_xuat" rules={[{ required: true, message: "Vui lòng chọn hóa đơn xuất liên quan!" }]}>
//                     <Select placeholder="Tìm và chọn số hóa đơn xuất" onChange={handleHoaDonChange} showSearch>
//                         {hoaDonXuatList.map(hd => <Option key={hd.id_hd_xuat} value={hd.id_hd_xuat}>{hd.so_hd}</Option>)}
//                     </Select>
//                 </Form.Item>
//                  <Form.Item label="Kho xuất hàng" name="id_kho" rules={[{ required: true, message: "Vui lòng chọn kho xuất hàng" }]}>
//                     <Select placeholder="Chọn kho">
//                         {khoList.map(k => <Option key={k.id_kho} value={k.id_kho}>{k.ten_kho}</Option>)}
//                     </Select>
//                 </Form.Item>
//                 <Form.Item label="Ngày xuất kho" name="ngay_xuat" rules={[{ required: true, message: "Vui lòng chọn ngày xuất kho" }]}>
//                     <DatePicker style={{ width: '100%' }} />
//                 </Form.Item>
//                  <Form.Item label="File phiếu xuất (nếu có)" name="file_phieu">
//                     <Upload><Button icon={<UploadOutlined />}>Tải lên</Button></Upload>
//                 </Form.Item>
                
//                 <Title level={4}>Chi tiết Sản Phẩm Xuất Kho</Title>
//                 <Table columns={columns} dataSource={chiTietXuat} pagination={false} rowKey="key" bordered/>

//                 <Form.Item style={{ marginTop: 24 }}>
//                     <Button type="primary" htmlType="submit" icon={<SendOutlined />}>Xác nhận Xuất kho</Button>
//                 </Form.Item>
//             </Form>
//         </div>
//     );
// }

// export default XuatKhoSP;

import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Button, Table, InputNumber, Upload, message, Typography, Tag, Space, Row, Col, Card, Drawer, Descriptions, Popconfirm } from 'antd';
import { SendOutlined, EyeOutlined, EditOutlined, DeleteOutlined, CloseCircleOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

// --- Dữ liệu và hàm giả lập services API ---
const mockHoaDonXuatList = [
    { id_hd_xuat: 1, so_hd: 'EXP-2025-001', chiTiet: [
        { key: 1, id_sp: 1, ten_sp: 'Áo phông cổ tròn', so_luong_hd: 500, id_qd: 101, ten_dvt_dn: 'Cái' },
        { key: 2, id_sp: 2, ten_sp: 'Quần Jeans Nam', so_luong_hd: 200, id_qd: 102, ten_dvt_dn: 'Cái' },
    ]},
];
const mockKhoList = [ { id_kho: 1, ten_kho: 'Kho Thành phẩm Chính' }, { id_kho: 2, ten_kho: 'Kho Thành phẩm Phụ' } ];
const mockTonKhoData = { kho_1: { sp_1: 300, sp_2: 180 }, kho_2: { sp_1: 220, sp_2: 50 } };
const mockLichSuXuatSP = [
    { id_xuat: 1, so_phieu: 'PXKSP-001', ngay_xuat: '2025-11-15', kho: {id_kho: 1, ten_kho: 'Kho Thành phẩm Chính'}, hoaDonXuat: { id_hd_xuat: 1, so_hd: 'EXP-2025-001'}, chiTietXuatKhoSPs: [{ id_ct: 1, sanPham: {id_sp: 1, ten_sp: 'Áo phông cổ tròn' }, so_luong: 300 }] }
];
const getAllKho = async () => Promise.resolve(mockKhoList);
const getAllHoaDonXuat = async () => Promise.resolve(mockHoaDonXuatList);
const getTonKhoSPByKho = async (id_kho) => Promise.resolve(mockTonKhoData[`kho_${id_kho}`] || {});
const getXuatKhoSP = async () => Promise.resolve(mockLichSuXuatSP);
const createXuatKhoSP = async (payload) => Promise.resolve({ success: true, data: payload });
const updateXuatKhoSP = async (id, payload) => Promise.resolve({ success: true, data: { id_xuat: id, ...payload } });
const deleteXuatKhoSP = async (id) => Promise.resolve({ success: true });
// ------------------------------------------

const XuatKhoSP = () => {
    const [form] = Form.useForm();
    const [chiTietXuat, setChiTietXuat] = useState([]);
    const [khoList, setKhoList] = useState([]);
    const [hoaDonXuatList, setHoaDonXuatList] = useState([]);
    const [selectedKhoId, setSelectedKhoId] = useState(null);
    const [selectedHD, setSelectedHD] = useState(null);
    const [tonKhoTaiKhoChon, setTonKhoTaiKhoChon] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const [lichSuPhieu, setLichSuPhieu] = useState([]);
    const [loadingLichSu, setLoadingLichSu] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedPhieu, setSelectedPhieu] = useState(null);
    const [editingRecord, setEditingRecord] = useState(null);
    
    const fetchLichSu = async () => {
        setLoadingLichSu(true);
        try {
            const data = await getXuatKhoSP();
            setLichSuPhieu(data || []);
        } catch (err) { message.error("Không tải được lịch sử phiếu xuất SP!"); }
        finally { setLoadingLichSu(false); }
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resKho, resHDX] = await Promise.all([getAllKho(), getAllHoaDonXuat()]);
                setKhoList(resKho || []);
                setHoaDonXuatList(resHDX || []);
            } catch (err) { message.error("Không tải được dữ liệu ban đầu!"); }
        };
        fetchData();
        fetchLichSu();
    }, []);

    const handleKhoChange = async (id_kho) => {
        setSelectedKhoId(id_kho);
        form.setFieldsValue({ id_hd_xuat: null });
        setChiTietXuat([]);
        if (id_kho) {
            try {
                const data = await getTonKhoSPByKho(id_kho);
                setTonKhoTaiKhoChon(data || {});
            } catch (error) { message.error("Không thể tải tồn kho của kho này!"); }
        } else {
            setTonKhoTaiKhoChon({});
        }
    };
    
    const handleHoaDonChange = (id_hd_xuat) => {
        const hd = hoaDonXuatList.find(h => h.id_hd_xuat === id_hd_xuat);
        setSelectedHD(hd);
        if (hd && selectedKhoId) {
            const chiTietCapNhat = hd.chiTiet.map(item => ({
                ...item,
                ton_kho: tonKhoTaiKhoChon[item.id_sp] || 0,
                so_luong_xuat: Math.min(item.so_luong_hd, tonKhoTaiKhoChon[item.id_sp] || 0),
            }));
            setChiTietXuat(chiTietCapNhat);
        } else {
            setChiTietXuat([]);
        }
    };
    
    const handleSoLuongChange = (key, value) => {
        setChiTietXuat(chiTietXuat.map(item => item.key === key ? { ...item, so_luong_xuat: value } : item));
    };

    const onFinish = async (values) => {
        const vuotTonKho = chiTietXuat.some(item => item.so_luong_xuat > item.ton_kho);
        if(vuotTonKho) {
            message.error("Số lượng xuất không được vượt quá tồn kho khả dụng!");
            return;
        }
        setSubmitting(true);
        const payload = {
            ...values,
            ngay_xuat: dayjs(values.ngay_xuat).format("YYYY-MM-DD"),
            chi_tiets: chiTietXuat.map(item => ({ id_sp: item.id_sp, so_luong: item.so_luong_xuat, id_qd: item.id_qd })),
        };
        try {
            if (editingRecord) {
                await updateXuatKhoSP(editingRecord.id_xuat, payload);
            } else {
                await createXuatKhoSP(payload);
            }
            message.success(`${editingRecord ? 'Cập nhật' : 'Tạo'} phiếu xuất thành công!`);
            cancelEdit();
            fetchLichSu();
        } catch (error) {
            message.error(`Lỗi khi ${editingRecord ? 'cập nhật' : 'tạo'} phiếu xuất!`);
        } finally {
            setSubmitting(false);
        }
    };
    
    const showDrawer = (record) => { setSelectedPhieu(record); setIsDrawerOpen(true); };
    
    const handleEdit = async (record) => {
        setEditingRecord(record);
        await handleKhoChange(record.kho.id_kho);
        
        setTimeout(() => {
            form.setFieldsValue({
                id_kho: record.kho.id_kho,
                id_hd_xuat: record.hoaDonXuat.id_hd_xuat,
                ngay_xuat: dayjs(record.ngay_xuat),
            });
            const hd = hoaDonXuatList.find(h => h.id_hd_xuat === record.hoaDonXuat.id_hd_xuat);
            setSelectedHD(hd);

            const chiTiet = hd.chiTiet.map(itemHD => {
                const chiTietDaXuat = record.chiTietXuatKhoSPs.find(ctx => ctx.sanPham.id_sp === itemHD.id_sp);
                const soLuongDaXuat = chiTietDaXuat ? chiTietDaXuat.so_luong : 0;
                const tonKhoHienTai = tonKhoTaiKhoChon[itemHD.id_sp] || 0;
                return {
                    ...itemHD,
                    ton_kho: tonKhoHienTai + soLuongDaXuat,
                    so_luong_xuat: soLuongDaXuat,
                }
            });
            setChiTietXuat(chiTiet);
        }, 100);

        window.scrollTo(0, 0);
    };

    const handleDelete = async (id_xuat) => {
        try {
            await deleteXuatKhoSP(id_xuat);
            message.success(`Xóa phiếu xuất #${id_xuat} thành công!`);
            fetchLichSu();
        } catch (error) { message.error("Lỗi khi xóa phiếu xuất!"); }
    };
    
    const cancelEdit = () => {
        setEditingRecord(null);
        form.resetFields();
        setChiTietXuat([]);
        setSelectedKhoId(null);
        setSelectedHD(null);
        setTonKhoTaiKhoChon({});
    };

    const columns = [
        { title: 'Tên Sản phẩm', dataIndex: 'ten_sp' }, { title: 'Đơn vị tính', dataIndex: 'ten_dvt_dn' },
        { title: 'Số lượng theo HĐ', dataIndex: 'so_luong_hd', align: 'center' },
        { title: 'Tồn kho khả dụng', dataIndex: 'ton_kho', align: 'center', render: text => <Text strong>{text}</Text> },
        { title: 'Số lượng thực xuất', dataIndex: 'so_luong_xuat', width: 250, render: (text, record) => (
            <Space>
                <InputNumber min={0} max={record.ton_kho} value={text} onChange={(val) => handleSoLuongChange(record.key, val)}/>
                {text > record.ton_kho && <Tag color="error">Vượt tồn kho!</Tag>}
            </Space>
        )},
    ];

    const lichSuColumns = [
        { title: 'Số phiếu', dataIndex: 'so_phieu' }, { title: 'Ngày xuất', dataIndex: 'ngay_xuat', render: (text) => dayjs(text).format('DD/MM/YYYY') },
        { title: 'Kho xuất', dataIndex: ['kho', 'ten_kho'] }, { title: 'Hóa đơn liên quan', dataIndex: ['hoaDonXuat', 'so_hd'] },
        { title: 'Hành động', key: 'action', width: 220, align: 'center', render: (_, record) => (
            <Space>
                <Button size="small" icon={<EyeOutlined />} onClick={() => showDrawer(record)}>Xem</Button>
                <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id_xuat)}><Button size="small" danger icon={<DeleteOutlined />}>Xóa</Button></Popconfirm>
            </Space>
        )},
    ];

    const chiTietColumns = [
        { title: 'Tên sản phẩm', dataIndex: ['sanPham', 'ten_sp'] },
        { title: 'Số lượng xuất', dataIndex: 'so_luong', align: 'right' },
    ];
    
    const isSubmitDisabled = !selectedKhoId || chiTietXuat.length === 0 || chiTietXuat.some(item => item.so_luong_xuat > item.ton_kho) || chiTietXuat.reduce((sum, item) => sum + item.so_luong_xuat, 0) === 0;

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card bordered={false}>
                <Title level={3}>{editingRecord ? `Chỉnh sửa Phiếu Xuất kho SP #${editingRecord.so_phieu}` : 'Tạo Phiếu Xuất Kho Sản Phẩm'}</Title>
                 <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={24}>
                        <Col span={8}><Form.Item label="Kho xuất hàng" name="id_kho" rules={[{ required: true }]}><Select placeholder="-- Chọn kho trước --" onChange={handleKhoChange} disabled={!!editingRecord}>{khoList.map(k => <Option key={k.id_kho} value={k.id_kho}>{k.ten_kho}</Option>)}</Select></Form.Item></Col>
                        <Col span={8}><Form.Item label="Hóa đơn xuất" name="id_hd_xuat" rules={[{ required: true }]}><Select placeholder="Chọn hóa đơn" onChange={handleHoaDonChange} disabled={!selectedKhoId}>{hoaDonXuatList.map(hd => <Option key={hd.id_hd_xuat} value={hd.id_hd_xuat}>{hd.so_hd}</Option>)}</Select></Form.Item></Col>
                        <Col span={8}><Form.Item label="Ngày xuất kho" name="ngay_xuat" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item></Col>
                    </Row>
                    <Title level={4}>Chi tiết Sản Phẩm Xuất Kho</Title>
                    <Table columns={columns} dataSource={chiTietXuat} pagination={false} rowKey="key" bordered/>
                    <Form.Item style={{ marginTop: 24 }}>
                        <Space>
                            <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={submitting} disabled={isSubmitDisabled}>
                                {editingRecord ? 'Cập nhật' : 'Xác nhận Xuất kho'}
                            </Button>
                            {editingRecord && <Button icon={<CloseCircleOutlined />} onClick={cancelEdit}>Hủy sửa</Button>}
                        </Space>
                    </Form.Item>
                </Form>
            </Card>

            <Card title="Lịch sử Phiếu Xuất kho SP" bordered={false}>
                <Table columns={lichSuColumns} dataSource={lichSuPhieu} rowKey="id_xuat" loading={loadingLichSu} />
            </Card>

            <Drawer title={`Chi tiết Phiếu xuất: ${selectedPhieu?.so_phieu}`} width={600} open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                {selectedPhieu && <>
                    <Descriptions bordered column={1} size="small" style={{ marginBottom: 24 }}>
                        <Descriptions.Item label="Ngày xuất">{dayjs(selectedPhieu.ngay_xuat).format('DD/MM/YYYY')}</Descriptions.Item>
                        <Descriptions.Item label="Kho xuất">{selectedPhieu.kho.ten_kho}</Descriptions.Item>
                        <Descriptions.Item label="Hóa đơn liên quan">{selectedPhieu.hoaDonXuat.so_hd}</Descriptions.Item>
                    </Descriptions>
                    <Title level={5}>Danh sách sản phẩm đã xuất</Title>
                    <Table columns={chiTietColumns} dataSource={selectedPhieu.chiTietXuatKhoSPs} rowKey="id_ct" pagination={false} size="small" bordered />
                </>}
            </Drawer>
        </Space>
    );
};

export default XuatKhoSP;