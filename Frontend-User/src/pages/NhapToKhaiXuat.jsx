import React, { useState, useEffect } from 'react';
import { Steps, Button, Form, Select, DatePicker, Input, Upload, Table, message, InputNumber, Card, Typography, Row, Col, Space } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Step } = Steps; // SỬA LỖI: Thêm dòng này để định nghĩa "Step"
const { Option } = Select;
const { Title } = Typography;

// --- Dữ liệu giả lập ---
const hopDongList = [{ id_hd: 1, so_hd: 'HD-2025-001' }, { id_hd: 2, so_hd: 'HD-2025-002' }];
const spList = [{ id_sp: 1, ten_sp: 'Áo phông cổ tròn' }, { id_sp: 2, ten_sp: 'Quần Jeans Nam' }];
const tienTeList = [ { id_tt: 1, ma_tt: 'USD' }, { id_tt: 2, ma_tt: 'JPY' }];
// -----------------------

const NhapToKhaiXuat = () => {
    const [current, setCurrent] = useState(0);
    const [formLoHang] = Form.useForm();
    const [formHoaDonVanDon] = Form.useForm();
    const [formToKhai] = Form.useForm();

    const [chiTietHoaDon, setChiTietHoaDon] = useState([{ key: 1, id_sp: null, so_luong: 0, don_gia: 0, tri_gia: 0 }]);
    const [tongTienHoaDon, setTongTienHoaDon] = useState(0);

    useEffect(() => {
        const total = chiTietHoaDon.reduce((sum, item) => sum + item.tri_gia, 0);
        setTongTienHoaDon(total);
        formHoaDonVanDon.setFieldsValue({ tong_tien: total });
    }, [chiTietHoaDon, formHoaDonVanDon]);

    const next = async () => {
        try {
            if (current === 0) await formLoHang.validateFields();
            if (current === 1) await formHoaDonVanDon.validateFields();
            setCurrent(current + 1);
        } catch (error) {
            console.log('Validation Failed:', error);
        }
    };
    const prev = () => setCurrent(current - 1);
    
    const handleAddRow = () => setChiTietHoaDon([...chiTietHoaDon, { key: Date.now(), id_sp: null, so_luong: 0, don_gia: 0, tri_gia: 0 }]);
    const handleRemoveRow = (key) => setChiTietHoaDon(chiTietHoaDon.filter(item => item.key !== key));
    
    const handleChiTietChange = (key, field, value) => {
        const newData = [...chiTietHoaDon];
        const index = newData.findIndex(item => key === item.key);
        if (index > -1) {
            const item = newData[index];
            item[field] = value;
            if (field === 'so_luong' || field === 'don_gia') {
                item.tri_gia = (item.so_luong || 0) * (item.don_gia || 0);
            }
            newData.splice(index, 1, item);
            setChiTietHoaDon(newData);
        }
    };

    const onFinish = async () => {
        try {
            await formToKhai.validateFields();
            const loHangData = formLoHang.getFieldsValue();
            const hoaDonVanDonData = formHoaDonVanDon.getFieldsValue();
            const toKhaiData = formToKhai.getFieldsValue();
            console.log({ loHangData, hoaDonVanDonData, chiTietHoaDon, toKhaiData });
            message.success('Nộp tờ khai xuất thành công!');
        } catch (error) {
            message.error('Vui lòng điền đầy đủ thông tin!');
        }
    };
    
    const columnsChiTiet = [
        { title: 'Sản phẩm', dataIndex: 'id_sp', render: (_, record) => (
            <Select style={{ width: 200 }} onChange={(val) => handleChiTietChange(record.key, 'id_sp', val)} placeholder="Chọn sản phẩm">
                {spList.map(sp => <Option key={sp.id_sp} value={sp.id_sp}>{sp.ten_sp}</Option>)}
            </Select>
        )},
        { title: 'Số lượng', dataIndex: 'so_luong', render: (_, record) => <InputNumber min={0} onChange={(val) => handleChiTietChange(record.key, 'so_luong', val)} />},
        { title: 'Đơn giá', dataIndex: 'don_gia', render: (_, record) => <InputNumber min={0} onChange={(val) => handleChiTietChange(record.key, 'don_gia', val)} />},
        { title: 'Trị giá', dataIndex: 'tri_gia', render: (text) => text.toLocaleString() },
        { title: 'Hành động', render: (_, record) => <Button icon={<DeleteOutlined/>} danger onClick={() => handleRemoveRow(record.key)} /> }
    ];

    const steps = [
        { title: '1. Thông tin Lô hàng', content: (
            <Form form={formLoHang} layout="vertical" name="form_lo_hang">
                <Row gutter={24}>
                    <Col span={24}><Form.Item label="Hợp đồng liên quan" name="id_hd" rules={[{ required: true, message: "Vui lòng chọn hợp đồng!" }]}><Select placeholder="Chọn hợp đồng">{hopDongList.map(hd => <Option key={hd.id_hd} value={hd.id_hd}>{hd.so_hd}</Option>)}</Select></Form.Item></Col>
                    <Col span={12}><Form.Item label="Ngày đóng gói" name="ngay_dong_goi"><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD"/></Form.Item></Col>
                    <Col span={12}><Form.Item label="Ngày xuất cảng" name="ngay_xuat_cang"><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD"/></Form.Item></Col>
                    <Col span={12}><Form.Item label="Cảng xuất" name="cang_xuat"><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item label="Cảng nhập" name="cang_nhap"><Input /></Form.Item></Col>
                    <Col span={24}><Form.Item label="File chứng từ lô hàng" name="file_chung_tu"><Upload maxCount={1}><Button icon={<UploadOutlined />}>Tải lên</Button></Upload></Form.Item></Col>
                </Row>
            </Form>
        )},
        { title: '2. Hóa đơn & Vận đơn', content: (
            <Form form={formHoaDonVanDon} layout="vertical" name="form_hd_vd">
                <Title level={5}>Thông tin Hóa đơn xuất</Title>
                <Row gutter={24}>
                    <Col span={12}><Form.Item label="Số hóa đơn" name="so_hd" rules={[{ required: true, message: "Vui lòng nhập số hóa đơn!" }]}><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item label="Ngày hóa đơn" name="ngay_hd" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD"/></Form.Item></Col>
                    <Col span={12}><Form.Item label="Tiền tệ" name="id_tt" rules={[{ required: true, message: "Vui lòng nhập tiền!" }]}><Select placeholder="Chọn tiền tệ">{tienTeList.map(tt => <Option key={tt.id_tt} value={tt.id_tt}>{tt.ma_tt}</Option>)}</Select></Form.Item></Col>
                    <Col span={12}><Form.Item label="Tổng trị giá hóa đơn" name="tong_tien"><InputNumber style={{ width: '100%' }} disabled value={tongTienHoaDon} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/></Form.Item></Col>
                    <Col span={24}><Form.Item label="File scan hóa đơn" name="file_hoa_don"><Upload maxCount={1}><Button icon={<UploadOutlined />}>Tải lên</Button></Upload></Form.Item></Col>
                </Row>
                <Title level={5} style={{ marginTop: 8 }}>Chi tiết Hóa đơn</Title>
                <Table dataSource={chiTietHoaDon} columns={columnsChiTiet} pagination={false} rowKey="key" size="small" bordered/>
                <Button onClick={handleAddRow} type="dashed" icon={<PlusOutlined />} style={{marginTop: 16, width: '100%'}}>Thêm Sản phẩm</Button>
                
                <Title level={5} style={{marginTop: 24}}>Thông tin Vận đơn xuất</Title>
                <Row gutter={24}>
                    <Col span={12}><Form.Item label="Số vận đơn" name="so_vd" rules={[{ required: true, message: "Vui lòng nhập số vận đơn!" }]}><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item label="Ngày phát hành" name="ngay_phat_hanh" rules={[{ required: true, message: "Vui lòng chọn ngày phát hành!" }]}><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD"/></Form.Item></Col>
                    <Col span={12}><Form.Item label="Cảng xuất (trên vận đơn)" name="vd_cang_xuat" rules={[{ required: true, message: "Vui lòng nhập cảng xuất!" }]}><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item label="Cảng nhập (trên vận đơn)" name="vd_cang_nhap" rules={[{ required: true, message: "Vui lòng nhập cảng nhập!" }]}><Input /></Form.Item></Col>
                    <Col span={24}><Form.Item label="File scan vận đơn" name="file_van_don"><Upload maxCount={1}><Button icon={<UploadOutlined />}>Tải lên</Button></Upload></Form.Item></Col>
                </Row>
            </Form>
        )},
        { title: '3. Hoàn tất Tờ khai', content: (
             <Form form={formToKhai} layout="vertical" name="form_tk">
                 <Row gutter={24}>
                    <Col span={12}><Form.Item label="Số tờ khai" name="so_tk" rules={[{ required: true, message: "Vui lòng nhập số tờ khai!" }]}><Input /></Form.Item></Col>
                    <Col span={12}><Form.Item label="Ngày tờ khai" name="ngay_tk" rules={[{ required: true, message: "Vui lòng chọn ngày tờ khai!" }]}><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD"/></Form.Item></Col>
                    <Col span={12}><Form.Item label="Tổng trị giá khai báo"><InputNumber style={{ width: '100%' }} disabled value={tongTienHoaDon} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/></Form.Item></Col>
                    <Col span={12}><Form.Item label="Tiền tệ"><Input style={{ width: '100%' }} disabled value={tienTeList.find(t=> t.id_tt === formHoaDonVanDon.getFieldValue('id_tt'))?.ma_tt}/></Form.Item></Col>
                    <Col span={24}><Form.Item label="File scan tờ khai" name="file_to_khai"><Upload maxCount={1}><Button icon={<UploadOutlined />}>Tải lên</Button></Upload></Form.Item></Col>
                 </Row>
            </Form>
        )},
    ];

    return (
        <>
            <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Khai báo Tờ khai Xuất khẩu</Title>
            <Card>
                <Steps current={current} style={{ maxWidth: 900, margin: '0 auto 24px auto' }}>
                    {steps.map(item => <Step key={item.title} title={item.title} />)}
                </Steps>
                <div className="steps-content">{steps[current].content}</div>
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <Space>
                        {current > 0 && <Button onClick={prev}>Quay lại</Button>}
                        {current < steps.length - 1 && <Button type="primary" onClick={next}>Tiếp theo</Button>}
                        {current === steps.length - 1 && <Button type="primary" onClick={onFinish}>Hoàn tất & Nộp tờ khai</Button>}
                    </Space>
                </div>
            </Card>
        </>
    );
};

export default NhapToKhaiXuat;