// // import React, { useState } from 'react';
// // import { Form, Select, DatePicker, Button, Table, InputNumber, Upload, message, Typography, Space, Popconfirm } from 'antd';
// // import { UploadOutlined, SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
// // import { createXuatKhoNPL } from '../../services/xuatkhonpl.service';

// // const { Option } = Select;
// // const { Title } = Typography;

// // // Dữ liệu giả lập
// // const nplList = [{ id_npl: 1, ten_npl: 'Vải Cotton 100%' }, { id_npl: 2, ten_npl: 'Chỉ may Polyester' }];
// // const khoList = [{ id_kho: 1, ten_kho: 'Kho nguyên liệu A' }, { id_kho: 2, ten_kho: 'Kho nguyên liệu B' }];

// // const XuatKhoNPL = () => {
// //     const [form] = Form.useForm();
// //     const [chiTietXuat, setChiTietXuat] = useState([]);

// //     const handleAddRow = () => {
// //         const newRow = { key: Date.now(), id_npl: null, so_luong: 1 };
// //         setChiTietXuat([...chiTietXuat, newRow]);
// //     };

// //     const handleRemoveRow = (key) => {
// //         setChiTietXuat(chiTietXuat.filter(item => item.key !== key));
// //     };

// //     const handleRowChange = (key, field, value) => {
// //         const newData = [...chiTietXuat];
// //         const index = newData.findIndex(item => key === item.key);
// //         if (index > -1) {
// //             newData[index][field] = value;
// //             setChiTietXuat(newData);
// //         }
// //     };

// // const onFinish = async (values) => {
// //     if (!chiTietXuat.length) {
// //         message.error("Không có nguyên phụ liệu nào để xuất!");
// //         return;
// //     }

// //     // Kiểm tra số lượng hợp lệ
// //     for (const item of chiTietXuat) {
// //         if (!item.id_npl) {
// //             message.error("Vui lòng chọn nguyên phụ liệu cho tất cả dòng!");
// //             return;
// //         }
// //         if (!item.so_luong || item.so_luong <= 0) {
// //             message.error("Số lượng xuất phải lớn hơn 0!");
// //             return;
// //         }
// //     }

// //     // Build payload đúng chuẩn API createXuatNPL
// //     const payload = {
// //         id_kho: values.id_kho,
// //         ngay_xuat: values.ngay_xuat.format("YYYY-MM-DD"),
// //         file_phieu: values?.file_phieu || null,
// //         chi_tiets: chiTietXuat.map(item => ({
// //             id_npl: item.id_npl,     // ← dùng đúng id_npl
// //             so_luong: item.so_luong  // ← dùng đúng so_luong
// //         }))
// //     };

// //     console.log("📦 Payload gửi backend:", payload);

// //     try {
// //         const res = await createXuatKhoNPL(payload);

// //         message.success("Tạo phiếu xuất NPL thành công!");

// //         form.resetFields();
// //         setChiTietXuat([]);
// //     } catch (err) {
// //         console.error(err);
// //         message.error(err?.message || "Lỗi khi tạo phiếu xuất NPL!");
// //     }
// // };

// //     const columns = [
// //        {
// //     title: 'Nguyên phụ liệu',
// //     dataIndex: 'id_npl',
// //     render: (_, record) => (
// //         <Select
// //             style={{ width: '100%' }}
// //             placeholder="Chọn NPL"
// //             onChange={(val) => handleRowChange(record.key, 'id_npl', val)}
// //         >
// //             {nplList.map(npl =>
// //                 <Option key={npl.id_npl} value={npl.id_npl}>
// //                     {npl.ten_npl}
// //                 </Option>
// //             )}
// //         </Select>
// //     )
// // },
// // {
// //     title: 'Số lượng xuất',
// //     dataIndex: 'so_luong',
// //     render: (_, record) => (
// //         <InputNumber
// //             min={1}
// //             style={{ width: '100%' }}
// //             defaultValue={1}
// //             onChange={(val) => handleRowChange(record.key, 'so_luong', val)}
// //         />
// //     )
// // },
// //         {
// //             title: 'Hành động', render: (_, record) =>
// //                 <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleRemoveRow(record.key)}>
// //                     <Button icon={<DeleteOutlined />} danger />
// //                 </Popconfirm>
// //         },
// //     ];

