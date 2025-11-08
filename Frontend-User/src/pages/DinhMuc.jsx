import React, { useState } from 'react';
import { Table, Button, Modal, Form, Select, InputNumber, Space, message, Typography, Row, Col, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

// --- Dữ liệu giả lập ---
const LOGGED_IN_DN_ID = 1;

const spList = [
    { id_sp: 1, ten_sp: 'Áo phông cổ tròn' }, 
    { id_sp: 2, ten_sp: 'Quần Jeans Nam' }
];
const nplList = [
    { id_npl: 1, ten_npl: 'Vải Cotton 100%' }, 
    { id_npl: 2, ten_npl: 'Chỉ may Polyester' },
    { id_npl: 3, ten_npl: 'Cúc áo nhựa' }
];

// Dữ liệu giả lập theo cấu trúc nhóm
const initialDinhMucGrouped = [
    { 
        id_sp: 1, 
        ten_sp: 'Áo phông cổ tròn',
        dinh_muc_chi_tiet: [
            { id_dm: 1, id_npl: 1, so_luong: 1.5 },
            { id_dm: 2, id_npl: 2, so_luong: 0.05 }
        ]
    }
];
// -----------------------

const DinhMuc = () => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [dinhMucDetails, setDinhMucDetails] = useState([]); // State để quản lý các dòng NPL trong modal
    const [allDinhMuc, setAllDinhMuc] = useState(initialDinhMucGrouped);

    const handleOpenModal = (product = null) => {
        setEditingProduct(product);
        if (product) {
            // Chế độ sửa: tải chi tiết định mức của sản phẩm được chọn
            const details = product.dinh_muc_chi_tiet.map(dm => ({ ...dm, key: dm.id_dm || Date.now() }));
            setDinhMucDetails(details);
            form.setFieldsValue({ id_sp: product.id_sp });
        } else {
            // Chế độ thêm mới: reset
            setDinhMucDetails([]);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleAddRow = () => {
        const newRow = { key: Date.now(), id_npl: null, so_luong: 1 };
        setDinhMucDetails([...dinhMucDetails, newRow]);
    };

    const handleRemoveRow = (key) => {
        setDinhMucDetails(dinhMucDetails.filter(item => item.key !== key));
    };
    
    const handleRowChange = (key, field, value) => {
        const newData = dinhMucDetails.map(item => item.key === key ? { ...item, [field]: value } : item);
        setDinhMucDetails(newData);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (dinhMucDetails.length === 0 || dinhMucDetails.some(d => !d.id_npl || !d.so_luong || d.so_luong <= 0)) {
                message.error('Vui lòng thêm và điền đầy đủ thông tin cho ít nhất một nguyên phụ liệu!');
                return;
            }
            
            // Chuẩn bị dữ liệu gửi lên API theo format BE cần
            const payload = {
                id_sp: values.id_sp,
                dinh_muc_chi_tiet: dinhMucDetails.map(({ id_npl, so_luong }) => ({ id_nguyen_lieu: id_npl, so_luong }))
            };
            console.log("Payload to send to BE:", payload);
            
            // --- Logic giả lập cập nhật state ---
            const ten_sp_selected = spList.find(sp => sp.id_sp === values.id_sp)?.ten_sp;
            const newDinhMucData = {
                id_sp: values.id_sp,
                ten_sp: ten_sp_selected,
                dinh_muc_chi_tiet: dinhMucDetails
            };
            
            if (editingProduct) {
                setAllDinhMuc(allDinhMuc.map(item => item.id_sp === editingProduct.id_sp ? newDinhMucData : item));
            } else {
                setAllDinhMuc([...allDinhMuc, newDinhMucData]);
            }
            // ------------------------------------

            message.success('Lưu định mức thành công!');
            setIsModalOpen(false);
        } catch (error) {
            console.log("Validation Failed:", error);
        }
    };

    const columnsMain = [
        { 
            title: 'Tên Sản phẩm', 
            dataIndex: 'ten_sp', 
            key: 'ten_sp' 
        },
        { 
            title: 'Số Nguyên phụ liệu trong Định mức', 
            key: 'count_npl', 
            align: 'center',
            render: (_, record) => record.dinh_muc_chi_tiet.length
        },
        {
            title: 'Hành động', 
            key: 'action', 
            width: 150, 
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>
                        Xem / Sửa
                    </Button>
                </Space>
            ),
        },
    ];

    const columnsModal = [
        { 
            title: 'Tên Nguyên phụ liệu', 
            dataIndex: 'id_npl', 
            render: (_, record) => (
                <Select style={{ width: '100%' }} placeholder="Chọn NPL" value={record.id_npl} onChange={(val) => handleRowChange(record.key, 'id_npl', val)}>
                    {nplList.map(npl => <Option key={npl.id_npl} value={npl.id_npl}>{npl.ten_npl}</Option>)}
                </Select>
            )
        },
        { 
            title: 'Số lượng cần', 
            dataIndex: 'so_luong', 
            width: 150,
            render: (_, record) => (
                <InputNumber min={0.01} style={{ width: '100%' }} value={record.so_luong} step="0.01" onChange={(val) => handleRowChange(record.key, 'so_luong', val)} />
            )
        },
        { 
            title: 'Hành động', 
            width: 100, 
            align: 'center', 
            render: (_, record) => <Button icon={<DeleteOutlined/>} danger onClick={() => handleRemoveRow(record.key)} />
        },
    ];

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={3} className="page-header-heading">Quản lý Định mức Sản phẩm</Title>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
                        Khai báo Định mức
                    </Button>
                </Col>
            </Row>
            
            <Card bordered={false} className="content-card">
                <Table 
                    columns={columnsMain} 
                    dataSource={allDinhMuc} 
                    rowKey="id_sp" 
                />
            </Card>

            <Modal 
                title={editingProduct ? `Định mức cho sản phẩm: ${editingProduct.ten_sp}` : 'Khai báo Định mức mới'}
                open={isModalOpen} 
                onCancel={() => setIsModalOpen(false)} 
                footer={null} 
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="id_sp" label="Sản phẩm" rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}>
                        <Select placeholder="Chọn sản phẩm" disabled={!!editingProduct}>
                            {spList.map(sp => <Option key={sp.id_sp} value={sp.id_sp}>{sp.ten_sp}</Option>)}
                        </Select>
                    </Form.Item>
                    
                    <Text strong>Danh sách Nguyên phụ liệu cấu thành:</Text>
                    <Table 
                        columns={columnsModal} 
                        dataSource={dinhMucDetails} 
                        pagination={false} 
                        rowKey="key" 
                        bordered 
                        size="small" 
                        style={{ margin: '16px 0' }}
                    />
                    <Button onClick={handleAddRow} type="dashed" icon={<PlusOutlined />} style={{ width: '100%' }}>
                        Thêm Nguyên phụ liệu
                    </Button>
                    
                    <div style={{ marginTop: 24, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>Lưu Định mức</Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default DinhMuc;