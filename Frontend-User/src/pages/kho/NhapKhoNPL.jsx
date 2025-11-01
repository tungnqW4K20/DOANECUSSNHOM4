import React, { useState } from 'react';
import { Form, Select, DatePicker, Button, Table, InputNumber, Upload, message, Typography, Space } from 'antd';
import { UploadOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

// Dữ liệu giả lập
const hoaDonNhapList = [
    { id_hd_nhap: 1, so_hd: 'INV-2025-001', ngay_hd: '2025-10-15' },
    { id_hd_nhap: 2, so_hd: 'INV-2025-002', ngay_hd: '2025-10-18' },
];
const chiTietHD1 = [
    { key: 1, id_npl: 1, ten_npl: 'Vải Cotton 100%', so_luong_hd: 1000 },
    { key: 2, id_npl: 2, ten_npl: 'Chỉ may Polyester', so_luong_hd: 50 },
];
const khoList = [{ id_kho: 1, ten_kho: 'Kho nguyên liệu A' }, { id_kho: 2, ten_kho: 'Kho nguyên liệu B' }];

const NhapKhoNPL = () => {
    const [form] = Form.useForm();
    const [chiTietNhap, setChiTietNhap] = useState([]);
    
    const handleHoaDonChange = (value) => {
        // Giả lập API call để lấy chi tiết hóa đơn
        if (value === 1) {
            const initialChiTiet = chiTietHD1.map(item => ({...item, so_luong_nhap: item.so_luong_hd}));
            setChiTietNhap(initialChiTiet);
        } else {
            setChiTietNhap([]);
        }
    };

    const handleSoLuongChange = (key, value) => {
        const newData = [...chiTietNhap];
        const index = newData.findIndex(item => key === item.key);
        if (index > -1) {
            newData[index].so_luong_nhap = value;
            setChiTietNhap(newData);
        }
    };

    const onFinish = (values) => {
        console.log('Received values of form: ', { ...values, chiTiet: chiTietNhap });
        message.success('Tạo phiếu nhập kho NPL thành công!');
    };

    const columns = [
        { title: 'Tên Nguyên phụ liệu', dataIndex: 'ten_npl', key: 'ten_npl' },
        { title: 'Số lượng theo HĐ', dataIndex: 'so_luong_hd', key: 'so_luong_hd' },
        { title: 'Số lượng thực nhập', dataIndex: 'so_luong_nhap', key: 'so_luong_nhap',
            render: (text, record) => <InputNumber min={0} defaultValue={text} onChange={(val) => handleSoLuongChange(record.key, val)}/>
        },
    ];

    return (
        <div>
            <Title level={3}>Tạo Phiếu Nhập Kho Nguyên Phụ Liệu</Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Hóa đơn nhập liên quan" name="id_hd_nhap" rules={[{ required: true }]}>
                    <Select placeholder="Tìm và chọn số hóa đơn nhập" onChange={handleHoaDonChange} showSearch>
                        {hoaDonNhapList.map(hd => <Option key={hd.id_hd_nhap} value={hd.id_hd_nhap}>{`${hd.so_hd} - Ngày ${hd.ngay_hd}`}</Option>)}
                    </Select>
                </Form.Item>
                 <Form.Item label="Kho nhận hàng" name="id_kho" rules={[{ required: true }]}>
                    <Select placeholder="Chọn kho">
                        {khoList.map(k => <Option key={k.id_kho} value={k.id_kho}>{k.ten_kho}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="Ngày nhập kho" name="ngay_nhap" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                 <Form.Item label="File phiếu nhập (nếu có)" name="file_phieu">
                    <Upload><Button icon={<UploadOutlined />}>Tải lên</Button></Upload>
                </Form.Item>
                
                <Title level={4}>Chi tiết Nguyên Phụ Liệu Nhập Kho</Title>
                <Table columns={columns} dataSource={chiTietNhap} pagination={false} rowKey="key" bordered/>

                <Form.Item style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>Xác nhận Nhập kho</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default NhapKhoNPL;