import React, { useState } from 'react';
import { Form, Select, DatePicker, Button, Table, InputNumber, Upload, message, Typography, Space, Popconfirm } from 'antd';
import { UploadOutlined, SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { createXuatKhoNPL } from '../../services/xuatkhonpl.service';

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

const onFinish = async (values) => {
    if (!chiTietXuat.length) {
        message.error("Không có nguyên phụ liệu nào để xuất!");
        return;
    }

    // Kiểm tra số lượng hợp lệ
    for (const item of chiTietXuat) {
        if (!item.id_npl) {
            message.error("Vui lòng chọn nguyên phụ liệu cho tất cả dòng!");
            return;
        }
        if (!item.so_luong || item.so_luong <= 0) {
            message.error("Số lượng xuất phải lớn hơn 0!");
            return;
        }
    }

    // Build payload đúng chuẩn API createXuatNPL
    const payload = {
        id_kho: values.id_kho,
        ngay_xuat: values.ngay_xuat.format("YYYY-MM-DD"),
        file_phieu: values?.file_phieu || null,
        chi_tiets: chiTietXuat.map(item => ({
            id_npl: item.id_npl,     // ← dùng đúng id_npl
            so_luong: item.so_luong  // ← dùng đúng so_luong
        }))
    };

    console.log("📦 Payload gửi backend:", payload);

    try {
        const res = await createXuatKhoNPL(payload);

        message.success("Tạo phiếu xuất NPL thành công!");

        form.resetFields();
        setChiTietXuat([]);
    } catch (err) {
        console.error(err);
        message.error(err?.message || "Lỗi khi tạo phiếu xuất NPL!");
    }
};

    const columns = [
       {
    title: 'Nguyên phụ liệu',
    dataIndex: 'id_npl',
    render: (_, record) => (
        <Select
            style={{ width: '100%' }}
            placeholder="Chọn NPL"
            onChange={(val) => handleRowChange(record.key, 'id_npl', val)}
        >
            {nplList.map(npl =>
                <Option key={npl.id_npl} value={npl.id_npl}>
                    {npl.ten_npl}
                </Option>
            )}
        </Select>
    )
},
{
    title: 'Số lượng xuất',
    dataIndex: 'so_luong',
    render: (_, record) => (
        <InputNumber
            min={1}
            style={{ width: '100%' }}
            defaultValue={1}
            onChange={(val) => handleRowChange(record.key, 'so_luong', val)}
        />
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