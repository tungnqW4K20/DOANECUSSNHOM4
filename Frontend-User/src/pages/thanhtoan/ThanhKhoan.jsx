import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Select, message, Typography, Space, Spin, DatePicker, Row, Col, Card, Tabs, Tooltip, Descriptions, Tag } from 'antd';
import { CalculatorOutlined, DownloadOutlined, SaveOutlined, ArrowLeftOutlined, QuestionCircleOutlined, PrinterOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import * as BaoCaoThanhKhoanService from '../../services/baocaothanhkhoan.service';

const { Option } = Select;
const { Title } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const ThanhKhoan = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [baoCaoData, setBaoCaoData] = useState(null);
    const [savedReports, setSavedReports] = useState([]);
    const [hopDongList, setHopDongList] = useState([]);

    // Fetch initial data
    useEffect(() => {
        fetchHopDongList();
        fetchSavedReports();
    }, []);

    const fetchHopDongList = async () => {
        try {
            setLoading(true);
            const response = await BaoCaoThanhKhoanService.getAllHopDong();
            setHopDongList(response.data || []);
        } catch (error) {
            if (error.status === 401) {
                message.error('Phiên đăng nhập hết hạn!');
            } else {
                message.error(error.message || 'Không thể tải danh sách hợp đồng!');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedReports = async () => {
        try {
            const response = await BaoCaoThanhKhoanService.getAllReports();
            setSavedReports(response.data || []);
        } catch (error) {
            message.error(error.message || 'Không thể tải lịch sử báo cáo!');
        }
    };

    const handleCalculate = async (values) => {
        try {
            setLoading(true);
            const payload = {
                id_hd: values.id_hd,
                tu_ngay: values.ky_bao_cao[0].format('YYYY-MM-DD'),
                den_ngay: values.ky_bao_cao[1].format('YYYY-MM-DD'),
            };
            const response = await BaoCaoThanhKhoanService.calculateReport(payload);
            setBaoCaoData(response.data);
            setStep(2);
            message.success('Tính toán thanh khoản thành công!');
        } catch (error) {
            if (error.status === 401) {
                message.error('Phiên đăng nhập hết hạn!');
            } else {
                message.error(error.message || 'Lỗi khi tính toán báo cáo!');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleViewReport = async (report) => {
        try {
            setLoading(true);
            // For viewing saved reports, we use the report data directly
            // If backend provides a specific endpoint to fetch report by ID, use that instead
            setBaoCaoData(report);
            setStep(2);
        } catch (error) {
            message.error(error.message || 'Lỗi khi xem báo cáo!');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveReport = async () => {
        try {
            setLoading(true);
            const payload = {
                ...baoCaoData,
            };
            await BaoCaoThanhKhoanService.saveReport(payload);
            message.success('Lưu báo cáo thành công!');
            fetchSavedReports();
        } catch (error) {
            if (error.status === 401) {
                message.error('Phiên đăng nhập hết hạn!');
            } else {
                message.error(error.message || 'Lỗi khi lưu báo cáo!');
            }
        } finally {
            setLoading(false);
        }
    };
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
                                <Table 
                                    columns={nxtSPColumns} 
                                    dataSource={(baoCaoData.baoCaoNXT_SP || []).map((item, index) => ({ ...item, key: item.key || index }))} 
                                    rowKey="key" 
                                    bordered 
                                    pagination={false} 
                                    size="small" 
                                    scroll={{ x: 1300 }}
                                />
                            </TabPane>
                            <TabPane tab="Mẫu 15b: BC Sử dụng Nguyên phụ liệu" key="2">
                                <Title level={5} style={{textAlign: 'center', padding: '16px 0'}}>BÁO CÁO QUYẾT TOÁN TÌNH HÌNH SỬ DỤNG NGUYÊN LIỆU, VẬT TƯ</Title>
                                <Table 
                                    columns={sdNPLColumns} 
                                    dataSource={(baoCaoData.baoCaoSD_NPL || []).map((item, index) => ({ ...item, key: item.key || index }))} 
                                    rowKey="key" 
                                    bordered 
                                    pagination={false} 
                                    size="small" 
                                    scroll={{ x: 1300 }}
                                />
                            </TabPane>
                            <TabPane tab="Mẫu 16: Định mức Thực tế" key="3">
                                <Title level={5} style={{textAlign: 'center', padding: '16px 0'}}>ĐỊNH MỨC THỰC TẾ SẢN XUẤT SẢN PHẨM XUẤT KHẨU</Title>
                                <Table 
                                    columns={dinhMucColumns} 
                                    dataSource={(baoCaoData.dinhMucThucTe || []).map((item, index) => ({ ...item, key: item.key || index }))} 
                                    rowKey="key" 
                                    bordered 
                                    pagination={false} 
                                    size="small" 
                                    scroll={{ x: 1300 }}
                                />
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