import React, { useState } from 'react';
import { Form, Select, DatePicker, Button, Table, InputNumber, Upload, message, Typography, Popconfirm } from 'antd';
import { UploadOutlined, SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

// Dữ liệu giả lập
const spList = [{ id_sp: 1, ten_sp: 'Áo phông cổ tròn' }, { id_sp: 2, ten_sp: 'Quần Jeans Nam' }];
const khoList = [{ id_kho: 3, ten_kho: 'Kho thành phẩm A' }, { id_kho: 4, ten_kho: 'Kho thành phẩm B' }];

const NhapKhoSP = () => {
    const [form] = Form.useForm();
    const [chiTietNhap, setChiTietNhap] = useState([]);

    const handleAddRow = () => {
        setChiTietNhap([...chiTietNhap, { key: Date.now(), id_sp: null, so_luong: 1 }]);
    };
    const handleRemoveRow = (key) => {
        setChiTietNhap(chiTietNhap.filter(item => item.key !== key));
    };
    const handleRowChange = (key, field, value) => {
        const newData = chiTietNhap.map(item => item.key === key ? { ...item, [field]: value } : item);
        setChiTietNhap(newData);
    };
    
    const onFinish = (values) => {
        if (chiTietNhap.length === 0) {
            message.error("Vui lòng thêm ít nhất một sản phẩm!");
            return;
        }
        console.log('Received values:', { ...values, chiTiet: chiTietNhap });
        message.success('Tạo phiếu nhập kho thành phẩm thành công!');
    };

    const columns = [
        { title: 'Sản phẩm', dataIndex: 'id_sp', render: (_, record) => (
            <Select style={{ width: '100%' }} placeholder="Chọn sản phẩm" onChange={(val) => handleRowChange(record.key, 'id_sp', val)}>
                {spList.map(sp => <Option key={sp.id_sp} value={sp.id_sp}>{sp.ten_sp}</Option>)}
            </Select>
        )},
        { title: 'Số lượng nhập', dataIndex: 'so_luong', render: (_, record) => (
            <InputNumber min={1} style={{ width: '100%' }} defaultValue={1} onChange={(val) => handleRowChange(record.key, 'so_luong', val)} />
        )},
        { title: 'Hành động', render: (_, record) => 
            <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleRemoveRow(record.key)}>
                <Button icon={<DeleteOutlined/>} danger />
            </Popconfirm>
        },
    ];

    return (
        <div>
            <Title level={3}>Tạo Phiếu Nhập Kho Sản Phẩm (từ Sản xuất)</Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Kho nhận hàng" name="id_kho" rules={[{ required: true }]}>
                    <Select placeholder="Chọn kho thành phẩm">
                        {khoList.map(k => <Option key={k.id_kho} value={k.id_kho}>{k.ten_kho}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="Ngày nhập kho" name="ngay_nhap" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                 <Form.Item label="File phiếu nhập (nếu có)" name="file_phieu">
                    <Upload><Button icon={<UploadOutlined />}>Tải lên</Button></Upload>
                </Form.Item>
                
                <Title level={4}>Chi tiết Sản Phẩm Nhập Kho</Title>
                <Button onClick={handleAddRow} type="dashed" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>Thêm Sản phẩm</Button>
                <Table columns={columns} dataSource={chiTietNhap} pagination={false} rowKey="key" bordered/>

                <Form.Item style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Lưu Phiếu nhập</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default NhapKhoSP;