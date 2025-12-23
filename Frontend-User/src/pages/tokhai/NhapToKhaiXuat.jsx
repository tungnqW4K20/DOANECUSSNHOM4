import React, { useState, useEffect } from 'react';
import { Steps, Button, Form, Select, DatePicker, Input, Upload, Table, InputNumber, Card, Typography, Row, Col, Space, Spin } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { createLoHang } from '../../services/lohang.service';
import { createHoaDonXuat } from '../../services/hoadonxuat.service';
import { createVanDonXuat } from '../../services/vandonxuat.service';
import { createToKhaiXuat } from '../../services/tokhaixuat.service';
import { getAllHopDong } from '../../services/hopdong.service';
import { getAllSanPham } from '../../services/sanpham.service';
import { getAllTienTe } from '../../services/tiente.service';
import { showCreateSuccess, showLoadError, showSaveError } from '../../components/notification';

const { Step } = Steps;
const { Option } = Select;
const { Title } = Typography;

const NhapToKhaiXuat = () => {
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formLoHang] = Form.useForm();
    const [formHoaDonVanDon] = Form.useForm();
    const [formToKhai] = Form.useForm();

    // Data from API
    const [hopDongList, setHopDongList] = useState([]);
    const [spList, setSpList] = useState([]);
    const [tienTeList, setTienTeList] = useState([]);

    // Store IDs from previous steps
    const [createdLoHangId, setCreatedLoHangId] = useState(null);
    const [createdHoaDonId, setCreatedHoaDonId] = useState(null);
    const [createdVanDonId, setCreatedVanDonId] = useState(null);

    const [chiTietHoaDon, setChiTietHoaDon] = useState([{ key: 1, id_sp: null, so_luong: 0, don_gia: 0, tri_gia: 0 }]);
    const [tongTienHoaDon, setTongTienHoaDon] = useState(0);

    // Fetch initial data
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [hopDongRes, spRes, tienTeRes] = await Promise.all([
                getAllHopDong(),
                getAllSanPham(),
                getAllTienTe()
            ]);
            
            setHopDongList(hopDongRes.data || []);
            setSpList(spRes.data || []);
            setTienTeList(tienTeRes.data || []);
        } catch (error) {
            showLoadError('dữ liệu ban đầu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const total = chiTietHoaDon.reduce((sum, item) => sum + item.tri_gia, 0);
        setTongTienHoaDon(total);
        formHoaDonVanDon.setFieldsValue({ tong_tien: total });
    }, [chiTietHoaDon, formHoaDonVanDon]);

    const next = async () => {
        try {
            setLoading(true);
            
            if (current === 0) {
                // Step 1: Create Lô hàng
                await formLoHang.validateFields();
                const loHangData = formLoHang.getFieldsValue();
                
                // Validate ngày tháng
                if (loHangData.ngay_dong_goi && loHangData.ngay_xuat_cang) {
                    if (dayjs(loHangData.ngay_xuat_cang).isBefore(dayjs(loHangData.ngay_dong_goi))) {
                        showSaveError('Ngày xuất cảng phải sau ngày đóng gói');
                        setLoading(false);
                        return;
                    }
                }
                
                // Format dates for API
                const payload = {
                    ...loHangData,
                    ngay_dong_goi: loHangData.ngay_dong_goi ? dayjs(loHangData.ngay_dong_goi).format('YYYY-MM-DD') : null,
                    ngay_xuat_cang: loHangData.ngay_xuat_cang ? dayjs(loHangData.ngay_xuat_cang).format('YYYY-MM-DD') : null,
                };
                
                const loHangRes = await createLoHang(payload);
                if (loHangRes.success && loHangRes.data) {
                    setCreatedLoHangId(loHangRes.data.id_lh);
                    showCreateSuccess('Lô hàng');
                    setCurrent(current + 1);
                } else {
                    throw new Error('Không thể tạo lô hàng');
                }
            } else if (current === 1) {
                // Step 2: Create Hóa đơn và Vận đơn
                await formHoaDonVanDon.validateFields();
                
                // Validate chi tiết hóa đơn
                const validItems = chiTietHoaDon.filter(item => item.id_sp && item.so_luong > 0 && item.don_gia > 0);
                if (validItems.length === 0) {
                    showSaveError('Vui lòng thêm ít nhất 1 sản phẩm với số lượng và đơn giá hợp lệ');
                    setLoading(false);
                    return;
                }
                
                const hoaDonVanDonData = formHoaDonVanDon.getFieldsValue();
                
                // Create Hóa đơn xuất
                const hoaDonPayload = {
                    id_lh: createdLoHangId,
                    so_hd: hoaDonVanDonData.so_hd,
                    ngay_hd: hoaDonVanDonData.ngay_hd ? dayjs(hoaDonVanDonData.ngay_hd).format('YYYY-MM-DD') : null,
                    id_tt: hoaDonVanDonData.id_tt,
                    tong_tien: tongTienHoaDon,
                    chi_tiet: chiTietHoaDon.map(item => ({
                        id_sp: item.id_sp,
                        so_luong: item.so_luong,
                        don_gia: item.don_gia,
                        tri_gia: item.tri_gia
                    }))
                };
                
                const hoaDonRes = await createHoaDonXuat(hoaDonPayload);
                if (hoaDonRes.success && hoaDonRes.data) {
                    setCreatedHoaDonId(hoaDonRes.data.id_hdx);
                    
                    // Create Vận đơn xuất
                    const vanDonPayload = {
                        id_lh: createdLoHangId,
                        so_vd: hoaDonVanDonData.so_vd,
                        ngay_phat_hanh: hoaDonVanDonData.ngay_phat_hanh ? dayjs(hoaDonVanDonData.ngay_phat_hanh).format('YYYY-MM-DD') : null,
                        cang_xuat: hoaDonVanDonData.vd_cang_xuat,
                        cang_nhap: hoaDonVanDonData.vd_cang_nhap,
                    };
                    
                    const vanDonRes = await createVanDonXuat(vanDonPayload);
                    if (vanDonRes.success && vanDonRes.data) {
                        setCreatedVanDonId(vanDonRes.data.id_vdx);
                        showCreateSuccess('Hóa đơn và vận đơn');
                        setCurrent(current + 1);
                    } else {
                        throw new Error('Không thể tạo vận đơn');
                    }
                } else {
                    throw new Error('Không thể tạo hóa đơn');
                }
            }
        } catch (error) {
            if (error.errorFields) {
                showSaveError('Vui lòng điền đầy đủ thông tin bắt buộc');
            } else {
                showSaveError('dữ liệu');
            }
        } finally {
            setLoading(false);
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
            setLoading(true);
            await formToKhai.validateFields();
            
            // Validate lại chi tiết hóa đơn
            const validItems = chiTietHoaDon.filter(item => item.id_sp && item.so_luong > 0 && item.don_gia > 0);
            if (validItems.length === 0) {
                showSaveError('Vui lòng thêm ít nhất 1 sản phẩm với số lượng và đơn giá hợp lệ');
                setLoading(false);
                return;
            }
            
            const toKhaiData = formToKhai.getFieldsValue();
            
            // Step 3: Create Tờ khai xuất
            const toKhaiPayload = {
                id_lh: createdLoHangId,
                id_hdx: createdHoaDonId,
                id_vdx: createdVanDonId,
                so_tk: toKhaiData.so_tk,
                ngay_tk: toKhaiData.ngay_tk ? dayjs(toKhaiData.ngay_tk).format('YYYY-MM-DD') : null,
            };
            
            const toKhaiRes = await createToKhaiXuat(toKhaiPayload);
            if (toKhaiRes.success) {
                showCreateSuccess('Tờ khai xuất');
                
                // Reset form and go back to step 1
                formLoHang.resetFields();
                formHoaDonVanDon.resetFields();
                formToKhai.resetFields();
                setChiTietHoaDon([{ key: 1, id_sp: null, so_luong: 0, don_gia: 0, tri_gia: 0 }]);
                setCreatedLoHangId(null);
                setCreatedHoaDonId(null);
                setCreatedVanDonId(null);
                setCurrent(0);
            } else {
                throw new Error('Không thể tạo tờ khai');
            }
        } catch (error) {
            if (error.errorFields) {
                showSaveError('Vui lòng điền đầy đủ thông tin bắt buộc');
            } else {
                showSaveError('tờ khai xuất');
            }
        } finally {
            setLoading(false);
        }
    };
    
    const columnsChiTiet = [
        { title: 'Sản phẩm', dataIndex: 'id_sp', render: (_, record) => (
            <Select 
                style={{ width: 200 }} 
                value={record.id_sp}
                onChange={(val) => handleChiTietChange(record.key, 'id_sp', val)} 
                placeholder="Chọn sản phẩm"
                status={!record.id_sp && chiTietHoaDon.length > 1 ? 'error' : ''}
            >
                {spList.map(sp => <Option key={sp.id_sp} value={sp.id_sp}>{sp.ten_sp}</Option>)}
            </Select>
        )},
        { title: 'Số lượng', dataIndex: 'so_luong', render: (_, record) => (
            <InputNumber 
                min={1} 
                value={record.so_luong}
                onChange={(val) => handleChiTietChange(record.key, 'so_luong', val)}
                placeholder="Nhập số lượng"
                status={record.so_luong <= 0 && chiTietHoaDon.length > 1 ? 'error' : ''}
                style={{ width: '100%' }}
            />
        )},
        { title: 'Đơn giá', dataIndex: 'don_gia', render: (_, record) => (
            <InputNumber 
                min={1} 
                value={record.don_gia}
                onChange={(val) => handleChiTietChange(record.key, 'don_gia', val)}
                placeholder="Nhập đơn giá"
                status={record.don_gia <= 0 && chiTietHoaDon.length > 1 ? 'error' : ''}
                style={{ width: '100%' }}
            />
        )},
        { title: 'Trị giá', dataIndex: 'tri_gia', render: (text) => text.toLocaleString() },
        { title: 'Hành động', render: (_, record) => <Button icon={<DeleteOutlined/>} danger onClick={() => handleRemoveRow(record.key)} /> }
    ];

    const steps = [
        { title: '1. Thông tin Lô hàng', content: (
            <Form form={formLoHang} layout="vertical" name="form_lo_hang">
                <Row gutter={24}>
                    <Col span={24}><Form.Item label="Hợp đồng liên quan" name="id_hd" rules={[{ required: true, message: "Vui lòng chọn hợp đồng!" }]}><Select placeholder="Chọn hợp đồng">{hopDongList.map(hd => <Option key={hd.id_hd} value={hd.id_hd}>{hd.so_hd}</Option>)}</Select></Form.Item></Col>
                    <Col span={12}><Form.Item label="Ngày đóng gói" name="ngay_dong_goi" rules={[{ required: true, message: "Vui lòng chọn ngày đóng gói!" }]}><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Chọn ngày"/></Form.Item></Col>
                    <Col span={12}><Form.Item label="Ngày xuất cảng" name="ngay_xuat_cang" rules={[{ required: true, message: "Vui lòng chọn ngày xuất cảng!" }]}><DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Chọn ngày"/></Form.Item></Col>
                    <Col span={12}><Form.Item label="Cảng xuất" name="cang_xuat" rules={[{ required: true, message: "Vui lòng nhập cảng xuất!" }]}><Input placeholder="Nhập tên cảng xuất" /></Form.Item></Col>
                    <Col span={12}><Form.Item label="Cảng nhập" name="cang_nhap" rules={[{ required: true, message: "Vui lòng nhập cảng nhập!" }]}><Input placeholder="Nhập tên cảng nhập" /></Form.Item></Col>
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
                    <Col span={12}><Form.Item label="Tiền tệ" name="id_tt" rules={[{ required: true, message: "Vui lòng chọn loại tiền tệ!" }]}><Select placeholder="Chọn tiền tệ">{tienTeList.map(tt => <Option key={tt.id_tt} value={tt.id_tt}>{tt.ma_tt}</Option>)}</Select></Form.Item></Col>
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
        <Spin spinning={loading}>
            <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Khai báo Tờ khai Xuất khẩu</Title>
            <Card>
                <Steps current={current} style={{ maxWidth: 900, margin: '0 auto 24px auto' }}>
                    {steps.map(item => <Step key={item.title} title={item.title} />)}
                </Steps>
                <div className="steps-content">{steps[current].content}</div>
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <Space>
                        {current > 0 && <Button onClick={prev} disabled={loading}>Quay lại</Button>}
                        {current < steps.length - 1 && <Button type="primary" onClick={next} loading={loading}>Tiếp theo</Button>}
                        {current === steps.length - 1 && <Button type="primary" onClick={onFinish} loading={loading}>Hoàn tất & Nộp tờ khai</Button>}
                    </Space>
                </div>
            </Card>
        </Spin>
    );
};

export default NhapToKhaiXuat;