// //     return (
// //         <div>
// //             <Title level={3}>Tạo Phiếu Xuất Kho NPL (cho Sản xuất)</Title>
// //             <Form form={form} layout="vertical" onFinish={onFinish}>
// //                 <Form.Item label="Kho xuất hàng" name="id_kho" rules={[{ required: true, message: "Vui lòng chọn kho xuất hàng" }]}>
// //                     <Select placeholder="Chọn kho xuất">
// //                         {khoList.map(k => <Option key={k.id_kho} value={k.id_kho}>{k.ten_kho}</Option>)}
// //                     </Select>
// //                 </Form.Item>
// //                 <Form.Item label="Ngày xuất kho" name="ngay_xuat" rules={[{ required: true, message: "Vui lòng chọn ngày xuất kho" }]}>
// //                     <DatePicker style={{ width: '100%' }} />
// //                 </Form.Item>
                // <Form.Item label="File phiếu xuất (nếu có)" name="file_phieu">
                //     <Upload><Button icon={<UploadOutlined />}>Tải lên</Button></Upload>
                // </Form.Item>

// //                 <Title level={4}>Chi tiết Nguyên Phụ Liệu Cần Xuất</Title>
// //                 <Button onClick={handleAddRow} type="dashed" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>Thêm Nguyên phụ liệu</Button>
// //                 <Table columns={columns} dataSource={chiTietXuat} pagination={false} rowKey="key" bordered />

// //                 <Form.Item style={{ marginTop: 24 }}>
// //                     <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Lưu Phiếu xuất</Button>
// //                 </Form.Item>
// //             </Form>
// //         </div>
// //     );
// // }

// // export default XuatKhoNPL;


