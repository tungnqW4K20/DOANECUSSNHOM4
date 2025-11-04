import React, { useState } from 'react';
import { Table, Button, Modal, Form, Select, InputNumber, Space, message, Typography, Row, Col, Card, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

// --- Dữ liệu giả lập ---
const userData = JSON.parse(localStorage.getItem('user'));
const LOGGED_IN_DN_ID = userData?.id_dn;

const spList = [
    { id_sp: 1, ten_sp: 'Áo phông cổ tròn' },
    { id_sp: 2, ten_sp: 'Quần Jeans Nam' }
];
const nplList = [
    { id_npl: 1, ten_npl: 'Vải Cotton 100%' },
    { id_npl: 2, ten_npl: 'Chỉ may Polyester' },
    { id_npl: 3, ten_npl: 'Cúc áo nhựa' }
];

// Định mức đã có, đây là nguồn dữ liệu chính cho bảng
const initialDinhMuc = [
    { id_dm: 1, id_dn: 1, id_sp: 1, id_npl: 1, so_luong: 1.5 },
    { id_dm: 2, id_dn: 1, id_sp: 1, id_npl: 2, so_luong: 0.05 },
    { id_dm: 3, id_dn: 1, id_sp: 2, id_npl: 3, so_luong: 4 },
];
// -----------------------

const DinhMuc = () => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [allDinhMuc, setAllDinhMuc] = useState(initialDinhMuc);

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id_dm) => {
        setAllDinhMuc(allDinhMuc.filter(item => item.id_dm !== id_dm));
        message.success('Xóa định mức thành công!');
    };

    const onFinish = (values) => {
        if (editingRecord) {
            // Chế độ Sửa
            const updatedData = allDinhMuc.map(item =>
                item.id_dm === editingRecord.id_dm ? { ...item, ...values } : item
            );
            setAllDinhMuc(updatedData);
            message.success('Cập nhật định mức thành công!');
        } else {
            // Chế độ Thêm mới
            const newRecord = {
                id_dm: Date.now(), // Tạo ID tạm thời
                id_dn: LOGGED_IN_DN_ID, // Gán ID doanh nghiệp đang đăng nhập
                ...values
            };
            setAllDinhMuc([...allDinhMuc, newRecord]);
            message.success('Thêm định mức thành công!');
        }
        setIsModalOpen(false);
    };

    const columns = [
        {
            title: 'Tên Sản phẩm',
            dataIndex: 'id_sp',
            key: 'id_sp',
            render: (id_sp) => spList.find(sp => sp.id_sp === id_sp)?.ten_sp || 'Không xác định',
            sorter: (a, b) => {
                const nameA = spList.find(sp => sp.id_sp === a.id_sp)?.ten_sp || '';
                const nameB = spList.find(sp => sp.id_sp === b.id_sp)?.ten_sp || '';
                return nameA.localeCompare(nameB);
            },
        },
        {
            title: 'Tên Nguyên phụ liệu',
            dataIndex: 'id_npl',
            key: 'id_npl',
            render: (id_npl) => nplList.find(npl => npl.id_npl === id_npl)?.ten_npl || 'Không xác định'
        },
        {
            title: 'Số lượng cần',
            dataIndex: 'so_luong',
            key: 'so_luong',
            align: 'right',
            sorter: (a, b) => a.so_luong - b.so_luong,
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 180,
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id_dm)}>
                        <Button icon={<DeleteOutlined />} danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={3} className="page-header-heading">Quản lý Định mức Sản phẩm</Title>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Thêm Định mức
                    </Button>
                </Col>
            </Row>

            <Card bordered={false} className="content-card">
                <Table
                    columns={columns}
                    dataSource={allDinhMuc}
                    rowKey="id_dm"
                />
            </Card>

            <Modal
                title={editingRecord ? 'Chỉnh sửa Định mức' : 'Thêm mới Định mức'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ so_luong: 1 }}>
                    <Form.Item name="id_sp" label="Sản phẩm" rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}>
                        <Select placeholder="Chọn sản phẩm">
                            {spList.map(sp => <Option key={sp.id_sp} value={sp.id_sp}>{sp.ten_sp}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="id_npl" label="Nguyên phụ liệu" rules={[{ required: true, message: 'Vui lòng chọn nguyên phụ liệu!' }]}>
                        <Select placeholder="Chọn nguyên phụ liệu">
                            {nplList.map(npl => <Option key={npl.id_npl} value={npl.id_npl}>{npl.ten_npl}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="so_luong" label="Số lượng cần" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
                        <InputNumber min={0.01} style={{ width: '100%' }} step="0.01" />
                    </Form.Item>

                    <div style={{ marginTop: 24, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit">Lưu</Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default DinhMuc;