import React, { useState } from 'react';
import { Form, Select, DatePicker, Button, Table, InputNumber, Upload, message, Typography, Space, Popconfirm } from 'antd';
import { UploadOutlined, SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

// Dữ liệu giả lập
const nplList = [{ id_npl: 1, ten_npl: 'Vải Cotton 100%' }, { id_npl: 2, ten_npl: 'Chỉ may Polyester' }];
const khoList = [{ id_kho: 1, ten_kho: 'Kho nguyên liệu A' }, { id_kho: 2, ten_kho: 'Kho nguyên liệu B' }];

const XuatKhoNPL = () => {
    const [form] = Form.useForm();
    const [chiTietXuat, setChiTietXuat] = useState([]);

    const handleAddRow = () => {
        const newRow = { key: Date.now(), id_npl: null, so_luong: 1 };
        setChiTietXuat([...chiTietXuat, newRow]);
    };

    const handleRemoveRow = (key) => {
        setChiTietXuat(chiTietXuat.filter(item => item.key !== key));
    };

    const handleRowChange = (key, field, value) => {
        const newData = [...chiTietXuat];
        const index = newData.findIndex(item => key === item.key);
        if (index > -1) {
            newData[index][field] = value;
            setChiTietXuat(newData);
        }
    };

    const onFinish = (values) => {
        if (chiTietXuat.length === 0) {
            message.error("Vui lòng thêm ít nhất một nguyên phụ liệu để xuất kho!");
            return;
        }
        console.log('Received values of form: ', { ...values, chiTiet: chiTietXuat });
        message.success('Tạo phiếu xuất kho NPL thành công!');
    };

    const columns = [
        {
            title: 'Nguyên phụ liệu', dataIndex: 'id_npl', render: (_, record) => (
                <Select style={{ width: '100%' }} placeholder="Chọn NPL" onChange={(val) => handleRowChange(record.key, 'id_npl', val)}>
                    {nplList.map(npl => <Option key={npl.id_npl} value={npl.id_npl}>{npl.ten_npl}</Option>)}
                </Select>
            )
        },
        {
            title: 'Số lượng xuất', dataIndex: 'so_luong', render: (_, record) => (
                <InputNumber min={1} style={{ width: '100%' }} defaultValue={1} onChange={(val) => handleRowChange(record.key, 'so_luong', val)} />
            )
        },
        {
            title: 'Hành động', render: (_, record) =>
                <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleRemoveRow(record.key)}>
                    <Button icon={<DeleteOutlined />} danger />
                </Popconfirm>
        },
    ];

    return (
        <div>
            <Title level={3}>Tạo Phiếu Xuất Kho NPL (cho Sản xuất)</Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Kho xuất hàng" name="id_kho" rules={[{ required: true }]}>
                    <Select placeholder="Chọn kho xuất">
                        {khoList.map(k => <Option key={k.id_kho} value={k.id_kho}>{k.ten_kho}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="Ngày xuất kho" name="ngay_xuat" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="File phiếu xuất (nếu có)" name="file_phieu">
                    <Upload><Button icon={<UploadOutlined />}>Tải lên</Button></Upload>
                </Form.Item>

                <Title level={4}>Chi tiết Nguyên Phụ Liệu Cần Xuất</Title>
                <Button onClick={handleAddRow} type="dashed" icon={<PlusOutlined />} style={{ marginBottom: 16 }}>Thêm Nguyên phụ liệu</Button>
                <Table columns={columns} dataSource={chiTietXuat} pagination={false} rowKey="key" bordered />

                <Form.Item style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Lưu Phiếu xuất</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default XuatKhoNPL;