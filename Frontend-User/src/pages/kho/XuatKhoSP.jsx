import React, { useState } from 'react';
import { Form, Select, DatePicker, Button, Table, InputNumber, Upload, message, Typography, Tag } from 'antd';
import { UploadOutlined, SendOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

// Dữ liệu giả lập
const hoaDonXuatList = [ { id_hd_xuat: 1, so_hd: 'EXP-2025-001' }];
const chiTietHDX1 = [
    { key: 1, id_sp: 1, ten_sp: 'Áo phông cổ tròn', so_luong_hd: 500, ton_kho: 520 },
    { key: 2, id_sp: 2, ten_sp: 'Quần Jeans Nam', so_luong_hd: 200, ton_kho: 180 },
];
const khoList = [{ id_kho: 3, ten_kho: 'Kho thành phẩm A' }, { id_kho: 4, ten_kho: 'Kho thành phẩm B' }];

const XuatKhoSP = () => {
    const [form] = Form.useForm();
    const [chiTietXuat, setChiTietXuat] = useState([]);
    
    const handleHoaDonChange = (value) => {
        if (value === 1) {
            setChiTietXuat(chiTietHDX1.map(item => ({...item, so_luong_xuat: item.so_luong_hd})));
        } else {
            setChiTietXuat([]);
        }
    };

    const handleSoLuongChange = (key, value) => {
        setChiTietXuat(chiTietXuat.map(item => item.key === key ? { ...item, so_luong_xuat: value } : item));
    };

    const onFinish = (values) => {
        console.log('Received values:', { ...values, chiTiet: chiTietXuat });
        message.success('Tạo phiếu xuất kho sản phẩm thành công!');
    };

    const columns = [
        { title: 'Tên Sản phẩm', dataIndex: 'ten_sp', key: 'ten_sp' },
        { title: 'Số lượng theo HĐ', dataIndex: 'so_luong_hd', key: 'so_luong_hd' },
        { title: 'Tồn kho khả dụng', dataIndex: 'ton_kho', key: 'ton_kho' },
        { title: 'Số lượng thực xuất', dataIndex: 'so_luong_xuat', key: 'so_luong_xuat',
            render: (text, record) => (
                <>
                    <InputNumber min={0} max={record.ton_kho} defaultValue={text} onChange={(val) => handleSoLuongChange(record.key, val)}/>
                    {record.so_luong_xuat > record.ton_kho && <Tag color="error" style={{marginLeft: 8}}>Vượt tồn kho!</Tag>}
                </>
            )
        },
    ];

    return (
        <div>
            <Title level={3}>Tạo Phiếu Xuất Kho Sản Phẩm</Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Hóa đơn xuất liên quan" name="id_hd_xuat" rules={[{ required: true }]}>
                    <Select placeholder="Tìm và chọn số hóa đơn xuất" onChange={handleHoaDonChange} showSearch>
                        {hoaDonXuatList.map(hd => <Option key={hd.id_hd_xuat} value={hd.id_hd_xuat}>{hd.so_hd}</Option>)}
                    </Select>
                </Form.Item>
                 <Form.Item label="Kho xuất hàng" name="id_kho" rules={[{ required: true }]}>
                    <Select placeholder="Chọn kho">
                        {khoList.map(k => <Option key={k.id_kho} value={k.id_kho}>{k.ten_kho}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="Ngày xuất kho" name="ngay_xuat" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                 <Form.Item label="File phiếu xuất (nếu có)" name="file_phieu">
                    <Upload><Button icon={<UploadOutlined />}>Tải lên</Button></Upload>
                </Form.Item>
                
                <Title level={4}>Chi tiết Sản Phẩm Xuất Kho</Title>
                <Table columns={columns} dataSource={chiTietXuat} pagination={false} rowKey="key" bordered/>

                <Form.Item style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit" icon={<SendOutlined />}>Xác nhận Xuất kho</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default XuatKhoSP;