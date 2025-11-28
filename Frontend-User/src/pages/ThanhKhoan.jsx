import React, { useState } from 'react';
import { Table, Button, Form, Select, message, Typography, Space, Spin, DatePicker, Row, Col, Card, Tabs, Tooltip, Descriptions, Tag } from 'antd';
import { CalculatorOutlined, DownloadOutlined, SaveOutlined, ArrowLeftOutlined, QuestionCircleOutlined, PrinterOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// --- Dữ liệu giả lập chi tiết ---
const hopDongList = [ { id_hd: 1, so_hd: 'HD-2025-001' }, { id_hd: 2, so_hd: 'HD-2025-002' } ];
const initialSavedReports = [
    { id_bc: 1, so_hd: 'HD-2024-100', ky_bao_cao: 'Quý 4/2024', thoi_gian_tao: '2025-01-15 10:30', ket_luan_tong_the: 'HopLe' },
    { id_bc: 2, so_hd: 'HD-2024-101', ky_bao_cao: 'Năm 2024', thoi_gian_tao: '2025-01-20 14:00', ket_luan_tong_the: 'CanhBao' },
];
const mockApiResponse = {
    thongTinChung: { ten_dn: 'Công ty TNHH May Mặc ABC', dia_chi: '123 ABC, TP.HCM', ma_so_thue: '0312345678' },
    kyBaoCao: { tu_ngay: '2025-01-01', den_ngay: '2025-12-31' },
    baoCaoNXT_SP: [
        { key: '1', stt: 1, ma_sp: 'APM01', ten_sp: 'Áo phông cổ tròn - M', don_vi_tinh: 'Cái', ton_dau_ky: 200, nhap_kho_trong_ky: 5500, chuyen_muc_dich: 10, xuat_khau: 5000, xuat_khac: 50, ton_cuoi_ky: 640, ghi_chu: '' },
        { key: '2', stt: 2, ma_sp: 'APL01', ten_sp: 'Áo phông cổ tròn - L', don_vi_tinh: 'Cái', ton_dau_ky: 150, nhap_kho_trong_ky: 3400, chuyen_muc_dich: 0, xuat_khau: 3500, xuat_khac: 0, ton_cuoi_ky: 50, ghi_chu: 'Hàng mẫu' },
    ],
    baoCaoSD_NPL: [
        { key: '1', stt: 1, ma_npl: 'VAI01', ten_npl: 'Vải Cotton', don_vi_tinh: 'm', ton_dau_ky: 100, tai_nhap: 0, nhap_khac: 10000, xuat_san_pham: 9000, thay_doi_muc_dich: 50, ton_cuoi_ky: 1050, ghi_chu: '' },
        { key: '2', stt: 2, ma_npl: 'CHI01', ten_npl: 'Chỉ may Polyester', don_vi_tinh: 'kg', ton_dau_ky: 5, tai_nhap: 1, nhap_khac: 25, xuat_san_pham: 25, thay_doi_muc_dich: 0, ton_cuoi_ky: 4, ghi_chu: 'Tái nhập lô hỏng' },
    ],
    dinhMucThucTe: [
        { key: '1', stt: 1, ma_sp: 'APM01', ten_sp: 'Áo phông cổ tròn - M', don_vi_tinh_sp: 'Cái', ma_npl: 'VAI01', ten_npl: 'Vải Cotton', don_vi_tinh_npl: 'm', luong_sd: 1.8, ghi_chu: '' },
    ],
};
// -----------------------

const ThanhKhoan = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [baoCaoData, setBaoCaoData] = useState(null);
    const [savedReports, setSavedReports] = useState(initialSavedReports);

    const handleCalculate = (values) => {
        setLoading(true);
        setTimeout(() => {
            setBaoCaoData(mockApiResponse);
            setStep(2);
            setLoading(false);
            message.success('Tính toán thanh khoản thành công!');
        }, 1500);
    };

    const handleViewReport = (report) => {
        setLoading(true);
        setTimeout(() => {
            setBaoCaoData(mockApiResponse);
            setStep(2);
            setLoading(false);
        }, 500);
    };

    const handleSaveReport = () => { setLoading(true); setTimeout(() => { message.success('Lưu báo cáo thành công!'); setLoading(false); }, 1000); };
    const handlePrint = () => { window.print(); };

    const nxtSPColumns = [
        { title: '(1) STT', dataIndex: 'stt' }, { title: '(2) Mã sản phẩm', dataIndex: 'ma_sp' },
        { title: '(3) Tên sản phẩm', dataIndex: 'ten_sp' }, { title: '(4) Đơn vị tính', dataIndex: 'don_vi_tinh' },
        { title: '(5) Tồn kho đầu kỳ', dataIndex: 'ton_dau_ky', render: (text) => text?.toLocaleString() },
        { title: '(6) Nhập kho trong kỳ', dataIndex: 'nhap_kho_trong_ky', render: (text) => text?.toLocaleString() },
        { title: 'Xuất kho trong kỳ', children: [
            { title: '(7) Thay đổi mục đích', dataIndex: 'chuyen_muc_dich', render: (text) => text?.toLocaleString() },
            { title: '(8) Xuất khẩu', dataIndex: 'xuat_khau', render: (text) => text?.toLocaleString() },
            { title: '(9) Xuất khác', dataIndex: 'xuat_khac', render: (text) => text?.toLocaleString() },
        ]},
        { title: () => <Tooltip title="(5) + (6) - (7) - (8) - (9)"><span>(10) Tồn kho cuối kỳ <QuestionCircleOutlined /></span></Tooltip>, dataIndex: 'ton_cuoi_ky', render: (text) => text?.toLocaleString() },
        { title: '(11) Ghi chú', dataIndex: 'ghi_chu' },
    ];
    
    const sdNPLColumns = [
        { title: '(1) STT', dataIndex: 'stt' }, { title: '(2) Mã NPL, VT', dataIndex: 'ma_npl' },
        { title: '(3) Tên NPL, VT', dataIndex: 'ten_npl' }, { title: '(4) ĐVT', dataIndex: 'don_vi_tinh' },
        { title: '(5) Tồn đầu kỳ', dataIndex: 'ton_dau_ky', render: (text) => text?.toLocaleString() },
        { title: 'Nhập trong kỳ', children: [
            { title: '(6) Tái nhập', dataIndex: 'tai_nhap', render: (text) => text?.toLocaleString() },
            { title: '(7) Nhập khác', dataIndex: 'nhap_khac', render: (text) => text?.toLocaleString() },
        ]},
        { title: 'Xuất trong kỳ', children: [
            { title: '(8) Xuất sản phẩm', dataIndex: 'xuat_san_pham', render: (text) => text?.toLocaleString() },
            { title: '(9) Thay đổi mục đích', dataIndex: 'thay_doi_muc_dich', render: (text) => text?.toLocaleString() },
        ]},
        { title: () => <Tooltip title="(5)+(6)+(7)-(8)-(9)"><span>(10) Tồn kho cuối kỳ <QuestionCircleOutlined /></span></Tooltip>, dataIndex: 'ton_cuoi_ky', render: (text) => text?.toLocaleString() },
        { title: '(11) Ghi chú', dataIndex: 'ghi_chu' },
    ];
    
    const dinhMucColumns = [
        { title: '(1) Stt', dataIndex: 'stt' }, { title: '(2) Mã sản phẩm', dataIndex: 'ma_sp' },
        { title: '(3) Tên sản phẩm', dataIndex: 'ten_sp' }, { title: '(4) Đơn vị tính (SP)', dataIndex: 'don_vi_tinh_sp' },
        { title: 'Nguyên liệu, vật tư', children: [ { title: '(5) Mã', dataIndex: 'ma_npl' }, { title: '(6) Tên', dataIndex: 'ten_npl' }, { title: '(7) Đơn vị tính', dataIndex: 'don_vi_tinh_npl' } ]},
        { title: '(8) Lượng NL, VT thực tế sử dụng / 1 SP', dataIndex: 'luong_sd' },
        { title: '(9) Ghi chú', dataIndex: 'ghi_chu' },
    ];
    
    const savedReportsColumns = [
        { title: 'Số Hợp đồng', dataIndex: 'so_hd' },
        { title: 'Kỳ Báo cáo', dataIndex: 'ky_bao_cao' },
        { title: 'Thời gian tạo', dataIndex: 'thoi_gian_tao', render: (text) => dayjs(text).format('HH:mm DD/MM/YYYY')},
        { title: 'Kết luận', dataIndex: 'ket_luan_tong_the', render: (text) => <Tag color={text === 'HopLe' ? 'success' : 'warning'}>{text}</Tag> },
        { title: 'Hành động', key: 'action', render: (_, record) => <Button icon={<EyeOutlined />} onClick={() => handleViewReport(record)}>Xem lại</Button> },
    ];

    if (step === 2 && baoCaoData) {
        return (
            <Spin spinning={loading} tip="Đang xử lý...">
                <Card>
                    <Row justify="space-between" align="middle" style={{ marginBottom: 24 }} className="no-print">
                        <Col>
                            <Space>
                                <Button 
                                    icon={<ArrowLeftOutlined />} 
                                    onClick={() => { 
                                        setStep(1); 
                                        setBaoCaoData(null);
                                    }}
                                >
                                    Quay lại
                                </Button>
                                <Title level={4} style={{ margin: 0 }}>Kết quả Quyết toán Hợp đồng</Title>
                            </Space>
                        </Col>
                        <Col>
                            <Space>
                                <Button icon={<PrinterOutlined />} onClick={handlePrint}>In Báo cáo</Button>
                                <Button icon={<DownloadOutlined />}>Tải file</Button>
                                <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveReport}>Lưu Báo cáo</Button>
                            </Space>
                        </Col>
                    </Row>
                    <div id="print-area">
                        <Descriptions bordered size="small" column={2} style={{ marginBottom: 16 }} title="THÔNG TIN CHUNG">
                            <Descriptions.Item label="Tên tổ chức">{baoCaoData.thongTinChung.ten_dn}</Descriptions.Item>
                            <Descriptions.Item label="Mã số thuế">{baoCaoData.thongTinChung.ma_so_thue}</Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={2}>{baoCaoData.thongTinChung.dia_chi}</Descriptions.Item>
                            <Descriptions.Item label="Kỳ báo cáo" span={2}>{`Từ ngày ${dayjs(baoCaoData.kyBaoCao.tu_ngay).format('DD/MM/YYYY')} đến ngày ${dayjs(baoCaoData.kyBaoCao.den_ngay).format('DD/MM/YYYY')}`}</Descriptions.Item>
                        </Descriptions>

                        <Tabs defaultActiveKey="1" type="card">
                            <TabPane tab="Mẫu 15a: BC N-X-T Sản phẩm" key="1">
                                <Title level={5} style={{textAlign: 'center', padding: '16px 0'}}>BÁO CÁO QUYẾT TOÁN NHẬP - XUẤT - TỒN KHO SẢN PHẨM</Title>
                                <Table columns={nxtSPColumns} dataSource={baoCaoData.baoCaoNXT_SP} rowKey="key" bordered pagination={false} size="small" scroll={{ x: 1300 }}/>
                            </TabPane>
                            <TabPane tab="Mẫu 15b: BC Sử dụng Nguyên phụ liệu" key="2">
                                <Title level={5} style={{textAlign: 'center', padding: '16px 0'}}>BÁO CÁO QUYẾT TOÁN TÌNH HÌNH SỬ DỤNG NGUYÊN LIỆU, VẬT TƯ</Title>
                                <Table columns={sdNPLColumns} dataSource={baoCaoData.baoCaoSD_NPL} rowKey="key" bordered pagination={false} size="small" scroll={{ x: 1300 }}/>
                            </TabPane>
                            <TabPane tab="Mẫu 16: Định mức Thực tế" key="3">
                                <Title level={5} style={{textAlign: 'center', padding: '16px 0'}}>ĐỊNH MỨC THỰC TẾ SẢN XUẤT SẢN PHẨM XUẤT KHẨU</Title>
                                <Table columns={dinhMucColumns} dataSource={baoCaoData.dinhMucThucTe} rowKey="key" bordered pagination={false} size="small" scroll={{ x: 1300 }}/>
                            </TabPane>
                        </Tabs>
                    </div>
                </Card>
            </Spin>
        )
    }

    return (
        <Spin spinning={loading} tip="Đang tính toán...">
            <Card style={{ marginBottom: 24 }}>
                <Title level={4} style={{ textAlign: 'center' }}>Tạo Báo cáo Quyết toán mới</Title>
                <Form form={form} layout="vertical" onFinish={handleCalculate}>
                    <Form.Item name="id_hd" label="Chọn Hợp đồng cần thanh khoản" rules={[{ required: true, message: 'Vui lòng chọn hợp đồng!' }]}>
                        <Select placeholder="Chọn hợp đồng">{hopDongList.map(hd => <Option key={hd.id_hd} value={hd.id_hd}>{hd.so_hd}</Option>)}</Select>
                    </Form.Item>
                    <Form.Item name="ky_bao_cao" label="Chọn Kỳ báo cáo (Từ ngày - Đến ngày)" rules={[{ required: true, message: 'Vui lòng chọn kỳ báo cáo!' }]}>
                        <RangePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<CalculatorOutlined />} style={{ width: '100%' }}>Thực hiện Tính toán</Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card title="Lịch sử các Báo cáo đã tạo">
                <Table columns={savedReportsColumns} dataSource={savedReports} rowKey="id_bc" />
            </Card>
        </Spin>
    );
};

export default ThanhKhoan;