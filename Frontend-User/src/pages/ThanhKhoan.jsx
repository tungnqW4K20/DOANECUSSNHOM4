import React, { useState } from 'react';
import { Table, Button, Modal, Form, Select, message, Typography, Tag, Space, Spin } from 'antd';
import { PlusOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

// Dữ liệu giả lập
const hopDongList = [
    { id_hd: 1, so_hd: 'HD-2025-001' }, 
    { id_hd: 2, so_hd: 'HD-2025-002' }
];

const initialReports = [
    { 
        id_bc: 1, id_hd: 1, thoi_gian_tao: '2025-09-15 10:30:00',
        tong_npl_nhap: 15000.50, tong_npl_su_dung: 14800.00, tong_npl_ton: 200.50,
        tong_sp_xuat: 10000, ket_luan: 'HopLe', trang_thai: 'HopLe', so_hd: 'HD-2025-001'
    },
];

const ThanhKhoan = () => {
    const [form] = Form.useForm();
    const [reports, setReports] = useState(initialReports);
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isViewModalVisible, setViewModalVisible] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCreateReport = () => {
        form.validateFields().then(values => {
            setLoading(true);
            setCreateModalVisible(false);
            
            // Giả lập quá trình tạo báo cáo mất 2 giây
            setTimeout(() => {
                const selectedHD = hopDongList.find(hd => hd.id_hd === values.id_hd);
                const newReport = {
                    id_bc: Date.now(), id_hd: values.id_hd, so_hd: selectedHD.so_hd,
                    thoi_gian_tao: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    tong_npl_nhap: 20000.00, tong_npl_su_dung: 19500.00, tong_npl_ton: 500.00,
                    tong_sp_xuat: 15000, ket_luan: 'DuNPL', trang_thai: 'HopLe'
                };
                setReports([...reports, newReport]);
                setLoading(false);
                message.success(`Tạo báo cáo thanh khoản cho hợp đồng ${selectedHD.so_hd} thành công!`);
            }, 2000);
        });
    };

    const handleViewReport = (report) => {
        setSelectedReport(report);
        setViewModalVisible(true);
    };

    const getKetLuanTag = (ketLuan) => {
        switch (ketLuan) {
            case 'HopLe': return <Tag color="success">Hợp lệ</Tag>;
            case 'DuNPL': return <Tag color="warning">Dư NPL</Tag>;
            case 'ViPham': return <Tag color="error">Vi phạm</Tag>;
            default: return <Tag>{ketLuan}</Tag>;
        }
    };
    
    const columns = [
        { title: 'Số Hợp đồng', dataIndex: 'so_hd', key: 'so_hd' },
        { title: 'Thời gian tạo', dataIndex: 'thoi_gian_tao', key: 'thoi_gian_tao' },
        { title: 'Kết luận', dataIndex: 'ket_luan', key: 'ket_luan', render: getKetLuanTag },
        { title: 'Trạng thái', dataIndex: 'trang_thai', key: 'trang_thai', render: (text) => <Tag color="blue">{text}</Tag> },
        {
            title: 'Hành động', key: 'action', render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => handleViewReport(record)}>Xem chi tiết</Button>
                    <Button icon={<DownloadOutlined />}>Tải file</Button>
                </Space>
            ),
        },
    ];

    return (
        <Spin spinning={loading} tip="Đang xử lý và tạo báo cáo...">
            <div>
                <Title level={3}>Thanh khoản & Báo cáo</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)} style={{ marginBottom: 16 }}>
                    Tạo Báo cáo Thanh khoản mới
                </Button>
                <Table columns={columns} dataSource={reports} rowKey="id_bc" bordered />

                {/* Modal để tạo báo cáo mới */}
                <Modal title="Tạo Báo cáo Thanh khoản" open={isCreateModalVisible}
                       onOk={handleCreateReport} onCancel={() => setCreateModalVisible(false)}
                       okText="Tạo" cancelText="Hủy">
                    <Form form={form} layout="vertical">
                        <Form.Item name="id_hd" label="Chọn Hợp đồng cần thanh khoản" rules={[{ required: true }]}>
                            <Select placeholder="Chọn hợp đồng">{hopDongList.map(hd => <Option key={hd.id_hd} value={hd.id_hd}>{hd.so_hd}</Option>)}</Select>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Modal để xem chi tiết báo cáo */}
                {selectedReport && (
                    <Modal title={`Chi tiết Báo cáo Thanh khoản cho HĐ: ${selectedReport.so_hd}`}
                           open={isViewModalVisible} onCancel={() => setViewModalVisible(false)} footer={null}>
                        <p><Text strong>Thời gian tạo:</Text> {selectedReport.thoi_gian_tao}</p>
                        <p><Text strong>Kết luận thanh khoản:</Text> {getKetLuanTag(selectedReport.ket_luan)}</p>
                        <hr style={{margin: '16px 0'}}/>
                        <p><Text strong>Tổng NPL đã nhập:</Text> {selectedReport.tong_npl_nhap.toLocaleString()}</p>
                        <p><Text strong>Tổng NPL đã sử dụng:</Text> {selectedReport.tong_npl_su_dung.toLocaleString()}</p>
                        <p><Text strong>Tổng NPL còn tồn:</Text> {selectedReport.tong_npl_ton.toLocaleString()}</p>
                        <p><Text strong>Tổng Sản phẩm đã xuất:</Text> {selectedReport.tong_sp_xuat.toLocaleString()}</p>
                    </Modal>
                )}
            </div>
        </Spin>
    );
};

export default ThanhKhoan;