import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Button, Table, InputNumber, Upload, message, Typography, Popconfirm, Row, Col, Card, Space, Drawer, Descriptions, Tag } from 'antd';
import { SaveOutlined, PlusOutlined, DeleteOutlined, EyeOutlined, EditOutlined, CloseCircleOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

// --- Giả lập services API ---
const getAllKho = async () => Promise.resolve([
    { id_kho: 1, ten_kho: 'Kho Nguyên liệu A' }, 
    { id_kho: 2, ten_kho: 'Kho Nguyên liệu B' }
]);
const getTonKhoNPLByKho = async (id_kho) => {
    const allTonKhoNPLData = [
        { id_kho: 1, id_npl: 1, ten_npl: 'Vải Cotton 100%', so_luong_ton: 1500.50, don_vi: 'm' },
        { id_kho: 1, id_npl: 2, ten_npl: 'Chỉ may Polyester', so_luong_ton: 80.20, don_vi: 'kg' },
        { id_kho: 2, id_npl: 1, ten_npl: 'Vải Cotton 100%', so_luong_ton: 200.00, don_vi: 'm' },
    ];
    return Promise.resolve(allTonKhoNPLData.filter(item => item.id_kho === id_kho));
};
const getXuatKhoNPL = async () => Promise.resolve([
    { id_xuat: 1, so_phieu: 'PXKNPL-001', ngay_xuat: '2025-11-12', kho: { id_kho: 1, ten_kho: 'Kho Nguyên liệu A'}, chiTietXuatKhoNPLs: [{ id_ct: 1, nguyenPhuLieu: { id_npl: 1, ten_npl: 'Vải Cotton 100%'}, so_luong: 500 }] },
    { id_xuat: 2, so_phieu: 'PXKNPL-002', ngay_xuat: '2025-11-14', kho: { id_kho: 1, ten_kho: 'Kho Nguyên liệu A'}, chiTietXuatKhoNPLs: [{ id_ct: 2, nguyenPhuLieu: { id_npl: 2, ten_npl: 'Chỉ may Polyester'}, so_luong: 10 }] }
]);
const createXuatKhoNPL = async (payload) => Promise.resolve({ success: true, data: payload });
const updateXuatKhoNPL = async (id, payload) => Promise.resolve({ success: true, data: { id_xuat: id, ...payload } });
const deleteXuatKhoNPL = async (id) => Promise.resolve({ success: true });
// -----------------------------

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
            const data = await getXuatKhoNPL();
            setLichSuPhieu(data || []);
        } catch (err) { message.error("Không tải được lịch sử phiếu xuất NPL!"); }
        finally { setLoadingLichSu(false); }
    };
    
    useEffect(() => {
        getAllKho().then(data => setKhoList(data || []));
        fetchLichSu();
    }, []);

    const handleKhoChange = async (id_kho) => {
        setSelectedKhoId(id_kho);
        setChiTietXuat([]);
        if (id_kho) {
            try {
                const data = await getTonKhoNPLByKho(id_kho);
                setNplTrongKho(data || []);
            } catch (error) { message.error("Không thể tải tồn kho của kho này!"); }
        } else {
            setNplTrongKho([]);
        }
    };

    const handleAddRow = () => {
        if (!selectedKhoId) {
            message.warning("Vui lòng chọn kho xuất hàng trước!");
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
        await handleKhoChange(record.kho.id_kho);
        
        form.setFieldsValue({
            id_kho: record.kho.id_kho,
            ngay_xuat: dayjs(record.ngay_xuat),
        });

        // Cần setTimeout nhỏ để đợi state nplTrongKho cập nhật xong sau khi await
        setTimeout(() => {
            const tonKhoHienTai = (nplTrongKho || []).reduce((acc, item) => {
                acc[item.id_npl] = item.so_luong_ton;
                return acc;
            }, {});

            const chiTiet = record.chiTietXuatKhoNPLs.map(item => {
                const tonKho = tonKhoHienTai[item.nguyenPhuLieu.id_npl] || 0;
                return {
                    key: item.id_ct,
                    id_npl: item.nguyenPhuLieu.id_npl,
                    so_luong: item.so_luong,
                    // Tồn kho khả dụng khi sửa = tồn kho hiện tại + lượng đã xuất của chính phiếu này
                    ton_kho: tonKho + item.so_luong,
                    don_vi: item.nguyenPhuLieu.don_vi || '',
                }
            });
            setChiTietXuat(chiTiet);
        }, 100);

        window.scrollTo(0, 0);
    };

    const handleDelete = async (id_xuat) => {
        try {
            await deleteXuatKhoNPL(id_xuat);
            message.success(`Xóa phiếu xuất #${id_xuat} thành công!`);
            fetchLichSu();
        } catch (error) { message.error("Lỗi khi xóa phiếu xuất!"); }
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
            message.error("Vui lòng thêm và chọn nguyên phụ liệu!");
            return;
        }
        setSubmitting(true);
        const payload = {
            id_kho: values.id_kho,
            ngay_xuat: dayjs(values.ngay_xuat).format("YYYY-MM-DD"),
            file_phieu: null,
            chi_tiets: chiTietXuat.map(({ key, ton_kho, don_vi, ...rest }) => rest)
        };
        try {
            if (editingRecord) {
                await updateXuatKhoNPL(editingRecord.id_xuat, payload);
            } else {
                await createXuatKhoNPL(payload);
            }
            message.success(`${editingRecord ? 'Cập nhật' : 'Tạo'} phiếu xuất NPL thành công!`);
            cancelEdit();
            fetchLichSu();
        } catch (err) { message.error(`Lỗi khi ${editingRecord ? 'cập nhật' : 'tạo'} phiếu xuất!`); }
        finally { setSubmitting(false); }
    };

    const columns = [
        { title: 'Nguyên phụ liệu', dataIndex: 'id_npl', width: '40%', render: (_, record) => (<Select style={{ width: '100%' }} placeholder="Chọn NPL" value={record.id_npl} onChange={(val) => handleRowChange(record.key, 'id_npl', val)} showSearch optionFilterProp="children">{nplTrongKho.map(npl => <Option key={npl.id_npl} value={npl.id_npl}>{`${npl.ten_npl} (Tồn: ${npl.so_luong_ton} ${npl.don_vi})`}</Option>)}</Select>) },
        { title: 'Tồn kho khả dụng', dataIndex: 'ton_kho', align: 'center', render: (text, record) => <Text strong>{`${text || 0} ${record.don_vi || ''}`}</Text> },
        { title: 'Số lượng xuất', dataIndex: 'so_luong', render: (_, record) => (<InputNumber min={1} max={record.ton_kho} style={{ width: '100%' }} value={record.so_luong} onChange={(val) => handleRowChange(record.key, 'so_luong', val)} disabled={!record.id_npl}/>) },
        { title: 'Hành động', width: 100, align: 'center', render: (_, record) => <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleRemoveRow(record.key)}><Button icon={<DeleteOutlined/>} danger /></Popconfirm> },
    ];

    const lichSuColumns = [
        { title: 'Số phiếu', dataIndex: 'so_phieu' },
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
                <Title level={3}>{editingRecord ? `Chỉnh sửa Phiếu Xuất kho NPL #${editingRecord.so_phieu}` : 'Tạo Phiếu Xuất Kho NPL (cho Sản xuất)'}</Title>
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

            <Drawer title={`Chi tiết Phiếu xuất: ${selectedPhieu?.so_phieu}`} width={600} open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                {selectedPhieu && <>
                    <Descriptions bordered column={1} size="small" style={{ marginBottom: 24 }}>
                        <Descriptions.Item label="Ngày xuất">{dayjs(selectedPhieu.ngay_xuat).format('DD/MM/YYYY')}</Descriptions.Item>
                        <Descriptions.Item label="Kho xuất">{selectedPhieu.kho.ten_kho}</Descriptions.Item>
                    </Descriptions>
                    <Title level={5}>Danh sách NPL đã xuất</Title>
                    <Table columns={chiTietColumns} dataSource={selectedPhieu.chiTietXuatKhoNPLs} rowKey="id_ct" pagination={false} size="small" bordered />
                </>}
            </Drawer>
        </Space>
    );
};

export default XuatKhoNPL;